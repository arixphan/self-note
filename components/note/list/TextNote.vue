<template>
  <v-card class="rounded-lg" elevation="5" min-height="100px" max-height="400px">
    <v-card-text>
      <v-btn fab dark x-small class="float-right" @click.stop @click="togglePinned">
        <v-icon v-if="note.pinned">mdi-pin</v-icon>
        <v-icon v-else>mdi-pin-outline</v-icon>
      </v-btn>
      <h2 class="title">{{ note.title }}</h2>
      <p class="content">{{ note.content }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Note } from '~/store/models/note';

@Component({
  name: 'TextNote',
  components: {},
})
export default class TextNote extends Vue {
  @Prop({ required: false }) initialNote!: Note;

  note: Pick<Note, 'title' | 'content' | 'pinned' | 'id'> = this.initialNote
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

  /**
   * handle update pinned value by emit toggle-pinned of wrapper component
   *
   * @returns {id: string, pinned: string} - id: note's id; pinned: pinned value
   */
  @Emit('toggle-pinned')
  togglePinned() {
    return { id: this.note.id, pinned: !this.note.pinned };
  }
}
</script>

<style lang="scss" scoped>
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
