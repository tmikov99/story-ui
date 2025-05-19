import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { hideSnackbar } from "../redux/snackbarSlice";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((state: RootState) => state.snackbar);

  const handleClose = () => dispatch(hideSnackbar());

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
    >
      <Alert severity={snackbar.severity || 'info'} onClose={handleClose}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}