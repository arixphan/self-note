import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $rules: {
      required(value: string): boolean;
      email(value: string): boolean;
      greaterThanOrEqualNumber(value: number): (value: string) => boolean;
    };
  }
}

Vue.prototype.$rules = {
  // validate min length of text
  minLength: (limit: number) => (value: string) =>
    !value || value.trim().length >= limit || `Must be at least ${limit} character`,
  // validate required fields
  required: (value: string) => !!value.trim() || 'This field is required',
  // validate email format
  email: (value: string) =>
    !value || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) || 'E-mail is not valid',
};
