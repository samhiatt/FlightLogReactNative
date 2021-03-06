import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import firebaseConfig from './firebase-config';

console.log("Initializing firebase app with ",firebaseConfig)

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseDb = firebase.database();

