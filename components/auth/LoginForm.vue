<template>
  <v-card width="300px" elevation="5" height="350px" class="rounded-lg">
    <v-card-title class="justify-center">Login</v-card-title>
    <v-card-text>
      <v-form ref="form" autocomplete="off">
        <v-text-field
          v-model="input.email"
          label="E-mail"
          required
          autocomplete="off"
          :rules="[$rules.required, $rules.email]"
          dense
          outlined
        ></v-text-field>
        <v-text-field
          v-model="input.password"
          label="Password"
          type="password"
          autocomplete="off"
          :rules="[$rules.required, $rules.minLength(6)]"
          required
          dense
          outlined
        ></v-text-field>
        <v-btn color="success" width="100%" class="mt-2" @click="login"> Login </v-btn>
        <div class="mt-4">
          Not registered?
          <nuxt-link to="/signup">Create an account</nuxt-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { authStore } from '~/store';

@Component({
  name: 'LoginForm',
})
export default class LoginForm extends Vue {
  input: { email: string; password: string } = {
    email: '',
    password: '',
  };

  login() {
    if (!this.form.validate()) return;
    authStore
      .login(this.input)
      .then(() => {
        this.$router.push({ name: 'index' });
      })
      .catch((error) => {
        // TODO: create error code constant
        switch (error.code) {
          case 'auth/wrong-password':
            this.$notifyError('Password is incorrect!');
            break;
          case 'auth/user-not-found':
            this.$notifyError('E-mail is incorrect!');
            break;
          default:
            this.$notifyError('Sorry, something wrong!');
            break;
        }
      });
  }

  get form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }
}
</script>
