import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarState = {
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
};

type ConfirmDialogState = {
  open: boolean;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

type UIState = {
  snackbar: SnackbarState;
  confirmDialog: ConfirmDialogState;
};

const initialState: UIState = {
  snackbar: { message: '', open: false },
  confirmDialog: { open: false, message: '' },
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
    showConfirmDialog: (state, action: PayloadAction<ConfirmDialogState>) => {
      state.confirmDialog = { ...action.payload };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog.open = false;
    },
  },
});

export const {
  showSnackbar,
  hideSnackbar,
  showConfirmDialog,
  hideConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;