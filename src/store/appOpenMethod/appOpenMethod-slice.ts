import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface appOpenMethodState {
  appOpenMethod: "inner" | "outer";
}

const initialState: appOpenMethodState = {
  appOpenMethod: "outer",
};

export const appOpenMethodSlice = createSlice({
  name: "appOpenMethodEffects",
  initialState,
  reducers: {
    setAppOpenMethod(
      state,
      action: PayloadAction<Pick<appOpenMethodState, "appOpenMethod">>
    ) {
      state.appOpenMethod = action.payload.appOpenMethod;
    },
  },
});

export const { setAppOpenMethod } = appOpenMethodSlice.actions;

export const selectAppOpenMethod = (state: RootState) =>
  state.appOpenMethod.appOpenMethod;

export default appOpenMethodSlice.reducer;
