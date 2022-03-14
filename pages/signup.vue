<template>
  <v-layout justify-center align-center class="auth-layout">
    <sign-in-form></sign-in-form>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SignInForm from '~/components/auth/SignInForm.vue'

@Component({
  name: 'SigninPage',
  components: {
    SignInForm,
  },
  layout: 'auth',
  head() {
    return {
      title: 'Sign In',
    }
  },
})
export default class SignUp extends Vue {
  layout = 'auth'
}
</script>
<style scoped>
.auth-layout {
  height: 100%;
  background-color: azure;
}
</style>
