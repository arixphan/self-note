<template>
  <v-container fluid class="grid-layout">
    <div v-for="item in notPinnedNotes" :key="item.id" class="grid-item">
      <text-note v-if="item.type === 'text'" class="note-card" :initial-note="item"></text-note>
      <check-list-note v-if="item.type === 'checklist'" class="note-card" :initial-note="item"></check-list-note>
      <image-note v-if="item.type === 'image'" class="note-card" :initial-note="item"></image-note>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TextNote from '~/components/note/list/TextNote.vue';
import CheckListNote from '~/components/note/list/CheckListNote.vue';
import ImageNote from '~/components/note/list/ImageNote.vue';

import { noteStore } from '~/store';

@Component({
  name: 'NoteList',
  components: {
    TextNote,
    ImageNote,
    CheckListNote,
  },
})
export default class NoteList extends Vue {
  get pinnedNotes() {
    return noteStore.getPinnedNote;
  }

  get notPinnedNotes() {
    return noteStore.getNotPinnedNote;
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
