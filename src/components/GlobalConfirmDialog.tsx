import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function GlobalConfirmDialog({
  open,
  onClose,
  onConfirm,
  message,
  title,
  confirmText,
  cancelText,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "Are you sure?"}</DialogTitle>
      <DialogContent style={{ whiteSpace: 'pre-line' }}>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText || "Cancel"}</Button>
        <Button variant="outlined" color="error" onClick={onConfirm}>
          {confirmText || "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}