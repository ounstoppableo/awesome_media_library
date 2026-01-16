import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface taotajimaControlState {
  open: boolean;
  id: string;
}

const initialState: taotajimaControlState = {
  open: false,
  id: "",
};

export const taotajimaControlSlice = createSlice({
  name: "taotajimaControlEffects",
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<taotajimaControlState>) {
      state.open = action.payload.open;
      state.id = action.payload.id;
    },
  },
});

export const { setOpen } = taotajimaControlSlice.actions;

export const selectTaojimaControlOpenStatus = (state: RootState) =>
  state.taotajimaControl.open;
export const selectTaojimaCurrentId = (state: RootState) =>
  state.taotajimaControl.id;

export default taotajimaControlSlice.reducer;
