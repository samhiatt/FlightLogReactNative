import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Button } from 'react-native';
import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import { NavigationActions } from 'react-navigation';
import { RESET_STATE } from "@redux-offline/redux-offline/lib/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = ({goToProfile, testIt, clearPendingActions}) => (
  <View style={styles.container}>
    <LoginStatusMessage />
    <AuthButton />
    <Button
      title='Profile'
      onPress={goToProfile}
    />
    <Button
      title='Test Offline Commit'
      onPress={testIt}
    />
    <Button
      title='Clear Pending Offline Actions'
      onPress={clearPendingActions}
    />
  </View>
);

MainScreen.navigationOptions = {
  title: 'Home Screen',
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, props) => ({
  logout: () => {
    dispatch({type:'Logout'});
  },
  loginScreen: () => {
    console.log("opening login screen");
    dispatch(NavigationActions.navigate({ routeName: 'Login' }));
  },
  goToProfile: ()=>{
    dispatch(NavigationActions.navigate({routeName:'Profile'}));
  },
  testIt:()=>{
    dispatch({type:'OFFFLINE_ACTION_TEST',payload:{foo:'bar!!!'},meta:{
      offline:{
        effect:{ref:props.screenProps.user.uid+'/flights/409',retries:2},
        commit:{action:'OFFFLINE_ACTION_TEST_COMMIT',meta:{foo:'baz'}},
        rollback:{action:'OFFFLINE_ACTION_TEST_ROLLBACK',meta:{foo:'bar'}},
      }
    }})
  },
  clearPendingActions:()=>{
    dispatch({type:RESET_STATE})
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
