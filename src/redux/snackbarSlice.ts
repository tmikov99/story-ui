import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarState = {
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
};

const initialState: SnackbarState = {
  message: '',
  open: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (_, action: PayloadAction<Omit<SnackbarState, 'open'>>) => {
      return { ...action.payload, open: true };
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;