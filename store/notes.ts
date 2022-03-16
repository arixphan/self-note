import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action,
} from 'vuex-module-decorators'

import { StoreDB, Storage, auth } from '~/plugins/firebase'

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

  @Action({ rawError: true })
  uploadFile(file: File) {
    const ref = Storage.ref()
    const currentUserId = auth.currentUser?.email

    const fileName = file.name + '_' + new Date().getTime()
    const fileRef = 'users/' + currentUserId + '/' + fileName

    const isUploaded = ref.child(fileRef).put(file)
    return new Promise((resolve, reject) => {
      isUploaded.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error)
        },
        () => {
          resolve(fileRef)
        }
      )
    })
  }
}
