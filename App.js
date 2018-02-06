/**
 * @flow
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import Expo from 'expo';
import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { firebaseDb } from './src/firebase';

offlineConfig.effect=(effect,action)=>{
	console.log("Executing effect:",effect,action,"^action");
	return new Promise((resolve,reject)=>{
		firebaseDb.ref(effect.ref).set(action.payload, (error,resp) => {
			if (error) {
				console.log("Error committing change",error);
				reject(error);
			} else {
				console.log("Committed action, got response:",resp);
				resolve();
				setTimeout(()=>{console.log(store.getState().offline,"again");},500);
			}
		});
	});
}
offlineConfig.persistCallback=()=>{
	console.log(store.getState().offline,"Persist completed.");
}
// offlineConfig.discard = (error, action, retries) => {
// 	return error.permanent || retries > 3;
// }

let store = createStore( AppReducer, compose( applyMiddleware(thunk
	, logger
	), offline(offlineConfig) ) );

class FlightLogReactNativeApp extends React.Component {
	constructor(props){
		super(props);
		this.state={fontLoaded: false};
	}
	async componentDidMount() {
	  await Expo.Font.loadAsync({
	    'Roboto': require('native-base/Fonts/Roboto.ttf'),
	    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
	  });
	  this.setState({ fontLoaded: true });
	}
  render() {
  	if (!this.state.fontLoaded) {
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
