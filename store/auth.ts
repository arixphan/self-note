import { Module, VuexModule, Action } from 'vuex-module-decorators';
import firebase from 'firebase/compat';
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

  /**
   * register new account
   * - create authentication account
   * - create user account
   *
   * @param {RegisterUser} user - registered user info
   * @returns Promise
   */
  @Action({ rawError: true })
  async registerUser(user: RegisterUser): Promise<void> {
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

  /**
   * login account
   *
   * @param {string} email - user email
   * @param {string} password - user password
   * @returns {Promise<firebase.auth.UserCredential>}
   */
  @Action({ rawError: true })
  login({ email, password }: Pick<RegisterUser, 'email' | 'password'>): Promise<firebase.auth.UserCredential> {
    return auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * logout account
   * @returns {Promise<void>}
   */
  @Action({ rawError: true })
  logout(): Promise<void> {
    try {
      return auth.signOut();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
