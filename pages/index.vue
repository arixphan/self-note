<template>
  <div>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon />
      <v-text-field
        class="mx-5"
        outlined
        dense
        hide-details
        placeholder="Search..."
      ></v-text-field>
    </v-app-bar>
    <div class="d-flex my-5 justify-center">
      <creation-note-card></creation-note-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CreationNoteCard from '~/components/note/CreationNoteCard.vue'
import { exampleStore } from '~/store'

@Component({
  name: 'NotePage',
  layout: 'default',
  components: {
    CreationNoteCard,
  },
})
export default class NotePage extends Vue {
  creationText: string = 'Create note...'

  get wheel() {
    return exampleStore.wheels
  }

  set wheel(val) {
    exampleStore.change(+val)
  }

  get myThings() {
    console.log(exampleStore)
    return 'test'
  }

  created() {
    exampleStore.fetchUser()
  }

  updated() {
    console.log('update')
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
