<template>
  <v-container fluid class="grid-layout">
    <div v-for="item in notPinnedNotes" :key="item.id" class="grid-item" @click="onEdit(item)">
      <text-note v-if="item.type === 'text'" class="note-card" :initial-note="item"></text-note>
      <check-list-note v-if="item.type === 'checklist'" class="note-card" :initial-note="item"></check-list-note>
      <image-note v-if="item.type === 'image'" class="note-card" :initial-note="item"></image-note>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <component
        :is="currentComponent"
        v-if="dialog"
        ref="noteForm"
        v-click-outside="handleUpdateNote"
        :initial-note="editedNote"
        @update:note="handleUpdateNote"
        @close="close"
      ></component>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextNote from '~/components/note/list/TextNote.vue';
import CheckListNote from '~/components/note/list/CheckListNote.vue';
import ImageNote from '~/components/note/list/ImageNote.vue';
import TextNoteCard from '~/components/note/TextNoteCard.vue';
import CheckListCard from '~/components/note/CheckListCard.vue';
import ImageCard from '~/components/note/ImageCard.vue';

import { Note } from '~/store/models/note';
import { noteStore } from '~/store';

type CreationType = 'text' | 'checklist' | 'image' | null;

@Component({
  name: 'NoteList',
  components: {
    TextNote,
    ImageNote,
    CheckListNote,
    TextNoteCard,
  },
})
export default class NoteList extends Vue {
  dialog: boolean = false;
  creationType: CreationType = null;
  editedNote: Note | null = null;

  get pinnedNotes() {
    return noteStore.getPinnedNote;
  }

  get notPinnedNotes() {
    return noteStore.getNotPinnedNote;
  }

  get currentComponent() {
    switch (this.creationType) {
      case 'text':
        return TextNoteCard;
      case 'checklist':
        return CheckListCard;
      case 'image':
        return ImageCard;
      default:
        return TextNoteCard;
    }
  }

  get noteForm() {
    return;
  }

  toggleEditing(value: boolean, type: CreationType): void {
    this.dialog = value;
    this.creationType = type;
  }

  onEdit(item: Note) {
    this.editedNote = JSON.parse(JSON.stringify(item));
    this.toggleEditing(true, item.type);
  }

  handleUpdateNote() {
    const ref = this.$refs.noteForm as Vue & { getNote: () => Note };
    noteStore.updateNote({ ...this.editedNote, ...ref.getNote() });
    this.close();
  }

  close() {
    this.toggleEditing(false, null);
  }
}
</script>
<style lang="scss" scoped>
.note-card {
  width: 220px;
  max-width: 220px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 220px));
  // grid-template-columns: auto auto auto;

  grid-gap: 10px;
  // grid-auto-rows: minmax(180px, auto);
  grid-auto-flow: dense;
  padding: 20px;
}

// .grid-item {
//   margin: 20px;
// }
</style>
