import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
} from 'vuex-module-decorators'

import { StoreDB } from '~/plugins/firebase'

interface User {
  name: String
  email: String
  id: String
}

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
export default class MyModule extends VuexModule {
  wheels = 2
  users: User[] = []

  @Mutation
  change(extra: number) {
    this.wheels = extra
  }

  get axles() {
    return this.wheels / 2
  }

  @MutationAction({ mutate: ['users'] })
  async fetchUser(): Promise<{ users: User[] }> {
    const snapshots = await StoreDB.collection('users').get()
    const users: User[] = []
    snapshots.forEach((snapshot) => {
      users.push({ ...(snapshot.data() as User), id: snapshot.id })
    })
    console.log('users', users)
    return { users }
  }
}
