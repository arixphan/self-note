export interface User {
  name: string
  email: string
}

export type RegisterUser = User & { password: string }
