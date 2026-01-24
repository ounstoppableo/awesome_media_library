import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface darkModeState {
  darkMode: boolean;
}

const initialState: darkModeState = {
  darkMode: true,
};

export const darkModeSlice = createSlice({
  name: "darkModeEffects",
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<Pick<darkModeState, "darkMode">>) {
      state.darkMode = action.payload.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
  },
});

export const { setDarkMode } = darkModeSlice.actions;

export const selectDarkMode = (state: RootState) => state.darkMode.darkMode;

export default darkModeSlice.reducer;
