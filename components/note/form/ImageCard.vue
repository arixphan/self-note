<template>
  <v-card class="image-card rounded-lg" elevation="5">
    <v-card-text>
      <div v-if="url" class="image-card__image">
        <v-btn fab dark x-small class="image-card__image__btn image-card__image__btn--pin" @click="togglePin">
          <v-icon v-if="note.pinned">mdi-pin</v-icon>
          <v-icon v-else>mdi-pin-outline</v-icon>
        </v-btn>
        <v-img :src="url" max-width="600" max-height="800">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-btn fab dark x-small class="image-card__image__btn image-card__image__btn--trash" @click="deleteImage">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-textarea v-model="note.title" rows="1" auto-grow label="Title"></v-textarea>
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
  name: 'ImageCard',
  components: {},
})
export default class ImageCard extends Vue {
  @Prop({ required: false }) initialNote!: Note;
  @Prop(String) readonly imageRef!: string;

  creationText: string = 'Create note...';
  isCreating: boolean = false;
  isLoading: boolean = false;
  url: string = '';

  note: Note = this.initialNote
    ? JSON.parse(JSON.stringify(this.initialNote))
    : {
        title: '',
        content: '',
        pinned: false,
        imagePath: '',
      };

  @Emit('close')
  close() {}

  @Emit('update:note')
  update() {}

  @Watch('imageRef', {
    immediate: true,
  })
  watchImageRef(path: string) {
    if (!path) return;
    this.note.imagePath = path;
    this.getURL(path);
  }

  @Watch('note.imagePath', {
    immediate: true,
  })
  getURL(path: string) {
    if (!path) {
      this.url = '';
      return;
    }
    this.isLoading = true;
    noteStore.getURl(path).then((url) => {
      this.url = url;
      this.isLoading = false;
    });
  }

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = { ...this.initialNote };
  }

  async handleClose() {
    if (this.initialNote) {
      await this.update();
    } else {
      await this.deleteImage();
    }
    this.close();
  }

  async deleteImage() {
    const ref = this.note.imagePath || this.imageRef;
    const filename = `${ref}`.split('/').pop();
    if (!filename) return;

    try {
      await noteStore.deleteFile(filename);
      this.note.imagePath = '';
      if (this.initialNote) {
        this.update();
      }
    } catch (err: unknown) {
      alert(err);
    }

    this.close();
  }

  togglePin() {
    this.note.pinned = !this.note.pinned;
  }

  getNote(): Note {
    return {
      ...this.note,
      type: 'image',
      imagePath: this.note.imagePath !== undefined ? this.note.imagePath : this.imageRef,
    };
  }

  handleDelete() {
    const filename = `${this.note.imagePath}`.split('/').pop();
    noteStore
      .deleteNote(this.initialNote)
      .then(() => {
        if (filename) {
          noteStore.deleteFile(filename).then(() => {
            this.note.imagePath = '';
          });
        }
      })
      .finally(() => {
        this.close();
      });
  }
}
</script>
<style lang="scss" scoped>
.image-card {
  &__image {
    position: relative;

    &__btn {
      position: absolute;
      z-index: 1;

      &--pin {
        top: 5px;
        right: 5px;
      }

      &--trash {
        right: 5px;
        bottom: 5px;
      }
    }
  }
}
</style>
