import { createContext, useContext, useState, useRef } from "react";
import GlobalConfirmDialog from "../components/GlobalConfirmDialog";

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

  const showConfirm = (opts: ConfirmDialogOptions, onConfirm: () => void) => {
    confirmCallback.current = onConfirm;
    setOptions(opts);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    try {
      confirmCallback.current?.();
    } catch (e) {
      console.error("Error in confirm action:", e);
    }
  };

  const handleClose = () => {
    setOpen(false);
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