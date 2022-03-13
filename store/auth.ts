import { Module, VuexModule, Action } from 'vuex-module-decorators'
import { auth, StoreDB } from '~/plugins/firebase'
import { setFireStoreDoc } from '~/plugins/firebaseUtils'
import { RegisterUser } from '~/store/models/auth'
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class Auth extends VuexModule {
  registerData: RegisterUser[] = []

  // eslint-disable-next-line require-await
  @Action
  async registerUser(user: RegisterUser) {
    try {
      await auth.createUserWithEmailAndPassword(user.email, user.password)
      await this.context.dispatch('login', user)
      setFireStoreDoc({
        ref: StoreDB.collection('users').doc(user.email),
        data: { name: user.name, email: user.email },
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @Action
  login({ email, password }: Pick<RegisterUser, 'email' | 'password'>) {
    return auth.signInWithEmailAndPassword(email, password)
  }
}
