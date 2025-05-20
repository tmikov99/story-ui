type ConfirmDialogOptions = {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
};

type ShowConfirmFn = (
  options: ConfirmDialogOptions,
  onConfirm: () => void,
  onCancel?: () => void
) => void;

let showConfirmRef: ShowConfirmFn | null = null;

export const registerConfirmDialog = (fn: ShowConfirmFn) => {
  showConfirmRef = fn;
};

export const showConfirmDialog = (
  options: ConfirmDialogOptions,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (showConfirmRef) {
    showConfirmRef(options, onConfirm, onCancel);
  } else {
    console.warn("Confirm dialog not registered yet.");
  }
};