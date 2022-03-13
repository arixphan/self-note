import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $rules: {
      required(value: string): boolean
      email(value: string): boolean
      greaterThanOrEqualNumber(value: number): (value: string) => boolean
    }
  }
}

Vue.prototype.$rules = {
  minLength: (limit: number) => (value: string) =>
    !value ||
    value.trim().length >= limit ||
    `Must be at least ${limit} character`,

  required: (value: string) => !!value.trim() || 'This field is required',
  email: (value: string) =>
    !value ||
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ||
    'E-mail is not valid',
}
