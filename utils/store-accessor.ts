/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import Note from '~/store/notes';
import Auth from '~/store/auth';
import Notification from '~/store/notification';

let noteStore: Note;
let authStore: Auth;
let notificationStore: Notification;

function initialiseStores(store: Store<any>): void {
  noteStore = getModule(Note, store);
  authStore = getModule(Auth, store);
  notificationStore = getModule(Notification, store);
}

export { initialiseStores, noteStore, authStore, notificationStore };
