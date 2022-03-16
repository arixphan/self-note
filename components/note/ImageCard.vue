<template>
  <v-card class="rounded-lg" elevation="5" min-width="600px">
    <v-card-text>
      <div v-if="url" class="position-relative">
        <v-btn fab dark x-small class="pin-btn" @click="togglePin">
          <v-icon v-if="note.pinned">mdi-pin</v-icon>
          <v-icon v-else>mdi-pin-outline</v-icon>
        </v-btn>
        <v-img :src="url" max-width="600" max-height="800">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-btn fab dark x-small class="delete-btn" @click="togglePin">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-textarea
        v-model="note.title"
        rows="1"
        auto-grow
        label="Title"
      ></v-textarea>
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
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Note } from '~/store/models/note'
import { Storage } from '~/plugins/firebase'
@Component({
  name: 'ImageCard',
  components: {},
})
export default class ImageCard extends Vue {
  @Prop(String) readonly imageRef!: string

  creationText: string = 'Create note...'
  isCreating: boolean = false
  url: string = ''

  note: Pick<Note, 'title' | 'content' | 'pinned'> = {
    title: '',
    content: '',
    pinned: false,
  }

  @Emit('close')
  close() {}

  @Watch('imageRef', {
    immediate: true,
  })
  getUrl(ref: string) {
    console.log('imageRef', ref)
    if (!ref) return
    Storage.ref(ref)
      .getDownloadURL()
      .then((url) => {
        console.log(url)
        this.url = url
      })
  }

  togglePin() {
    this.note.pinned = !this.note.pinned
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
