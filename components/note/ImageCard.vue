<template>
  <v-card class="rounded-lg" elevation="5">
    <v-card-text>
      <div v-if="url" class="position-relative">
        <v-btn fab dark x-small class="pin-btn" @click="togglePin">
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
        <v-btn fab dark x-small class="delete-btn" @click="deleteImage">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-textarea v-model="note.title" rows="1" auto-grow label="Title"></v-textarea>
      <v-textarea v-model="note.content" filled auto-grow label="Create note"></v-textarea>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
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
  url: string = '';

  note: Note = this.initialNote
    ? JSON.parse(JSON.stringify(this.initialNote))
    : {
        title: '',
        content: '',
        pinned: false,
      };

  @Emit('close')
  close() {}

  @Watch('imageRef', {
    immediate: true,
  })
  watchImageRef(path: string) {
    if (!path) return;
    this.getURL(path);
  }

  getURL(path: string) {
    noteStore.getURl(path).then((url) => {
      this.url = url;
    });
  }

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = { ...this.initialNote };
    this.note.imagePath && this.getURL(this.note.imagePath);
  }

  handleClose() {
    if (this.initialNote) {
      this.close();
    }
    this.deleteImage();
  }

  async deleteImage() {
    const ref = this.note.imagePath || this.imageRef;
    const filename = `${ref}`.split('/').pop();
    if (!filename) return;

    await noteStore.deleteFile(filename).then(() => {
      this.note.imagePath = '';
      this.close();
    });
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

  created() {
    if (this.initialNote?.imagePath) {
      this.getURL(this.initialNote?.imagePath);
    }
  }
}
</script>
<style lang="scss" scoped>
.position-relative {
  position: relative;
}
.pin-btn {
  position: absolute;
  z-index: 1;
  top: 5px;
  right: 5px;
}
.delete-btn {
  position: absolute;
  z-index: 1;
  right: 5px;
  bottom: 5px;
}
</style>
