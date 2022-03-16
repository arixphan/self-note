import { Module, VuexModule, Action } from 'vuex-module-decorators';
import { auth, StoreDB } from '~/plugins/firebase';
import { setFireStoreDoc } from '~/plugins/firebaseUtils';
import { RegisterUser } from '~/store/models/auth';
@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class Auth extends VuexModule {
  registerData: RegisterUser[] = [];

  @Action({ rawError: true })
  async registerUser(user: RegisterUser) {
    try {
      await auth.createUserWithEmailAndPassword(user.email, user.password);
      await this.context.dispatch('login', user);
      await setFireStoreDoc({
        ref: StoreDB.collection('users').doc(user.email),
        data: { name: user.name, email: user.email },
      });
      await this.context.dispatch('logout');
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  @Action({ rawError: true })
  login({ email, password }: Pick<RegisterUser, 'email' | 'password'>) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  @Action({ rawError: true })
  logout() {
    try {
      return auth.signOut();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
