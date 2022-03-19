<template>
  <v-container fluid>
    <h2 v-if="pinnedNotes.length > 0">Pinned Notes</h2>
    <div class="grid-layout">
      <div v-for="item in pinnedNotes" :key="item.id" class="grid-item" @click="onEdit(item)">
        <text-note
          v-if="item.type === 'text'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></text-note>
        <check-list-note
          v-if="item.type === 'checklist'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></check-list-note>
        <image-note
          v-if="item.type === 'image'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></image-note>
      </div>
      <div class="text-center mb-10">
        <div v-intersect="onPinnedListIntersect"></div>
      </div>
    </div>

    <h2 v-if="notPinnedNotes.length > 0">Other Notes</h2>
    <div class="grid-layout">
      <div v-for="item in notPinnedNotes" :key="item.id" class="grid-item" @click="onEdit(item)">
        <text-note
          v-if="item.type === 'text'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></text-note>
        <check-list-note
          v-if="item.type === 'checklist'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></check-list-note>
        <image-note
          v-if="item.type === 'image'"
          class="note-card"
          :initial-note="item"
          @toggle-pinned="togglePinned"
        ></image-note>
      </div>
      <div class="text-center mb-10">
        <div v-intersect="onNotPinnedListIntersect"></div>
      </div>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import TextNote from '~/components/note/list/TextNote.vue';
import CheckListNote from '~/components/note/list/CheckListNote.vue';
import ImageNote from '~/components/note/list/ImageNote.vue';
import TextNoteCard from '~/components/note/form/TextNoteCard.vue';
import CheckListCard from '~/components/note/form/CheckListCard.vue';
import ImageCard from '~/components/note/form/ImageCard.vue';

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
  isFetching: boolean = false;
  editedNote: Note | null = null;
  limit: number = 50;
  pinnedOffset: number = this.limit;
  notPinnedOffset: number = this.limit;

  get pinnedNotes() {
    return noteStore.getPinnedNote.slice(0, this.pinnedOffset);
  }

  get notPinnedNotes() {
    return noteStore.getNotPinnedNote.slice(0, this.notPinnedOffset);
  }

  get lengthOfPinned() {
    return noteStore.getPinnedNote.length;
  }

  get lengthOfNotPinned() {
    return noteStore.getNotPinnedNote.length;
  }

  get searchKey() {
    return noteStore.searchKey;
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

  /**
   * when searching value change reset offset to re fetch notes
   * @returns {void}
   */
  @Watch('searchKey')
  resetOffset() {
    this.pinnedOffset = this.limit;
    this.notPinnedOffset = this.limit;
  }

  /**
   *in case pinned notes increase due to adding, increase offset
   * @returns {void}
   */
  @Watch('lengthOfPinned')
  setPinnedOffset(length: number) {
    if (this.pinnedOffset < length && Math.floor(length / this.pinnedOffset) === 1) {
      this.pinnedOffset += this.limit;
    }
  }

  /**
   *in case other notes increase due to adding, increase offset
   * @returns {void}
   */ @Watch('lengthOfNotPinned')
  setNotPinnedOffset(length: number) {
    if (this.notPinnedOffset < length && Math.floor(length / this.notPinnedOffset) === 1) {
      this.notPinnedOffset += this.limit;
    }
  }

  created() {
    // trigger observing
    noteStore.observePinnedNote();
    noteStore.observeNotPinnedNote();
  }

  /**
   * open edit popup and store card type
   * @returns {void}
   */
  toggleEditing(value: boolean, type: CreationType): void {
    this.dialog = value;
    this.creationType = type;
  }

  /**
   * open edit popup
   * cache note data to display on popup
   * open popup according to note type
   * @returns {void}
   */
  onEdit(item: Note) {
    this.editedNote = JSON.parse(JSON.stringify(item));
    this.toggleEditing(true, item.type);
  }

  /**
   * update note, get updated note data from form card then update by id
   *
   * @returns {void}
   */
  handleUpdateNote() {
    const ref = this.$refs.noteForm as Vue & { getNote: () => Note };
    noteStore.updateNote({ ...this.editedNote, ...ref.getNote() });
    this.close();
  }

  /**
   * update pinned value for note
   *
   * @param {id: string, pinned: string} - id: note's id; pinned: pinned value
   * @returns {void}
   */
  togglePinned({ id, pinned }: { id: string; pinned: boolean }) {
    noteStore.updateNote({ id, pinned });
  }

  /**
   * get next chunk of pinned notes when other pined was scrolled to end
   * @param {IntersectionObserverEntry} - entries
   * @returns {void}
   */
  onPinnedListIntersect(entries: IntersectionObserverEntry[]) {
    if (entries[0]?.isIntersecting && this.pinnedOffset < noteStore.getPinnedNote.length) {
      this.pinnedOffset = this.pinnedOffset + this.limit;
    }
  }

  /**
   * get next chunk of other notes when other notes was scrolled to end
   * @param {IntersectionObserverEntry} - entries
   * @returns {void}
   */
  onNotPinnedListIntersect(entries: IntersectionObserverEntry[]) {
    if (entries[0]?.isIntersecting && this.notPinnedOffset < noteStore.getNotPinnedNote.length) {
      this.notPinnedOffset = this.notPinnedOffset + this.limit;
    }
  }

  /**
   * closed editing popup
   * @returns {void}
   */
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
  grid-gap: 10px;
  grid-auto-flow: dense;
  padding: 20px;
}
</style>
