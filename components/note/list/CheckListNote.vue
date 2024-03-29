<template>
  <v-card class="rounded-lg overflow-hidden" elevation="5" min-height="100px" max-height="400px">
    <v-card-text>
      <div>
        <v-btn fab dark x-small class="float-right" @click.stop @click="togglePinned">
          <v-icon v-if="note.pinned">mdi-pin</v-icon>
          <v-icon v-else>mdi-pin-outline</v-icon>
        </v-btn>
        <h2 class="title">{{ note.title }}</h2>
      </div>
      <!-- not done list -->
      <div v-for="item in notDoneTasks" :id="item.id" :key="item.id" class="checklist__item">
        <v-simple-checkbox
          :value="item.done"
          disabled
          @click="onCheckBoxChange(!item.done, item.id)"
        ></v-simple-checkbox>
        <p class="mb-0">{{ item.task }}</p>
      </div>

      <v-divider v-if="doneTasks.length > 0 && notDoneTasks.length > 0" class="my-5" />

      <!-- done list -->
      <div v-for="item in doneTasks" :key="item.id" class="checklist__item">
        <v-simple-checkbox
          :value="item.done"
          disabled
          @click="onCheckBoxChange(!item.done, item.id)"
        ></v-simple-checkbox>
        <p class="mb-0">{{ item.task }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Note, CheckList } from '~/store/models/note';

@Component({
  name: 'CheckListNote',
  components: {},
})
export default class CheckListNote extends Vue {
  @Prop({ required: false }) initialNote!: Note;
  creationText: string = 'Create note...';
  isCreating: boolean = false;

  // if initial note data exists, setup note with initial value
  note: Pick<Note, 'title' | 'checklist' | 'pinned' | 'id'> = this.initialNote
    ? JSON.parse(JSON.stringify(this.initialNote))
    : {
        title: '',
        checklist: [],
        pinned: false,
      };

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = JSON.parse(JSON.stringify(this.initialNote));
  }

  @Emit('toggle-pinned')
  togglePinned() {
    return { id: this.note.id, pinned: !this.note.pinned };
  }

  /**
   * handle input checklist item
   *
   * @param {string} text - task text
   * @param {string} id - checklist item id
   * @returns {void}
   */
  onInputChange(text: string, id: string) {
    const index = this.note?.checklist?.findIndex((item) => item.id === id);
    if (index === undefined || index < 0) return;
    this.note!.checklist![index].task = text;
  }

  /**
   * handle pinned
   *
   * @param {boolean} value - pinned value
   * @param {string} id - checklist item id
   * @returns {void}
   */
  onCheckBoxChange(value: boolean, id: string) {
    const index = this.note?.checklist?.findIndex((item) => item.id === id);
    if (index === undefined || index < 0) return;
    this.note!.checklist![index].done = value;
  }

  // TODO: handle dnd
  onDrag(e: DragEvent, id: string) {
    // e.dataTransfer.setDragImage(crt, 0, 0)
  }

  /**
   * get current note data
   *
   * @returns {Note}
   */
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
