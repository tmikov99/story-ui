import { createContext, useContext, useState, useRef, useEffect } from "react";
import GlobalConfirmDialog from "../components/GlobalConfirmDialog";
import { registerConfirmDialog } from "../utils/confirmDialogController";

type ConfirmDialogOptions = {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmDialogContextType = {
  showConfirm: (options: ConfirmDialogOptions, onConfirm: () => void) => void;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  return context;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({ message: "" });
  const confirmCallback = useRef<() => void>();
  const cancelCallback = useRef<() => void>();

  const showConfirm = (
    opts: ConfirmDialogOptions, 
    onConfirm: () => void,   
    onCancel?: () => void
  ) => {
    confirmCallback.current = onConfirm;
    cancelCallback.current = onCancel;
    setOptions(opts);
    setOpen(true);
  };

  useEffect(() => {
    registerConfirmDialog(showConfirm);
  }, []);

  const handleConfirm = async () => {
    setOpen(false);
    try {
      confirmCallback.current?.();
    } catch (e) {
      console.error("Error in confirm action:", e);
    } finally {
      confirmCallback.current = undefined;
      cancelCallback.current = undefined;
    }
  };

  const handleClose = () => {
    setOpen(false);
    try {
      cancelCallback.current?.();
    } catch (e) {
      console.error("Error in cancel action:", e);
    } finally {
      confirmCallback.current = undefined;
      cancelCallback.current = undefined;
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      <GlobalConfirmDialog
        open={open}
        {...options}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ConfirmDialogContext.Provider>
  );
};