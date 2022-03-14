<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
    <notification></notification>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Notification from '~/components/common/Notification.vue'
@Component({
  name: 'AuthLayout',
  components: {
    Notification,
  },
})
export default class AuthLayout extends Vue {}
</script>
