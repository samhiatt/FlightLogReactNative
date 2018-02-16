const defaultState = {
  isLoggedIn: false,
  isLoginPending: false,
  loginError: null,
  googleAuth: null,
};

export function authReducer(state = defaultState, action) {
  // if (typeof state=='object') state = new AuthState(state);
  switch (action.type) {
    case 'SET_LOGIN_PENDING':
      return { ...state, isLoginPending: action.isLoginPending };
      // return state.merge({ isLoginPending: action.isLoginPending });

    case 'SET_LOGIN_SUCCESS':
      return { ...state, isLoggedIn: action.isLoggedIn };
      // return state.merge({ isLoggedIn: action.isLoggedIn });

    case 'SET_LOGIN_ERROR':
      return { ...state, loginError: action.loginError };
      // return state.merge({ loginError: action.loginError });

    case 'BEGIN_LOGIN':
      return { ...state, loginError: null, isLoggedIn: false, isLoginPending: true };
      // return state.merge({ loginError: null, isLoggedIn: false, isLoginPending: true });

    case 'Logout':
      return { ...state, ...defaultState };
      // return { ...state, isLoginPending:false, isLoggedIn:false, loginError: null};
      // return state.merge();

    case 'SET_GOOGLE_AUTH_RESPONSE':
      return { ...state, googleAuth: action.googleAuth, isLoginPending:action.isLoginPending, isLoggedIn: true };
      // return state.merge({ googleAuth: action.googleAuth, isLoginPending:action.isLoginPending, isLoggedIn: true });

    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.value };
      // return state.merge({ displayName: action.value });

    case 'BEGIN_FB_LOGIN':
      return { ...state, fbLoginPending: true, fbLoginError: null, fbAuthenticated: false };
      // return state.merge({ fbLoginPending: true, fbLoginError: null, fbAuthenticated: false });

    case 'SET_FB_AUTH_ERROR':
      return { ...state, fbAuthError: action.error, fbLoginPending:false, fbAuthenticated: false };
      // return state.merge({ fbAuthError: action.error, fbLoginPending:false, fbAuthenticated: false });

    case 'SET_FB_AUTH':
      return { ...state, fbAuth: action.value, fbAuthenticated: true, fbLoginError: null, fbLoginPending: false };
      // return state.merge({ fbAuth: action.value, fbAuthenticated: true, fbLoginError: null, fbLoginPending: false });

    default:
      return state;
  }
}
