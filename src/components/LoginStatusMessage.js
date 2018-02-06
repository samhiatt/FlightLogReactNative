import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const LoginStatusMessage = ({ isLoggedIn, dispatch, firebaseAuthenticated }) => {
  return (
    <View>
      <Text style={styles.welcome}>
        {isLoggedIn? 'You are "logged in" right now': "Google not authenticated"}
      </Text>
      <Text style={styles.welcome}>
        {(firebaseAuthenticated)?'Authenticated to Firebase':"Firebase not authenticted"}
      </Text>
      <Button
        onPress={() =>
          dispatch(NavigationActions.navigate({ routeName: 'Profile' }))}
        title="Profile"
      />
    </View>
  );
};

LoginStatusMessage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  firebaseAuthenticated: state.firebase.isAuthenticated,
});

export default connect(mapStateToProps)(LoginStatusMessage);
