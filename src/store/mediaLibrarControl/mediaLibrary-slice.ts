import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface MediaLibraryControlState {
  open: boolean;
}

const initialState: MediaLibraryControlState = {
  open: false,
};

export const mediaLibraryControlSlice = createSlice({
  name: "mediaLibraryControlEffects",
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<MediaLibraryControlState>) {
      state.open = action.payload.open;
    },
  },
});

export const { setOpen } = mediaLibraryControlSlice.actions;

export const selectMediaLibraryOpenStatus = (state: RootState) =>
  state.mediaLibraryControl.open;

export default mediaLibraryControlSlice.reducer;
