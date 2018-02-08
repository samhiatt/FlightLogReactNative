import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

import { authReducer } from '../auth/reducer';
import { firebaseReducer } from '../firebase/reducer';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
const initialNavState = AppNavigator.router.getStateForAction(
  secondAction,
  tempNavState
);

function nav(state = initialNavState, action) {
  switch (action.type) {
    case 'SET_LOGIN_SUCCESS':
      return (action.isLoggedIn) ?
        AppNavigator.router.getStateForAction( 
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          }), state)
        : state;
    case 'Logout':
      return AppNavigator.router.getStateForAction( NavigationActions.navigate({ routeName: 'Login' }),state );
    default:
      return AppNavigator.router.getStateForAction(action, state) || state;
  }
}

function lastAction(state = null, action) {
  return action;
}

function rehydrated(state={isRehydrated:false}, action){
  switch (action.type){
    case 'STATE_RESTORED':
      return { ...state, isRehydrated:true };
    default: 
      return state;
  }
}

const AppReducer = combineReducers({
  lastAction,
  rehydrated,
  nav,
  auth: authReducer,
  firebase: firebaseReducer,
});

export default AppReducer;
