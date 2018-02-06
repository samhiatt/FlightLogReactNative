export function firebaseReducer(state = {
	auth: null,
	isAuthenticated: false,
	isAuthenticationPending: false,
	authenticationError: null,
	authProvider: null,
}, action) {
  switch (action.type) {

    case 'SET_FIREBASE_AUTH_RESPONSE':
      return { ...state, auth: action.value, isAuthenticated: true, isAuthenticationPending: false };

    case 'SET_FIREBASE_AUTHENTICATION_PENDING':
      return { ...state, isAuthenticationPending: action.value };

    case 'SET_FIREBASE_AUTHENTICATED':
      return { ...state, isAuthenticated: action.value };

    case 'SET_FIREBASE_CONNECTED':
      return { ...state, isConnected: action.value };

    case 'SET_FIREBASE_AUTHENTICATION_ERROR':
      return { ...state, authenticationError: action.value, isAuthenticated: false };

    case 'SET_AUTH_PROVIDER':
      return { ...state, authProvider: action.value };

    case 'BEGIN_FIREBASE_AUTH':
      return { ...state, isAuthenticationPending:false, isAuthenticationPending:true, authenticationError: null };
    
    case 'Logout':
    	return { ...state, 
    		auth:null, 
    		isAuthenticated: false, 
    		authenticationError: null,
    		authProvider: null,
    	};

    default:
      return state;
  }
}