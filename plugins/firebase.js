import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBGWe_6bq4dqyHCO4crMPN2q4D_1zMA6fA',
//   authDomain: 'personal-6a5a0.firebaseapp.com',
//   databaseURL: 'https://personal-6a5a0-default-rtdb.firebaseio.com',
//   projectId: 'personal-6a5a0',
//   storageBucket: 'personal-6a5a0.appspot.com',
//   messagingSenderId: '293012500311',
//   appId: '1:293012500311:web:0f5b91a1a399fef2ff5812',
//   measurementId: 'G-Z3LPY09VJC',
// }
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
  // firebase.auth().
  // if (location.hostname === 'localhost') {
  //   firebase.firestore().useEmulator('localhost', 8080)
  //   firebase.storage().useEmulator('localhost', 9199)
  //   firebase.functions().useEmulator('localhost', 5001)
  //   firebase
  //     .auth()
  //     .useEmulator('http://localhost:9099', { disableWarnings: true })
  // }
}

export const auth = firebase.auth();
export const DB = firebase.database();
export const StoreDB = firebase.firestore();
export const Storage = firebase.storage();
export default firebase;
