import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarState = {
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
};

type UIState = {
  snackbar: SnackbarState;
};

const initialState: UIState = {
  snackbar: { message: '', open: false },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<Omit<SnackbarState, 'open'>>) => {
      state.snackbar = { ...action.payload, open: true };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const {
  showSnackbar,
  hideSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;