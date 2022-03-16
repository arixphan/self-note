<template>
  <v-card class="rounded-lg" elevation="5" min-height="100px" max-height="400px">
    <div v-if="url" class="position-relative">
      <v-btn fab dark x-small class="pin-btn" @click="togglePin">
        <v-icon v-if="note.pinned">mdi-pin</v-icon>
        <v-icon v-else>mdi-pin-outline</v-icon>
      </v-btn>
      <v-img :src="url" :class="imageClasses" max-width="600" max-height="800">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>
    <v-card-text v-if="note.title || note.content">
      <h2 class="title">{{ note.title }}</h2>
      <p class="content">{{ note.content }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Note } from '~/store/models/note';
import { noteStore } from '~/store';

@Component({
  name: 'ImageNote',
  components: {},
})
export default class ImageNote extends Vue {
  @Prop({ required: false }) initialNote!: Note;

  url: string = '';

  note: Note = this.initialNote
    ? JSON.parse(JSON.stringify(this.initialNote))
    : {
        title: '',
        content: '',
        pinned: false,
      };

  get imageClasses() {
    return this.note.title && this.note.content ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-lg';
  }

  @Watch('initialNote')
  initNoteInput(newVal: Note) {
    if (!newVal) return;
    this.note = { ...this.initialNote };
  }

  @Watch('note.imagePath')
  getURL(path: string) {
    if (!path) return;
    noteStore.getURl(path).then((url) => {
      this.url = url;
    });
  }

  togglePin() {
    this.note.pinned = !this.note.pinned;
  }

  created() {
    this.note.imagePath && this.getURL(this.note.imagePath);
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
.title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
.content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
}
</style>
