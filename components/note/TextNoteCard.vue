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
      <v-textarea v-model="note.content" filled auto-grow label="Create note"></v-textarea>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn v-if="initialNote" text @click="handleDelete">Remove</v-btn>
      <v-btn text @click="handleClose"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Note } from '~/store/models/note';
import { noteStore } from '~/store';

@Component({
  name: 'TextNoteCard',
  components: {},
})
export default class TextNoteCard extends Vue {
  @Prop({ required: false }) initialNote!: Note;

  creationText: string = 'Create note...';
  isCreating: boolean = false;

  note: Pick<Note, 'title' | 'content' | 'pinned'> = this.initialNote
    ? { ...this.initialNote }
    : {
        title: '',
        content: '',
        pinned: false,
      };

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = { ...this.initialNote };
  }

  @Emit('close')
  close() {}

  @Emit('update:note')
  update() {}

  async handleClose() {
    if (this.initialNote) {
      await this.update();
    }
    this.close();
  }

  togglePin() {
    this.note.pinned = !this.note.pinned;
  }

  getNote(): Note {
    return {
      type: 'text',
      ...this.note,
    };
  }

  handleDelete() {
    noteStore.deleteNote(this.initialNote);
    this.close();
  }
}
</script>
