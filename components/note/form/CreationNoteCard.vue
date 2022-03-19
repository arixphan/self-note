<template>
  <div class="note-bar">
    <component
      :is="currentComponent"
      v-if="isCreating"
      ref="noteForm"
      v-click-outside="onFinishCreation"
      :image-ref="imageRef"
      @close="close"
    ></component>
    <v-card v-else class="note-bar__card rounded-lg" elevation="5">
      <input :value="creationText" class="note-bar__card__text" @focus="toggleIsCreating(true, 'text')" />
      <v-btn large icon @click="toggleIsCreating(true, 'checklist')">
        <v-icon>mdi-checkbox-marked-outline</v-icon>
      </v-btn>
      <v-btn large icon @click="openUpload"><v-icon>mdi-image-outline</v-icon></v-btn>
    </v-card>

    <input ref="file" class="d-none" type="file" accept="image/*" @change="onFileChange" />
    <v-overlay :value="isUploading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextNoteCard from '~/components/note/form/TextNoteCard.vue';
import CheckListCard from '~/components/note/form/CheckListCard.vue';
import ImageCard from '~/components/note/form/ImageCard.vue';
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
  isUploading: boolean = false;
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
    this.isUploading = true;
    noteStore.uploadFile(uploadedFile).then((ref) => {
      this.imageRef = ref as string;
      this.toggleIsCreating(true, 'image');
      this.isUploading = false;
    });
  }

  close() {
    this.toggleIsCreating(false, null);
  }
}
</script>
<style lang="scss" scoped>
.note-bar {
  width: 40%;
  &__card {
    display: flex;
    &__text {
      width: 100%;
      padding: 0px 5px;
    }
    &__text:focus-visible {
      outline: none;
    }
  }
}

@media only screen and (max-width: 768px) {
  .note-card {
    width: 100%;
    margin-left: 50px;
    margin-right: 50px;
  }
}
</style>
