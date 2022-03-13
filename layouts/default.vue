<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'DefaultLayout',
  middleware: 'auth',
})
export default class Default extends Vue {}
</script>
