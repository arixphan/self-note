<template>
  <v-layout justify-center align-center class="auth-layout">
    <login-form></login-form>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LoginForm from '~/components/auth/LoginForm.vue'

@Component({
  name: 'LoginPage',
  components: {
    LoginForm,
  },
  layout: 'auth',
  head() {
    return {
      title: 'Log In',
    }
  },
})
export default class MyStore extends Vue {
  layout = 'auth'
}
</script>
<style scoped>
.auth-layout {
  height: 100%;
  background-color: azure;
}
</style>
