<template>
  <div>
    <component
      :is="currentComponent"
      v-if="isCreating"
      ref="noteForm"
      class="note-card"
      v-click-outside="onFinishCreation"
      :image-ref="imageRef"
      @close="close"
    ></component>
    <v-card v-else class="creation-card rounded-lg" elevation="5" min-width="600px">
      <input :value="creationText" class="creation-card__text" @focus="toggleIsCreating(true, 'text')" />
      <v-btn large icon @click="toggleIsCreating(true, 'checklist')">
        <v-icon>mdi-checkbox-marked-outline</v-icon>
      </v-btn>
      <v-btn large icon @click="openUpload"><v-icon>mdi-image-outline</v-icon></v-btn>
    </v-card>

    <input ref="file" class="d-none" type="file" accept="image/*" @change="onFileChange" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextNoteCard from '~/components/note/TextNoteCard.vue';
import CheckListCard from '~/components/note/CheckListCard.vue';
import ImageCard from '~/components/note/ImageCard.vue';
import { Note } from '~/store/models/note';

import { noteStore } from '~/store';

type CreationType = 'text' | 'checklist' | 'image' | null;

@Component({
  name: 'CreationNoteCard',
  components: {
    TextNoteCard,
    CheckListCard,
    ImageCard,
  },
})
export default class CreationNoteCard extends Vue {
  creationText: string = 'Create note...';
  isCreating: boolean = false;
  creationType: CreationType = null;
  imageRef: string = '';

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
    return this.$refs.noteForm as Vue & { getNote: () => Note };
  }

  toggleIsCreating(value: boolean, type: CreationType): void {
    this.isCreating = value;
    this.creationType = type;
  }

  onFinishCreation() {
    const note: Note = (this.$refs.noteForm as Vue & { getNote: () => Note }).getNote();
    let isEmpty = false;
    switch (note.type) {
      case 'text':
        isEmpty = !`${note.title}${note.content}`.trim();
        break;
      case 'checklist':
        isEmpty = !`${note.title}`.trim() && note.checklist?.length === 0;
        break;
      case 'image':
        isEmpty = !`${note.title}${note.content}`.trim() && !note.imagePath;
        break;
    }
    this.toggleIsCreating(false, null);
    if (isEmpty) return;
    noteStore.createNote(note);
  }

  openUpload() {
    (this.$refs.file as Vue & { click: () => void }).click();
  }

  onFileChange(file: Event) {
    const uploadedFile = (file.target as EventTarget & { files: FileList }).files[0];

    if (!uploadedFile) return;
    noteStore.uploadFile(uploadedFile).then((ref) => {
      this.imageRef = ref as string;
      this.toggleIsCreating(true, 'image');
    });
  }

  close() {
    this.toggleIsCreating(false, null);
  }
}
</script>
<style lang="scss" scoped>
.creation-card {
  display: flex;
  &__text {
    width: 100%;
    padding: 0px 5px;
  }
  &__text:focus-visible {
    outline: none;
  }
}

.note-card {
  min-width: 600px;
}
</style>
