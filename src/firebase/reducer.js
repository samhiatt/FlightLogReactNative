
const defaultState = {
  auth: null,
  isAuthenticated: false,
  isAuthenticationPending: false,
  authenticationError: null,
  authProvider: null,
  isConnected: false,
};

export function firebaseReducer(state=defaultState, action) {
  // if (typeof state=='object') state = new FirebaseState(state);
  switch (action.type) {

    case 'SET_FIREBASE_AUTH_RESPONSE':
      return { ...state, auth: action.value, isAuthenticated: true, isAuthenticationPending: false };
      // return state.merge({ auth: action.value, isAuthenticated: true, isAuthenticationPending: false });

    case 'SET_FIREBASE_AUTHENTICATION_PENDING':
      return { ...state, isAuthenticationPending: action.value };
      // return state.merge({ isAuthenticationPending: action.value });

    case 'SET_FIREBASE_AUTHENTICATED':
      return { ...state, isAuthenticated: action.value };
      // return state.merge({ isAuthenticated: action.value });

    case 'SET_FIREBASE_CONNECTED':
      return { ...state, isConnected: action.value };
      // return state.merge({ isConnected: action.value });

    case 'SET_FIREBASE_AUTHENTICATION_ERROR':
      return { ...state, authenticationError: action.value, isAuthenticated: false };
      // return state.merge({ authenticationError: action.value, isAuthenticated: false });

    case 'SET_AUTH_PROVIDER':
      return { ...state, authProvider: action.value };
      // return state.merge({ authProvider: action.value });

    case 'BEGIN_FIREBASE_AUTH':
      return { ...state, isAuthenticationPending:false, isAuthenticationPending:true, authenticationError: null };
      // return state.merge({isAuthenticationPending:false, isAuthenticationPending:true, authenticationError: null });
    
    case 'Logout':
      return { ...state, ...defaultState, isConnected: state.isConnected };

    default:
      return state;
  }
}