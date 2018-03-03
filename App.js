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
import firebaseConfig from './src/firebase/firebase-config';
import { firebaseApp, firebaseAuth, firebaseDb } from './src/firebase';
import firebase from 'firebase';
import { setFirebaseConnected } from './src/auth/actions';
import { loadFlights } from './src/flights/actions';

import { setLoginPending, setFirebaseAuthResponse } from './src/auth/actions';

console.ignoredYellowBox = [
    'Setting a timer'
];

offlineConfig.effect=(effect,action)=>{
	return new Promise((resolve,reject)=>{
		console.log("Executing effect:",effect,action,"^action");
		firebaseDb.ref(effect.ref).push().set(action.payload, (error,resp) => {
			if (error) {
				console.log("Error committing change",error);
				reject(error);
			} else {
				console.log("Committed action, got response:",resp);
				resolve();
			}
		});
		setTimeout(()=>{console.log(store.getState().offline,"offline state 2sec after executing effect:");},2000);	
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
	// , logger
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

				// TODO: Only load flights updated since lastOnline 
				// e.g.: lastOnlineRef.on('value',lastOnline=>store.dispatch(loadFlights(lastOnline.val()));
				store.dispatch(loadFlights());

				// Manage online presence
				var myConnectionsRef = firebaseDb.ref(user.uid+'/connections');
				var lastOnlineRef = firebaseDb.ref(user.uid+'/lastOnline');

				var con = myConnectionsRef.push();

				// When I disconnect, remove this device
				con.onDisconnect().remove();

				con.set(firebase.database.ServerValue.TIMESTAMP);
				lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);

				// TODO: Check for flights with updated_iso > lastOnlineRef, update flight number if necessary.

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
		return (
			<Provider store={store}>
			  <AppWithNavigationState />
			</Provider>
		);
	}
}

AppRegistry.registerComponent('FlightLogReactNative', () => FlightLogReactNativeApp);

export default FlightLogReactNativeApp;
