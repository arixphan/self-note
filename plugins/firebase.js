import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

// Your web app's Firebase configuration
// testing firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCIQIRcFm0dcZ6SQGEr0Jc1woA63fJY2S4',
  authDomain: 'self-note-e247e.firebaseapp.com',
  projectId: 'self-note-e247e',
  storageBucket: 'self-note-e247e.appspot.com',
  messagingSenderId: '33528933121',
  appId: '1:33528933121:web:1514db6a69577d0243c900',
  measurementId: 'G-NBR5HPM8H2',
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);

  // useing emulator
  if (location.hostname === 'localhost') {
    firebase.firestore().useEmulator('localhost', 8080);
    firebase.storage().useEmulator('localhost', 9199);
    firebase.functions().useEmulator('localhost', 5001);
    firebase.auth().useEmulator('http://localhost:9099', { disableWarnings: true });
  }
}

export const auth = firebase.auth();
export const DB = firebase.database();
export const StoreDB = firebase.firestore();
export const Storage = firebase.storage();
export default firebase;
