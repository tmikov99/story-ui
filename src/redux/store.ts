import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sidebarReducer from './sidebarSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;