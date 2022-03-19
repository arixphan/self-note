import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import firebase from 'firebase/compat';
import { addFireStoreDoc, getFireStoreRef, updateFireStoreDoc, deleteFireStoreDoc } from '~/plugins/firebaseUtils';
import { StoreDB, Storage, auth } from '~/plugins/firebase';
import { Note } from '~/store/models/note';

// TODO: server scroll
// let lastPinnedSnapshot: any = null;
// let lastNotPinnedSnapshot: any = null;

/**
 * search note with search key
 * get notes thats title, content, checklist include search key
 *
 * @param {Note[]} notes - list of note
 * @param {string} searchKey - searching value
 * @returns {Note[]} list of note that contains search key
 */
const searchNote = (notes: Note[], searchKey: string) => {
  return notes.filter((note: Note) => {
    const { title = '', content = '', checklist = [] } = note;
    return (
      title.includes(searchKey) ||
      content.includes(searchKey) ||
      checklist.some((item) => item.task?.includes(searchKey))
    );
  });
};

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
export default class NoteStore extends VuexModule {
  pinnedNote: Note[] = [];
  notPinnedNote: Note[] = [];
  searchKey: string = '';

  // TODO: server scroll
  // lastPinnedSnapshot: firebase.firestore.DocumentSnapshot | null = null;
  // lastNotPinnedSnapshot: firebase.firestore.DocumentSnapshot | null = null;
  // isFetchingPinnedCompletely = false;
  // isFetchingNotPinnedCompletely = false;

  // get pinned notes that contains search key
  get getPinnedNote() {
    return searchNote([...this.pinnedNote], this.searchKey);
  }

  // get other notes that contains search key
  get getNotPinnedNote() {
    return searchNote([...this.notPinnedNote], this.searchKey);
  }

  // get search key
  get getSearchKey() {
    return this.searchKey;
  }

  /**
   * update pinned note
   *
   * @param {Note[]} notes - list of notes
   * @returns {void}
   */
  @Mutation
  public updatePinnedNotes(notes: Note[]) {
    this.pinnedNote = [...notes];
  }

  /**
   * concat notes to pinned notes
   *
   * @param {Note[]} notes - list of notes
   * @returns {void}
   */
  @Mutation
  public concatPinnedNotes(notes: Note[]) {
    this.pinnedNote = this.pinnedNote.concat(notes);
  }

  /**
   * update other note
   *
   * @param {Note[]} notes - list of notes
   * @returns {void}
   */
  @Mutation
  public updateNotPinnedNotes(notes: Note[]) {
    this.notPinnedNote = [...notes];
  }

  /**
   * concat note to other notes
   *
   * @param {Note[]} notes - list of notes
   * @returns {void}
   */
  @Mutation
  public concatNotPinnedNotes(notes: Note[]) {
    this.notPinnedNote = this.notPinnedNote.concat(notes);
  }

  /**
   * update search key
   *
   * @param {Note[]} search - searching value
   * @returns {void}
   */
  @Mutation
  public setSearchKey(search: string) {
    this.searchKey = search;
  }

  /*
  TODO: server scroll
  @Mutation
  public toggleIsPinnedComplete(toggleValue: boolean) {
    this.isFetchingPinnedCompletely = toggleValue;
  }

  @Mutation
  public toggleIsNotPinnedComplete(toggleValue: boolean) {
    this.isFetchingNotPinnedCompletely = toggleValue;
  }

  @Mutation
  public updateLastPinnedSnapshot(snapshot: firebase.firestore.DocumentSnapshot) {
    this.lastPinnedSnapshot = snapshot;
  }

  @Mutation
  public updateLastNotPinnedSnapshot(snapshot: firebase.firestore.DocumentSnapshot) {
    this.lastNotPinnedSnapshot = snapshot;
  }
  */

  /**
   * observing pinned notes, sort _updated by desc
   * call updatePinnedNotes when pinned notes changes
   * @returns {void}
   */
  @Action({ rawError: true })
  observePinnedNote() {
    const ref = getFireStoreRef(['notes']).where('pinned', '==', true).orderBy('_updated', 'desc');
    ref.onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
      const pinnedNote: Note[] = [];
      querySnapshot.forEach((doc) => {
        pinnedNote.push({ ...doc.data(), id: doc.id } as Note);
      });
      this.context.commit('updatePinnedNotes', pinnedNote);
    });
  }

  /**
   * observing other notes, sort _updated by desc
   * call updateNotPinnedNotes when pinned notes changes
   * @returns {void}
   */
  @Action({ rawError: true })
  observeNotPinnedNote() {
    const ref = getFireStoreRef(['notes']).where('pinned', '==', false).orderBy('_updated', 'desc');
    ref.onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
      const pinnedNote: Note[] = [];
      querySnapshot.forEach((snapshot) => {
        pinnedNote.push({ ...snapshot.data(), id: snapshot.id } as Note);
      });
      this.context.commit('updateNotPinnedNotes', pinnedNote);
    });
  }

  /* 

  TODO: implement infinity scroll server

  @Action({ rawError: true })
  observePinnedNote() {
    if (this.isFetchingPinnedCompletely) return;

    let ref = getFireStoreRef(['notes']).where('pinned', '==', true).orderBy('_updated', 'desc');
    if (lastPinnedSnapshot) {
      ref = ref.startAfter(lastPinnedSnapshot);
    }
    ref = ref.limit(1);
    ref.onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
      const pinnedNote: Note[] = [];
      if (querySnapshot.docs.length === 0) {
        this.context.commit('toggleIsPinnedComplete', true);
        return;
      }
      querySnapshot.forEach((doc) => {
        pinnedNote.push({ ...doc.data(), id: doc.id } as Note);
      });
      lastPinnedSnapshot = querySnapshot.docs.pop();
      this.context.commit('updatePinnedNotes', pinnedNote);
    });
  }

  @Action({ rawError: true })
  observeNotPinnedNote() {
    if (this.isFetchingNotPinnedCompletely) return;
    let ref = getFireStoreRef(['notes']).where('pinned', '==', false).orderBy('_updated', 'desc');
    if (lastNotPinnedSnapshot) {
      ref = ref.startAfter(lastNotPinnedSnapshot);
    }
    ref = ref.limit(1);
    ref.onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
      const pinnedNote: Note[] = [];
      if (querySnapshot.docs.length === 0) {
        this.context.commit('toggleIsNotPinnedComplete', true);
        return;
      }
      querySnapshot.forEach((snapshot) => {
        pinnedNote.push({ ...snapshot.data(), id: snapshot.id } as Note);
      });

      lastNotPinnedSnapshot = querySnapshot.docs.pop();
      this.context.commit('concatNotPinnedNotes', pinnedNote);
    });
  }

  @Action
  resetFetchingState() {
    lastPinnedSnapshot = null;
    lastNotPinnedSnapshot = null;
  }

  @Action
  resetStoredNotes() {
    this.context.commit('updatePinnedNotes', []);
    this.context.commit('updateNotPinnedNotes', []);
    this.context.commit('toggleIsPinnedComplete', false);
    this.context.commit('toggleIsNotPinnedComplete', false);
  }
  */

  /**
   * handle uploading file
   *
   * @param {File} file - file that need to upload
   * @returns {Promise}
   */
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

  /**
   * handle delete file
   *
   * @param {String} filename - filename that needs to delete
   * @returns {Promise}
   */
  @Action({ rawError: true })
  deleteFile(filename: string) {
    const currentUserId = auth.currentUser?.email;

    const path = 'users/' + currentUserId;
    const ref = Storage.ref(path);
    return ref.child(filename).delete();
  }

  /**
   * get image url from storage reference
   *
   * @param {String} path - storage reference
   * @returns {Promise<string>}
   */
  @Action({ rawError: true })
  getURl(path: string) {
    return Storage.ref(path).getDownloadURL();
  }

  /**
   * create new note
   *
   * @param {Note} note - created note data
   * @returns {Promise<string>}
   */
  @Action({ rawError: true })
  createNote<Note>(note: Note): Promise<firebase.firestore.DocumentReference<Note>> {
    return addFireStoreDoc({
      ref: getFireStoreRef(['notes']),
      data: note,
    });
  }

  /**
   * update note by id
   *
   * @param {Partial<Note>} note - updated note fields
   * @returns {Promise<void>}
   */
  @Action({ rawError: true })
  updateNote(note: Partial<Note>): Promise<void> {
    return updateFireStoreDoc({
      ref: getFireStoreRef(['notes', <string>note.id]),
      data: note,
    });
  }

  /**
   * delete note by id
   *
   * @param {Partial<Note>} note - deleted note
   * @returns {Promise<void>}
   */
  @Action({ rawError: true })
  deleteNote(note: Note) {
    return deleteFireStoreDoc(getFireStoreRef(['notes', <string>note.id]));
  }

  /**
   * create notes
   * use for testing purpose
   *
   * @returns {Promise<void>}
   */
  @Action({ rawError: true })
  generateNotes() {
    const generateNumber = 500;
    const batch = StoreDB.batch();

    for (let i = 0; i < generateNumber; i++) {
      const ref = getFireStoreRef(['notes']).doc();
      batch.set(ref, {
        title: `title ${i}`,
        content: `content ${i}`,
        type: 'text',
        pinned: i % 2 === 0,
        _created: firebase.firestore.Timestamp.now(),
        _updated: firebase.firestore.Timestamp.now(),
      });
    }

    return batch.commit();
  }
}
