/* eslint-disable @typescript-eslint/no-unused-vars */
import { Middleware } from '@nuxt/types';
import firebaseApp from 'firebase/compat/app';
import 'firebase/compat/auth';

const auth: Middleware = async ({ route, store, redirect }) => {
  await new Promise((resolve, reject) => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve('ok');
      } else if (route.name !== 'login') {
        reject(new Error('user is not login'));
      } else {
        resolve('ok');
      }
    });
  }).catch(() => {
    return redirect('/login');
  });
};

export default auth;
