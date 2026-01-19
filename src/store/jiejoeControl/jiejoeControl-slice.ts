import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface jiejoeControlState {
  closeScroll: boolean;
}

const initialState: jiejoeControlState = {
  closeScroll: false,
};

export const jiejoeControlSlice = createSlice({
  name: "jiejoeControlEffects",
  initialState,
  reducers: {
    setCloseScroll(state, action: PayloadAction<jiejoeControlState>) {
      state.closeScroll = action.payload.closeScroll;
    },
  },
});

export const { setCloseScroll } = jiejoeControlSlice.actions;

export const selectJiejoeControlCloseScrollStatus = (state: RootState) =>
  state.jiejoeControl.closeScroll;

export default jiejoeControlSlice.reducer;
