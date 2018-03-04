import firebase from 'firebase';
import { firebaseApp, firebaseAuth } from '../firebase';
import { getGoogleAuth } from './google';
import Expo from 'expo';

export const SET_LOGIN_PENDING = 'SET_LOGIN_PENDING';
export function setLoginPending(isLoginPending) {
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
export function setGoogleAuth(googleAuth) {
  return {
    type: SET_GOOGLE_AUTH_RESPONSE,
    googleAuth
  };
}
export const SET_FIREBASE_AUTH_RESPONSE = 'SET_FIREBASE_AUTH_RESPONSE';
export function setFirebaseAuthResponse(value) {
  // const { displayName, email, emailVerified, isAnonymous, 
  //   phoneNumber, photoURL, refreshToken, uid, metadata, providerData } = value;
  // const providerId = (providerData.length)? providerData[0].providerId : '';
  // return {
  //   type: SET_FIREBASE_AUTH_RESPONSE,
  //   value: {displayName, email, emailVerified, isAnonymous, 
  //     phoneNumber, photoURL, refreshToken, uid, providerId,
  //     creationTime: metadata.creationTime,
  //     lastSignInTime: metadata.lastSignInTime,
  //   }
  // };
  return { type: SET_FIREBASE_AUTH_RESPONSE, value };
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

const setFbAuth = (value) => { return { type:'SET_FB_AUTH', value }};
const setFbAuthError = (error) => { return { type: 'SET_FB_AUTH_ERROR', error }};
const beginFbLogin = ()=> { return { type: "BGIN_FB_LOGIN" }};

export function dispatchSignInWithFacebook() {
  return (dispatch, getState) => {
    console.log("Dispatching Facebook sign in.", beginFbLogin());
    const fbAppId = '1982134038705806';
    dispatch(beginFbLogin());
    return Expo.Facebook.logInWithReadPermissionsAsync(fbAppId).then(fbAuthResult=>{
      console.log('FB auth result',fbAuthResult);
      dispatch(setFbAuth(fbAuthResult));
      // return fetch("https://graph.facebook.com/me?access_token="+fbAuthResult.token).then(response=>{
      //   response.json().then(resp=>{
      //     console.log("FB info",resp);
      //   }).catch(err=>{
      //     console.log("Error reading json response.",err);
      //     dispatch(setFbAuthError(err));
      //   });
      // }).catch(err=>{
      //   console.log("FB auth error:",err);
      //   dispatch(setFbAuthError(err));
      // });

      // firebaseApp.auth().onAuthStateChanged((user)=>{
      //   if (user) {
      //     console.log("User is signed in:",user.displayName);
      //     dispatch(setFirebaseAuthResponse(user));
      //   } else {
      //     console.log("No user signed in.");
      //     dispatch(setFirebaseAuthResponse(null));
      //   }
      // });
      if (fbAuthResult.type='success'){
        const credential = firebase.auth.FacebookAuthProvider.credential(fbAuthResult.token);
        console.log("Signing into firebase with credential",credential);
        let signinPromise = firebaseApp.auth().signInWithCredential(credential).then(res=>{
          console.log("Signed into firebase with facebook credential.",res);
        }).catch(err=>{
          console.log("Error authenticating to firebase with facebook credential.",err);
          dispatch(setFbAuthError(err.message));
        });
      } else {
        console.log("FB Login error",fbAuthResult);
        dispatch(setFbAuthError(fbAuthResult));
      }
    }).catch(err=>{
      console.error("FB auth error:",err);
      dispatch(setFbAuthError(err));
    });
  }
}
    

export function dispatchSignInWithGoogle() {
  return (dispatch, getState) => {
    dispatch(beginLogin());
    let googleAuth = getState().auth.googleAuth;
    getGoogleAuth(googleAuth).then(auth=>{
      dispatch(setLoginPending(false));
      // if (googleAuth && googleAuth.idToken!=auth.idToken) {
        console.log("Setting googleAuth",auth);
        dispatch(setGoogleAuth(auth));
      // }
      const credential = firebase.auth.GoogleAuthProvider.credential(auth.idToken);
      dispatch(setFirebaseAuthenticationPending(true));
      console.log("credential",credential);
      // firebaseApp.auth().onAuthStateChanged((user)=>{
      //   if (user) {
      //     console.log("User is signed in:",user.displayName);
      //     dispatch(setFirebaseAuthResponse(user));
      //   } else {
      //     console.log("No user signed in.");
      //     dispatch(setFirebaseAuthResponse(null));
      //   }
      // });
      firebaseApp.auth().signInWithCredential(credential).then(res=>{
        console.log("Authenticated with firebase",res);
        dispatch(setFirebaseAuthResponse(res));
      });
    }).catch(error => {
      console.error("firebase auth error",error);
      // dispatch(setFirebaseAuthenticated(false));
      dispatch(setFirebaseAuthenticationError(error));
    });
  }
}

export function firebaseLogout() {
  return (dispatch) => {
    console.log("Logging out...");
    firebaseApp.auth().signOut().then(()=>{
      console.log("Signed out.");
      // dispatch(setFirebaseAuthResponse(null));
      dispatch({type:'Logout'});
    }).catch(err=>{
      console.error(err);
    });
  }
}