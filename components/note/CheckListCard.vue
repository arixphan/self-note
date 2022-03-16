<template>
  <v-card class="rounded-lg" elevation="5">
    <v-card-title>
      <v-textarea v-model="note.title" rows="1" auto-grow label="Title"></v-textarea>
      <v-btn icon class="align-self-baseline" @click="togglePin">
        <v-icon v-if="note.pinned">mdi-pin</v-icon>
        <v-icon v-else>mdi-pin-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- not done list -->
      <div
        v-for="item in notDoneTasks"
        :id="item.id"
        :key="item.id"
        class="checklist__item"
        draggable="true"
        @dragstart="onDrag($event, item.id)"
        @dragover.prevent
      >
        <v-btn class="checklist__item__dnd" icon>
          <v-icon>mdi-drag-vertical</v-icon>
        </v-btn>
        <v-simple-checkbox :value="item.done" @click="onCheckBoxChange(!item.done, item.id)"></v-simple-checkbox>
        <v-textarea
          :ref="`${item.id}Ref`"
          :value="item.task"
          class="checklist__item__input"
          rows="1"
          auto-grow
          dense
          hide-details
          solo
          @input="onInputChange($event, item.id)"
        ></v-textarea>
        <v-btn icon @click="removeTask(item.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- create new input -->
      <div class="checklist__item">
        <v-icon>mdi-plus</v-icon>
        <v-textarea
          ref="newTask"
          class="checklist__item__input"
          rows="1"
          auto-grow
          dense
          hide-details
          placeholder="Check list"
          solo
          @input="addCheckListItem"
        ></v-textarea>
      </div>

      <v-divider v-if="doneTasks.length > 0" class="my-5" />

      <!-- done list -->
      <div v-for="item in doneTasks" :key="item.id" class="checklist__item">
        <v-btn class="checklist__item__dnd" icon>
          <v-icon>mdi-drag-vertical</v-icon>
        </v-btn>
        <v-simple-checkbox :value="item.done" @click="onCheckBoxChange(!item.done, item.id)"></v-simple-checkbox>
        <v-textarea
          :ref="`${item.id}Ref`"
          :value="item.task"
          class="checklist__item__input text-decoration-line-through"
          rows="1"
          auto-grow
          dense
          hide-details
          solo
          @input="onInputChange($event, item.id)"
        ></v-textarea>
        <v-btn icon @click="removeTask(item.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn text @click="close"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { nanoid } from 'nanoid';
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Note, CheckList } from '~/store/models/note';

@Component({
  name: 'CheckListCard',
  components: {},
})
export default class CheckListCard extends Vue {
  @Prop({ required: false }) initialNote!: Note;
  creationText: string = 'Create note...';
  isCreating: boolean = false;

  newTask: string = '';

  note: Pick<Note, 'title' | 'checklist' | 'pinned'> = this.initialNote
    ? JSON.parse(JSON.stringify(this.initialNote))
    : {
        title: '',
        checklist: [],
        pinned: false,
      };

  @Emit('close')
  close() {}

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = JSON.parse(JSON.stringify(this.initialNote));
  }

  togglePin() {
    this.note.pinned = !this.note.pinned;
  }

  addCheckListItem(value: string) {
    if (!value) return;
    const blankItem: CheckList = {
      id: nanoid(),
      done: false,
      task: value,
      order: (this.note?.checklist?.length || 0) + 1,
    };

    this.note?.checklist?.push(blankItem);
    this.newTaskRef.reset();

    this.$nextTick(() => {
      (this.$refs[`${blankItem.id}Ref`] as Vue & { focus: () => void }[])[0]?.focus();
    });
  }

  onInputChange(text: string, id: string) {
    const index = this.note?.checklist?.findIndex((item) => item.id === id);
    if (index === undefined || index < 0) return;
    this.note!.checklist![index].task = text;
  }

  onCheckBoxChange(value: boolean, id: string) {
    const index = this.note?.checklist?.findIndex((item) => item.id === id);
    if (index === undefined || index < 0) return;
    this.note!.checklist![index].done = value;
  }

  removeTask(id: string) {
    const index = this.note?.checklist?.findIndex((item) => item.id === id);
    if (index === undefined || index < 0) return;
    this.note!.checklist!.splice(index, 1);
  }

  //
  onDrag(e: DragEvent, id: string) {
    // e.dataTransfer.setDragImage(crt, 0, 0)
  }

  getNote(): Note {
    return {
      type: 'checklist',
      ...this.note,
      checklist: this.note!.checklist!.map((item, i) => ({ ...item, order: i })),
    };
  }

  get newTaskRef(): Vue & { reset: () => void } {
    return this.$refs.newTask as Vue & { reset: () => void };
  }

  get notDoneTasks(): CheckList[] {
    return this.note?.checklist?.filter((item) => !item.done) || [];
  }

  get doneTasks(): CheckList[] {
    return this.note?.checklist?.filter((item) => !!item.done) || [];
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .checklist__item {
    display: flex;

    &__dnd {
      visibility: hidden;
    }

    &__input {
      .v-input__control .v-input__slot {
        box-shadow: none !important;
      }
    }

    &:hover {
      border-top: 1px solid black;
      border-bottom: 1px solid black;

      .checklist__item__dnd {
        visibility: visible;
      }
    }
  }
}
</style>
