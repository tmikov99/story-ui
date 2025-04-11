import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../api/auth';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token'),
  username: sessionStorage.getItem('username'),
  isAuthenticated: !!sessionStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem("username", action.payload.username);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;