<template>
  <div>
    <v-app-bar fixed app>
      <v-text-field
        v-model="searchKey"
        class="mx-5"
        outlined
        dense
        hide-details
        placeholder="Search..."
        @input="onChange"
      ></v-text-field>
      <div v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn class="mr-2" @click="generate">Generate Notes</v-btn>
        <v-btn @click="logout">Logout</v-btn>
      </div>
      <v-app-bar-nav-icon v-else />
    </v-app-bar>
    <div class="d-flex my-5 justify-center">
      <creation-note-card></creation-note-card>
    </div>
    <note-list />
  </div>
</template>

<script lang="ts">
import { NuxtState } from '@nuxt/types/app';
import { Vue, Component } from 'vue-property-decorator';
import CreationNoteCard from '~/components/note/form/CreationNoteCard.vue';
import NoteList from '~/components/note/list/NoteList.vue';
import { noteStore, authStore } from '~/store';

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

  get searchKey() {
    return noteStore.getSearchKey;
  }

  set searchKey(search: string) {
    noteStore.setSearchKey(search);
  }

  generate() {
    noteStore.generateNotes();
  }

  onChange() {
    (this as Record<any, any>).$vuetify.goTo(0);
  }

  logout() {
    authStore.logout().then(() => {
      location.reload();
    });
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
