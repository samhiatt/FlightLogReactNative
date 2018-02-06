import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import Expo from 'expo';
import { config as firebaseConfig, androidClientId } from './firebase-config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
// export const firebaseAuth = firebase.auth();
export const firebaseDb = firebase.database();

export const googleLoginAsync = function() {
	return Expo.Google.logInAsync({ 
		androidClientId,
		scopes: ['profile','email','openid'],
	});
};
