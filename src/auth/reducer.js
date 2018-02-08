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
      return { ...state, googleAuth: action.googleAuth, isLoginPending:action.isLoginPending, isLoggedIn: true };

    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.value };

    case 'BEGIN_FB_LOGIN':
      return { ...state, fbLoginPending: true, fbLoginError: null, fbAuthenticated: false };

    case 'SET_FB_AUTH_ERROR':
      return { ...state, fbAuthError: action.error, fbLoginPending:false, fbAuthenticated: false };

    case 'SET_FB_AUTH':
      return { ...state, fbAuth: action.value, fbAuthenticated: true, fbLoginError: null, fbLoginPending: false };

    default:
      return state;
  }
}
