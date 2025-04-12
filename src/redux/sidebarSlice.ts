import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalData, setLocalData } from "../utils/storage";

interface SidebarState {
  open: boolean;
}

const initialState: SidebarState = {
  open: getLocalData("sidebarOpen") ?? true,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
      toggleSidebar: (state) => {
        state.open = !state.open;
        setLocalData("sidebarOpen", state.open);
      },
      setSidebar: (state, action: PayloadAction<boolean>) => {
        state.open = action.payload;
        setLocalData("sidebarOpen", action.payload);
      },
    },
  });

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;