import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../api/auth';
import { User } from '../types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  redirectAfterLogin: string | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token'),
  user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  redirectAfterLogin: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.user = {
        username: action.payload.username,
        email: action.payload.email,
        imageUrl: action.payload.imageUrl,
      };
      state.isAuthenticated = true;
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    setRedirectAfterLogin: (state, action: PayloadAction<string>) => {
      state.redirectAfterLogin = action.payload;
    },
    clearRedirectAfterLogin: (state) => {
      state.redirectAfterLogin = null;
    },
  },
});

export const { loginSuccess, logout, setRedirectAfterLogin, clearRedirectAfterLogin } = authSlice.actions;
export default authSlice.reducer;