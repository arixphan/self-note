<template>
  <v-card width="300px" elevation="5" height="350px" class="rounded-lg">
    <v-card-title class="justify-center">Login</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="input.email"
          label="E-mail"
          required
          dense
          outlined
        ></v-text-field>
        <v-text-field
          v-model="input.password"
          label="Password"
          required
          dense
          outlined
        ></v-text-field>
        <v-btn color="success" width="100%" class="mt-2"> Login </v-btn>
        <div class="mt-4">
          Not registered?
          <nuxt-link to="/signup">Create an account</nuxt-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User } from '~/store/models/users'
@Component({})
export default class LoginForm extends Vue {
  input: User = {
    email: '',
    password: '',
  }
}
</script>
