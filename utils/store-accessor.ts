/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Note from '~/store/notes'
import Auth from '~/store/auth'

let exampleStore: Note
let authStore: Auth

function initialiseStores(store: Store<any>): void {
  exampleStore = getModule(Note, store)
  authStore = getModule(Auth, store)
}

export { initialiseStores, exampleStore, authStore }
