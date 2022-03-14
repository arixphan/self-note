<template>
  <v-card class="rounded-lg" elevation="5" min-width="600px">
    <v-card-title>
      <v-textarea
        v-model="note.title"
        rows="1"
        auto-grow
        label="Title"
      ></v-textarea>
      <v-btn icon class="align-self-baseline" @click="togglePin">
        <v-icon v-if="note.pinned">mdi-pin</v-icon>
        <v-icon v-else>mdi-pin-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-textarea
        v-model="note.content"
        filled
        auto-grow
        label="Create note"
      ></v-textarea>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn text @click="close"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { Note } from '~/store/models/note'
@Component({
  name: 'TextNoteCard',
  components: {},
})
export default class TextNoteCard extends Vue {
  creationText: string = 'Create note...'
  isCreating: boolean = false

  note: Pick<Note, 'title' | 'content' | 'pinned'> = {
    title: '',
    content: '',
    pinned: false,
  }

  @Emit('close')
  close() {}

  togglePin() {
    this.note.pinned = !this.note.pinned
  }
}
</script>
