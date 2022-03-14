<template>
  <v-snackbar
    :value="config.isShow"
    right
    :timeout="timeout"
    :color="config.color"
    app
    @input="onCloseNotification"
  >
    {{ config.text }}
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { notificationStore } from '~/store'

@Component({
  name: 'NotificationSnackbar',
})
export default class NotificationSnackbar extends Vue {
  timeout = 2000

  get config() {
    return notificationStore.notificationConfig
  }

  onCloseNotification() {
    notificationStore.mutateNotification({
      isShow: false,
      text: '',
      color: 'green',
    })
  }
}
</script>
