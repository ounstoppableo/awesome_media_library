import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AssesManageState {
  open: boolean;
}

const initialState: AssesManageState = {
  open: false,
};

export const assetsManageControlSlice = createSlice({
  name: "assetsManageControlEffects",
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<AssesManageState>) {
      state.open = action.payload.open;
    },
  },
});

export const { setOpen } = assetsManageControlSlice.actions;

export const selectAssetsManageOpenStatus = (state: RootState) =>
  state.assetsManageControl.open;

export default assetsManageControlSlice.reducer;
