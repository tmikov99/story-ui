import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { hideConfirmDialog } from "../redux/uiSlice";

export default function GlobalConfirmDialog() {
  const dispatch = useDispatch();
  const { open, message, title, confirmText, cancelText, onConfirm } = useSelector(
    (state: RootState) => state.ui.confirmDialog
  );

  return (
    <Dialog open={open} onClose={() => dispatch(hideConfirmDialog())}>
      <DialogTitle>{title || 'Are you sure?'}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(hideConfirmDialog())}>
          {cancelText || 'Cancel'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            dispatch(hideConfirmDialog());
            if (onConfirm) {
              try {
                await onConfirm();
              } catch (err) {
                console.error("Confirm action failed:", err);
              }
            }
          }}
        >
          {confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}