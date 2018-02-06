const initialAuthState = {
  isLoggedIn: false,
  isLoginPending: false,
  loginError: null,
  googleAuth: null,
};

export function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case 'SET_LOGIN_PENDING':
      return { ...state, isLoginPending: action.isLoginPending };

    case 'SET_LOGIN_SUCCESS':
      return { ...state, isLoggedIn: action.isLoggedIn };

    case 'SET_LOGIN_ERROR':
      return { ...state, loginError: action.loginError };

    case 'BEGIN_LOGIN':
      return { ...state, loginError: null, isLoggedIn: false, isLoginPending: true };

    case 'Logout':
      return { ...state, isLoginPending:false, isLoggedIn:false, loginError: null};

    case 'SET_GOOGLE_AUTH_RESPONSE':
      return { ...state, googleAuth: action.googleAuth, isLoginPending:action.isLoginPending };

    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.value };

    default:
      return state;
  }
}