import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarState = {
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
  key: number; // <-- new field
};

const initialState: SnackbarState = {
  message: '',
  open: false,
  key: 0,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (_, action: PayloadAction<Omit<SnackbarState, 'open' | 'key'>>) => {
      return {
        ...action.payload,
        open: true,
        key: new Date().getTime(),
      };
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;