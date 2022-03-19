import { Plugin } from '@nuxt/types';

import firebase from 'firebase/compat';
import { StoreDB, auth } from '~/plugins/firebase';

type CollectionRef = firebase.firestore.CollectionReference;
type DocumentRef<T = firebase.firestore.DocumentData> = firebase.firestore.DocumentReference<T>;

interface AddingFireStore<T> {
  ref: CollectionRef;
  data: T;
}

interface UpdatedFireStore<T> {
  ref: DocumentRef;
  data: T;
}

interface SetFireStore<T> {
  ref: DocumentRef;
  data: T;
}

declare module 'vue/types/vue' {
  interface Vue {
    $addFireStoreDoc<T>({ ref, data }: AddingFireStore<T>): Promise<DocumentRef<T>>;
    $getFireStoreRef(refs: string[]): DocumentRef;
    $setFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
    $updateFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $addFireStoreDoc<T>({ ref, data }: AddingFireStore<T>): Promise<DocumentRef<T>>;
    $getFireStoreRef(refs: string[]): DocumentRef;
    $setFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
    $updateFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
  }

  interface Context {
    $addFireStoreDoc<T>({ ref, data }: AddingFireStore<T>): Promise<DocumentRef<T>>;
    $getFireStoreRef(refs: string[]): DocumentRef;
    $setFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
    $updateFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $store: Store<S>;
    $addFireStoreDoc<T>({ ref, data }: AddingFireStore<T>): Promise<DocumentRef<T>>;
    $getFireStoreRef(refs: string[]): DocumentRef;
    $setFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
    $updateFireStoreDoc<T>(params: SetFireStore<T>): Promise<void>;
  }
}

/**
 * get firestore reference
 *
 * @param  {String[]} collections - array of document/collection reference
 * @returns firestore reference
 */
const getFireStoreRef = function (collections: string[]) {
  const currentUserId = auth.currentUser?.email;
  if (!currentUserId) return;

  let ref: any = StoreDB.collection('users').doc(currentUserId);

  collections.forEach((path, index) => {
    if (index % 2 === 0) {
      ref = ref.collection(path);
    } else {
      ref = ref.doc(path) as DocumentRef;
    }
  });

  return ref;
};

/**
 * add firestore document
 *
 * @param  {CollectionReference} ref - collection reference
 * @returns {Promise<DocumentRef<T>>}
 */
const addFireStoreDoc = function <T = firebase.firestore.DocumentData>({
  ref,
  data,
}: AddingFireStore<T>): Promise<DocumentRef<T>> {
  const creationData = {
    ...data,
    _created: firebase.firestore.Timestamp.now(),
    _updated: firebase.firestore.Timestamp.now(),
  };
  return ref.add(creationData) as Promise<DocumentRef<T>>;
};

/**
 * set firestore document
 *
 * @param  {CollectionReference} ref - collection reference
 * @returns {Promise<void>}
 */
const setFireStoreDoc = function <T = firebase.firestore.DocumentData>({ ref, data }: SetFireStore<T>): Promise<void> {
  const creationData = {
    ...data,
    _created: firebase.firestore.Timestamp.now(),
    _updated: firebase.firestore.Timestamp.now(),
  };
  return ref.set(creationData);
};

/**
 * update firestore document
 *
 * @param  {CollectionReference} ref - collection reference
 * @returns {Promise<void>}
 */
const updateFireStoreDoc = function <T = firebase.firestore.DocumentData>({
  ref,
  data,
}: UpdatedFireStore<T>): Promise<void> {
  const updatedData = {
    ...data,
    _updated: firebase.firestore.Timestamp.now(),
  };
  return ref.update(updatedData) as Promise<void>;
};

/**
 * delete firestore document
 *
 * @param  {CollectionReference} ref - collection reference
 * @returns {Promise<void>}
 */
const deleteFireStoreDoc = function (ref: DocumentRef): Promise<void> {
  return ref.delete() as Promise<void>;
};

const firestoreUtils: Plugin = (context, inject) => {
  context.$addFireStoreDoc = addFireStoreDoc;
  context.$getFireStoreRef = getFireStoreRef;
  context.$setFireStoreDoc = setFireStoreDoc;
  context.$updateFireStoreDoc = updateFireStoreDoc;

  inject('addFireStoreDoc', addFireStoreDoc);
  inject('getFireStoreRef', getFireStoreRef);
  inject('setFireStoreDoc', setFireStoreDoc);
  inject('updateFireStoreDoc', updateFireStoreDoc);
};

export { getFireStoreRef, addFireStoreDoc, setFireStoreDoc, updateFireStoreDoc, deleteFireStoreDoc };

export default firestoreUtils;
