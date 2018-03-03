import Expo from 'expo';
import { androidClientId, androidStandaloneAppClientId } from './config';

export function getGoogleAuth(googleAuth={idToken:null}){
  return new Promise((resolve,reject)=>{
    if (googleAuth && googleAuth.idToken) { // TODO: check token expiration?
    	console.log("Already have googleAuth", googleAuth);
      resolve(googleAuth);
    }
    else { 
      return Expo.Google.logInAsync({ 
				androidClientId,
        androidStandaloneAppClientId,
				scopes: ['profile','email','openid'],
			}).then((result,err)=>{
        console.log(result,"google login result:");
        if (result && result.type === 'success') {
          resolve(result);
        } else {
          reject(result);
        }
      }).catch(err=>{
        console.error(err);
        reject(err);
      });
    }
  });
}