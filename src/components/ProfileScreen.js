import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AuthButton from './AuthButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const ProfileScreen = ({
  isLoggedIn, 
  displayName, 
  isFirebaseAuthenticated, 
  authProvider,
  stateJson,
}) => (isLoggedIn)? (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome {displayName}</Text>
      <Text>Auth provider: {authProvider}</Text>
      <Text>{(isFirebaseAuthenticated)? "Authenticated with Firebase":"Not authenticated with Firebase"}</Text>
      <Text>{stateJson}</Text>
    </ScrollView>
  ):(
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Not logged in</Text>
      <AuthButton /> 
      <Text>{stateJson}</Text>
    </ScrollView>
  );

ProfileScreen.navigationOptions = {
  title: 'Profile',
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn || state.firebase.isAuthenticated,
  isFirebaseAuthenticated: state.firebase.isAuthenticated, 
  displayName: (state.firebase.auth)? state.firebase.auth.displayName : "",
  authProvider: (state.firebase.auth)? state.firebase.auth.providerId : '',
  stateJson: JSON.stringify(state),
});

export default connect(mapStateToProps)(ProfileScreen);
