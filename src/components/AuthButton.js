import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {firebaseLogout} from '../auth/actions';

const AuthButton = ({ logout, loginScreen, isLoggedIn }) => (
  <Button
    title={isLoggedIn ? 'Log Out' : 'Open Login Screen'}
    onPress={isLoggedIn ? logout : loginScreen}
  />
);

AuthButton.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  loginScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn && state.firebase.isAuthenticated,
});

// const mapDispatchToProps = dispatch => ({
//   logout: () => {
//     dispatch({type:'Logout'});
//   },
//   loginScreen: () => {
//     console.log("opening login screen");
//     dispatch(NavigationActions.navigate({ routeName: 'Login' }));
//   },
// });
const mapDispatchToProps = {
  // logout: ()=> dispatch=> dispatch({type:'Logout'}),
  logout: firebaseLogout,
  loginScreen: ()=>dispatch=>{dispatch(NavigationActions.navigate({ routeName: 'Login' }))},
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
