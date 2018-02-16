import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Button, Text } from 'react-native';
import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import { NavigationActions } from 'react-navigation';
import { RESET_STATE } from "@redux-offline/redux-offline/lib/constants";
import { getGoogleAuth } from '../auth/google';
import { dispatchSignInWithGoogle } from '../auth/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = ({goToProfile, testIt, clearPendingActions, testLogin, goToFlights, goToNewFlightScreen}) => (
  <View style={styles.container}>
    <LoginStatusMessage />
    <AuthButton />
    <Text></Text>
    <Button
      title='Profile'
      onPress={goToProfile}
    />
    <Text></Text>
    <Button
      title='Flights'
      onPress={goToFlights}
    />
    <Text></Text>
    <Button
      title='New Flight'
      onPress={goToNewFlightScreen}
    />
    <Text></Text>
    <Button
      title='Test Offline Commit'
      onPress={testIt}
    />
    <Text></Text>
    <Button
      title='Clear Pending Offline Actions'
      onPress={clearPendingActions}
    />
    <Text></Text>
    <Button
      title='Test Google Auth'
      onPress={testLogin}
    />
    <Text></Text>
  </View>
);

MainScreen.navigationOptions = {
  title: 'Home Screen',
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  loginScreen: ()=>dispatch=>{
    console.log("opening login screen");
    dispatch(NavigationActions.navigate({ routeName: 'Login' }));
  },
  goToProfile: ()=>dispatch=>{
    dispatch(NavigationActions.navigate({routeName:'Profile'}));
  },
  goToFlights: ()=>dispatch=>{
    dispatch(NavigationActions.navigate({routeName:'Flights'}));
  },
  goToNewFlightScreen: ()=>dispatch=>{
    dispatch(NavigationActions.navigate({routeName:'NewFlight'}));
  },
  testIt: ()=>(dispatch,getState)=>{
    console.log("testIt",getState())
    dispatch({type:'OFFFLINE_ACTION_TEST',payload:{foo:'BAA'},meta:{
      offline:{
        effect:{ref:getState().firebase.auth.uid+'/flights/410',retries:2},
        commit:{action:'OFFFLINE_ACTION_TEST_COMMIT',meta:{foo:'baz'}},
        rollback:{action:'OFFFLINE_ACTION_TEST_ROLLBACK',meta:{foo:'bar'}},
      }
    }});
  },
  clearPendingActions:()=>dispatch=>{
    dispatch({type:RESET_STATE});
  },
  // testLogin:()=>(dispatch,getState)=>{
  //   console.log("Testing login...",getState());
  //   getGoogleAuth(getState().auth.googleAuth).then(auth=>{
  //     console.log("Have auth",auth);
  //   });
  // },
  testLogin: dispatchSignInWithGoogle
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
