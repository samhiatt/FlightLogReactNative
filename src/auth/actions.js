import firebase from 'firebase';
import { firebaseApp, googleLoginAsync } from '../firebase';

export const SET_LOGIN_PENDING = 'SET_LOGIN_PENDING';
function setLoginPending(isLoginPending) {
  return {
    type: SET_LOGIN_PENDING,
    isLoginPending
  };
}
export const SET_LOGIN_SUCCESS = 'SET_LOGIN_SUCCESS';
function setLoginSuccess(isLoggedIn) {
  return {
    type: SET_LOGIN_SUCCESS,
    isLoggedIn
  };
}
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
function setLoginError(loginError) {
  return {
    type: SET_LOGIN_ERROR,
    loginError
  };
}
export const BEGIN_LOGIN = 'BEGIN_LOGIN';
function beginLogin() {
  return { type: BEGIN_LOGIN };
}
export const SET_GOOGLE_AUTH_RESPONSE = 'SET_GOOGLE_AUTH_RESPONSE';
function setGoogleAuth(googleAuth) {
  return {
    type: SET_GOOGLE_AUTH_RESPONSE,
    googleAuth
  };
}
export const SET_FIREBASE_AUTH_RESPONSE = 'SET_FIREBASE_AUTH_RESPONSE';
export function setFirebaseAuthResponse(value) {
  return {
    type: SET_FIREBASE_AUTH_RESPONSE,
    value
  };
}
// export const SET_AUTH_PROVIDER = 'SET_AUTH_PROVIDER';
// export function setAuthProvider(value) {
//   return {
//     type: SET_AUTH_PROVIDER,
//     value
//   };
// }
export const SET_FIREBASE_CONNECTED = 'SET_FIREBASE_CONNECTED';
export function setFirebaseConnected(value) {
  return {
    type: SET_FIREBASE_CONNECTED,
    value
  };
}
export const BEGIN_FIREBASE_AUTH = 'BEGIN_FIREBASE_AUTH';
export function beginFirebaseAuth() {
  return { type: BEGIN_FIREBASE_AUTH };
}
export const SET_FIREBASE_AUTHENTICATED = 'SET_FIREBASE_AUTHENTICATED';
export function setFirebaseAuthenticated(value) {
  return {
    type: SET_FIREBASE_AUTHENTICATED,
    value
  };
}
export const SET_FIREBASE_AUTHENTICATION_PENDING = 'SET_FIREBASE_AUTHENTICATION_PENDING';
export function setFirebaseAuthenticationPending(value) {
  return {
    type: SET_FIREBASE_AUTHENTICATION_PENDING,
    value
  };
}
export const SET_FIREBASE_AUTHENTICATION_ERROR = 'SET_FIREBASE_AUTHENTICATION_ERROR';
export function setFirebaseAuthenticationError(value) {
  return {
    type: SET_FIREBASE_AUTHENTICATION_ERROR,
    value
  };
}
// export const SET_DISPLAY_NAME = 'SET_DISPLAY_NAME';
// function setDisplayName(value) {
//   return {
//     type: SET_DISPLAY_NAME,
//     value
//   };
// }

// export function setFirebaseAuth(user) {
//   return (dispatch, getState) => {
//     console.log("setting firebase auth",user.uid)
//     if (user.stsTokenManager.expirationTime < new Date()) {
//       dispatch(setFirebaseAuthenticationError("auth token expired"));
//     } else {
//       dispatch(setFirebaseAuthenticated(true));
//       dispatch(setFirebaseAuthResponse(user));
//       dispatch(setFirebaseAuthenticationError(null));
//     }
//   }
// }

export const testSignIn = () => (dispatch, getState) => {
  console.log("Testing sign in with ",getState());
  return googleLoginAsync().then(result=>{
    console.log("google login result:",result);
  }).catch(error=>{
    console.error("Google login error:",error);
  });
}

export function dispatchFirebaseAuth() {
  return (dispatch, getState) => {
    console.log("Dispatching firebase auth.");
  }
}

export function dispatchSignInWithGoogle() {
  return (dispatch, getState) => {
    // dispatch(setLoginPending(true));
    // dispatch(setLoginSuccess(false));
    // dispatch(setLoginError(null));
    dispatch(beginLogin());

    console.log("attempting login with Google...");
    return googleLoginAsync().catch(console.error).then(result=>{
      console.log("google login result:",result);
      dispatch(setLoginPending(false));
      if (result && result.type === 'success') {
        dispatch(setLoginSuccess(true));
        dispatch(setGoogleAuth(result));
        // Build Firebase credential with the id token.
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
        // Sign in with credential from the Google user.
        // dispatch(setFirebaseAuthenticationPending(true));
        // dispatch(setFirebaseAuthenticated(false));
        // dispatch(setFirebaseAuthenticationError(null));
        dispatch(beginFirebaseAuth());
        let auth = firebaseApp.auth();
        auth.onAuthStateChanged((user)=>{
          if (user) {
            console.log("User is signed in:",user.displayName);
            dispatch(setFirebaseAuthResponse(user));
          } else {
            console.log("No user signed in.");
            dispatch(setFirebaseAuthResponse(null));
          }
        });
        auth.signInWithCredential(credential).then(res=>{
          console.log("Authenticated with firebase",res);
          dispatch(setFirebaseAuthResponse(res));
          // dispatch(setAuthProvider(res.providerData[0].providerId));
          // dispatch(setDisplayName(res.displayName));
        }).catch(error => {
          console.error("firebase auth error",error);
          dispatch(setFirebaseAuthenticated(false));
          dispatch(setFirebaseAuthenticationError(error));
        })
      } else {
        console.log("Error authenticating with Google:",result);
        dispatch(setLoginError('Error authenticating with Google'));
        dispatch(setLoginPending(false));
      }
    })
  }
}