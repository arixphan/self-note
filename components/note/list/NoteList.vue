<template>
  <v-container fluid class="d-flex flex-wrap">
    <v-flex v-for="item in notPinnedNotes" :key="item.id">
      <text-note v-if="item.type === 'text'" class="note-card" :initial-note="item"></text-note>
      <check-list-note v-if="item.type === 'checklist'" class="note-card" :initial-note="item"></check-list-note>
      <image-note v-if="item.type === 'image'" class="note-card" :initial-note="item"></image-note>
    </v-flex>
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
</style>
