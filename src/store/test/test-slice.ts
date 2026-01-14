import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface testState {
  value: boolean;
}

const initialState: testState = {
  value: false,
};

export const testSlice = createSlice({
  name: "testEffects",
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<Pick<testState, "value">>) {
      state.value = action.payload.value;
    },
  },
});

export const { setValue } = testSlice.actions;

export const selectValue = (state: RootState) => state.test.value;

export default testSlice.reducer;
