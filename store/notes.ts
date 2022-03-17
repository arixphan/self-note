import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators';
import { addFireStoreDoc, getFireStoreRef, updateFireStoreDoc, deleteFireStoreDoc } from '~/plugins/firebaseUtils';
import { StoreDB, Storage, auth } from '~/plugins/firebase';
import { Note } from '~/store/models/note';
import firebase from 'firebase/compat';

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
export default class NoteStore extends VuexModule {
  pinnedNote: Note[] = [];
  notPinnedNote: Note[] = [];

  get getPinnedNote() {
    return [...this.pinnedNote];
  }

  get getNotPinnedNote() {
    return [...this.notPinnedNote];
  }

  @Mutation
  public updatePinnedNotes(notes: Note[]) {
    this.pinnedNote = [...notes];
  }

  @Mutation
  public updateNotPinnedNotes(notes: Note[]) {
    this.notPinnedNote = [...notes];
  }

  @Action({ rawError: true })
  observePinnedNote() {
    const ref = getFireStoreRef(['notes']).where('pinned', '==', true).orderBy('_updated', 'desc');
    ref.onSnapshot((docs: firebase.firestore.DocumentSnapshot[]) => {
      const pinnedNote: Note[] = [];
      docs.forEach((doc) => {
        pinnedNote.push({ ...doc.data(), id: doc.id } as Note);
      });
      this.context.commit('updatePinnedNotes', pinnedNote);
    });
  }

  @Action({ rawError: true })
  observeNotPinnedNote() {
    const ref = getFireStoreRef(['notes']).where('pinned', '==', false).orderBy('_updated', 'desc');
    ref.onSnapshot((docs: firebase.firestore.DocumentSnapshot[]) => {
      const pinnedNote: Note[] = [];
      docs.forEach((doc) => {
        pinnedNote.push({ ...doc.data(), id: doc.id } as Note);
      });
      this.context.commit('updateNotPinnedNotes', pinnedNote);
    });
  }

  @Action({ rawError: true })
  uploadFile(file: File) {
    const ref = Storage.ref();
    const currentUserId = auth.currentUser?.email;

    const fileName = file.name + '_' + new Date().getTime();
    const fileRef = 'users/' + currentUserId + '/' + fileName;

    const isUploaded = ref.child(fileRef).put(file);
    return new Promise((resolve, reject) => {
      isUploaded.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          resolve(fileRef);
        }
      );
    });
  }

  @Action({ rawError: true })
  deleteFile(filename: string) {
    const currentUserId = auth.currentUser?.email;

    const path = 'users/' + currentUserId;
    const ref = Storage.ref(path);
    return ref.child(filename).delete();
  }

  @Action({ rawError: true })
  getURl(path: string) {
    return Storage.ref(path).getDownloadURL();
  }

  @Action({ rawError: true })
  createNote(note: Note) {
    return addFireStoreDoc({
      ref: getFireStoreRef(['notes']),
      data: note,
    });
  }

  @Action({ rawError: true })
  updateNote(note: Note) {
    return updateFireStoreDoc({
      ref: getFireStoreRef(['notes', <string>note.id]),
      data: note,
    });
  }

  @Action({ rawError: true })
  deleteNote(note: Note) {
    return deleteFireStoreDoc(getFireStoreRef(['notes', <string>note.id]));
  }
}
