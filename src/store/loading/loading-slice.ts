import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface loadingState {
  globalLoading: boolean;
  sienaLoading: boolean;
  taotajimaLoading: boolean;
}

const initialState: loadingState = {
  globalLoading: true,
  sienaLoading: false,
  taotajimaLoading: false,
};

export const loadingSlice = createSlice({
  name: "loadingEffects",
  initialState,
  reducers: {
    setGlobalLoading(
      state,
      action: PayloadAction<Pick<loadingState, "globalLoading">>
    ) {
      state.globalLoading = action.payload.globalLoading;
    },
    setSienaLoading(
      state,
      action: PayloadAction<Pick<loadingState, "sienaLoading">>
    ) {
      state.sienaLoading = action.payload.sienaLoading;
    },
    setTaotajimaLoading(
      state,
      action: PayloadAction<Pick<loadingState, "taotajimaLoading">>
    ) {
      state.taotajimaLoading = action.payload.taotajimaLoading;
    },
  },
});

export const { setGlobalLoading, setSienaLoading, setTaotajimaLoading } =
  loadingSlice.actions;

export const selectGlobalLoading = (state: RootState) =>
  state.loading.globalLoading;
export const selectSienaLoading = (state: RootState) =>
  state.loading.sienaLoading;
export const selectTaotajimaLoading = (state: RootState) =>
  state.loading.taotajimaLoading;
export default loadingSlice.reducer;
