<template>
  <div>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon />
      <v-text-field class="mx-5" outlined dense hide-details placeholder="Search..."></v-text-field>
    </v-app-bar>
    <div class="d-flex my-5 justify-center">
      <creation-note-card></creation-note-card>
    </div>
    <note-list />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CreationNoteCard from '~/components/note/CreationNoteCard.vue';
import NoteList from '~/components/note/list/NoteList.vue';

import { noteStore } from '~/store';

@Component({
  name: 'NotePage',
  layout: 'default',
  components: {
    CreationNoteCard,
    NoteList,
  },
})
export default class NotePage extends Vue {
  creationText: string = 'Create note...';

  created() {
    noteStore.observePinnedNote();
    noteStore.observeNotPinnedNote();
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
</style>
