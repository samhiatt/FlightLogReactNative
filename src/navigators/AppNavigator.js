import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler } from "react-native";
import { Text, Container, Content } from 'native-base';
import Expo from 'expo';
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';
import FlightsScreen from '../components/FlightsScreen';

// import { firebaseDb, firebaseApp } from '../firebase';
import { 
  setFirebaseAuthResponse, 
  setAuthProvider, 
  setFirebaseAuthenticated, 
  setFirebaseAuthenticationPending, 
  setFirebaseAuthenticationError,
  setFirebaseConnected,
} from '../auth/actions';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
  Flights: { screen: FlightsScreen },
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  _actionEventSubscribers = new Set();

  _addListener = (eventName, handler) => {
    eventName === 'action' && this._actionEventSubscribers.add(handler);
    return {
      remove: () => {
        this._actionEventSubscribers.delete(handler);
      },
    };
  };
  // componentWillMount(){
    // // this.props.setFirebaseAuthenticationPending(true);
    // firebaseApp.auth().onAuthStateChanged((user)=>{
    //   if (user) {
    //     console.log("User is signed in:",user.displayName);
    //     this.props.setFirebaseAuth(user);
    //   } else {
    //     console.log("No user signed in.");
    //     this.props.setFirebaseAuth(null);
    //   }
    // });
    // this.props.setFirebaseConnected(false);
    // var connectedRef = firebaseDb.ref(".info/connected");
    // connectedRef.on("value", (connected)=> {
    //   console.log(".info/connected: ",connected.val());
    //   this.props.setFirebaseConnected(connected.val());
    // });
  // }
  componentDidUpdate(lastProps) {
    const lastState = lastProps.nav;
    this._actionEventSubscribers.forEach(subscriber => {
      subscriber({
        lastState: lastProps.nav,
        state: this.props.nav,
        action: this.props.lastAction,
      });
    });
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    const { dispatch, nav, isRehydrated } = this.props;
    return (isRehydrated)?(
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener: this._addListener,
        })}
        screenProps={{user:this.props.user}}
      />
    ):(
      <Container><Content style={{marginTop:30}}>
        <Text>Waiting for state to rehydrate...</Text>
      </Content></Container> 
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  lastAction: state.lastAction,
  user: state.firebase.auth,
  isRehydrated: state.rehydrated.isRehydrated,
});
const mapDispatchToProps = {
  setFirebaseAuth: user => dispatch=> {
    dispatch(setFirebaseAuthResponse(user));
    if (user) dispatch(NavigationActions.back());
  },
  setFirebaseConnected: isConnected=> dispatch=> {
    dispatch(setFirebaseConnected(isConnected));
  },
  setFirebaseAuthenticationPending: pending=> dispatch =>{
    dispatch(setFirebaseAuthenticationPending(pending));
  },
  dispatch: dispatch=>dispatch,
}
export default connect(mapStateToProps,mapDispatchToProps)(AppWithNavigationState);
