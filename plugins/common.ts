import { Plugin } from '@nuxt/types'
import { notificationStore } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $notifyInfo(message: string): void
    $notifyError(message: string): void
    $notifyWarning(message: string): void
  }
}

const common: Plugin = (context, inject) => {
  inject('notifyInfo', (message: string): void => {
    notificationStore.mutateNotification({
      text: message,
      isShow: true,
      color: '#68cd86',
    })
  })
  inject('notifyError', (message: string): void => {
    console.log('run', message)
    notificationStore.mutateNotification({
      text: message,
      isShow: true,
      color: '#e54d42',
    })
  })
  inject('notifyWarning', (message: string): void => {
    notificationStore.mutateNotification({
      text: message,
      isShow: true,
      color: '#ffb648',
    })
  })
}

export default common
