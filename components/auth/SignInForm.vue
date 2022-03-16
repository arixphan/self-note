<template>
  <v-card width="300px" elevation="5" min-height="350px" max-height="500px" class="rounded-lg">
    <v-card-title class="justify-center">Register</v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="input.email"
          label="E-mail"
          required
          :rules="[$rules.required, $rules.email]"
          dense
          autocomplete="false"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="input.name"
          label="Name"
          :rules="[$rules.required]"
          required
          dense
          outlined
        ></v-text-field>
        <v-text-field
          v-model="input.password"
          label="Password"
          type="password"
          autocomplete="false"
          :rules="[$rules.required, $rules.minLength(6), isPasswordMatched]"
          required
          dense
          outlined
        ></v-text-field>

        <v-text-field
          v-model="input.confirmPassword"
          label="Confirm Password"
          type="password"
          :rules="[$rules.required, $rules.minLength(6), isPasswordMatched]"
          required
          dense
          outlined
        ></v-text-field>
        <v-btn color="success" width="100%" class="mt-2" @click="submit"> Submit </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { RegisterUser } from '~/store/models/auth';
import { authStore } from '~/store';

type Input = RegisterUser & { confirmPassword: String };

@Component({
  name: 'SignInForm',
})
export default class LoginForm extends Vue {
  input: Input = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  };

  submit() {
    if (!this.form.validate()) return;

    authStore
      .registerUser({
        email: this.input.email,
        name: this.input.name,
        password: this.input.password,
      } as RegisterUser)
      .then(() => {
        this.$router.push({ name: 'login' });
      })
      .catch((error) => {
        this.$notifyError(error.message);
      });
  }

  get form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  get isPasswordMatched() {
    if (!this.input.confirmPassword) return true;
    return this.input.password === this.input.confirmPassword || 'Password does not match';
  }
}
</script>
