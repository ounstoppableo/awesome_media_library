import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface sienaControlState {
  open: boolean;
}

const initialState: sienaControlState = {
  open: false,
};

export const sienaControlSlice = createSlice({
  name: "sienaControlEffects",
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<Pick<sienaControlState, "open">>) {
      state.open = action.payload.open;
    },
  },
});

export const { setOpen } = sienaControlSlice.actions;

export const selectSienaControlOpenStatus = (state: RootState) =>
  state.sienaControl.open;

export default sienaControlSlice.reducer;
