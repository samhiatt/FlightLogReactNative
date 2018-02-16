import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { offline } from '@redux-offline/redux-offline';
import { autoRehydrate } from 'redux-persist';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import Expo from 'expo';
import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
// import { firebaseDb, firebaseApp } from './src/firebase';
import firebaseConfig from './src/firebase/firebase-config';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import { firebaseApp, firebaseAuth, firebaseDb } from './src/firebase';
import { setFirebaseConnected } from './src/auth/actions';

import { setLoginPending, setFirebaseAuthResponse } from './src/auth/actions';

// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
// global._fetch = fetch;
// global.fetch = function(uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };


// let firebaseApp = firebase.initializeApp(firebaseConfig);

offlineConfig.effect=(effect,action)=>{
	return new Promise((resolve,reject)=>{
		console.log("Executing effect:",effect,action,"^action");
		firebaseDb.ref(effect.ref).set(action.payload, (error,resp) => {
			if (error) {
				console.log("Error committing change",error);
				reject(error);
			} else {
				console.log("Committed action, got response:",resp);
				resolve();
			}
		});
		setTimeout(()=>{console.log(store.getState().offline,"again");},2000);	
	});
}
offlineConfig.persistCallback=()=>{
	console.log(store.getState(),"State restored.");
	store.dispatch({type:'STATE_RESTORED'});
}
offlineConfig.persistAutoRehydrate = () => autoRehydrate({log: true});
// offlineConfig.discard = (error, action, retries) => {
// 	return error.permanent || retries > 3;
// }

let store = createStore( AppReducer, compose( applyMiddleware(thunk
	, logger
	), offline(offlineConfig) ) );

class FlightLogReactNativeApp extends React.Component {
	constructor(props){
		super(props);
		this.state={ fontLoaded: false };
	}
	componentWillMount() {
		console.log("Mounting FlightLogReactNativeApp...");
    // store.dispatch(setFirebaseConnected(false));
    var connectedRef = firebaseDb.ref(".info/connected");
    connectedRef.on("value", (connected)=> {
      console.log(".info/connected: ",connected.val());
      store.dispatch(setFirebaseConnected(connected.val()));
    });
		firebaseApp.auth().onAuthStateChanged((user)=>{
		  if (user) {
		    console.log("User is signed in:",user);
		    store.dispatch(setFirebaseAuthResponse(user));
		    // firebaseDb.ref(user.uid+'/flights').limitToLast(3).on('value',(flights)=>{

		    // })
		  } else {
		    console.log("No user signed in.");
		    store.dispatch(setFirebaseAuthResponse(null));
		  }
		});
	}
	async componentDidMount() {
	  await Expo.Font.loadAsync({
	    'Roboto': require('native-base/Fonts/Roboto.ttf'),
	    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
	  });
	  this.setState({ fontLoaded: true });
	}
  componentDidCatch(error, info) {
    // Display fallback UI
    console.log("ERROR:",error);
  }
  render() {
  	if (!this.state.fontLoaded) {
  		console.log("App loading...");
  		return (<Expo.AppLoading />);
  	}
  	console.log("Rendering App...");
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('FlightLogReactNative', () => FlightLogReactNativeApp);

export default FlightLogReactNativeApp;
