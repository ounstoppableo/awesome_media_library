import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface loadingState {
  globalLoading: boolean;
  sienaLoading: boolean;
  taotajimaLoading: boolean;
  mediaLibraryLoading: boolean;
  assetsManageLoading: boolean;
}

const initialState: loadingState = {
  globalLoading: true,
  sienaLoading: false,
  taotajimaLoading: false,
  mediaLibraryLoading: false,
  assetsManageLoading: false,
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
    setMediaLibraryLoading(
      state,
      action: PayloadAction<Pick<loadingState, "mediaLibraryLoading">>
    ) {
      state.mediaLibraryLoading = action.payload.mediaLibraryLoading;
    },
    setAssetsManageLoading(
      state,
      action: PayloadAction<Pick<loadingState, "assetsManageLoading">>
    ) {
      state.assetsManageLoading = action.payload.assetsManageLoading;
    },
  },
});

export const {
  setGlobalLoading,
  setSienaLoading,
  setTaotajimaLoading,
  setMediaLibraryLoading,
  setAssetsManageLoading,
} = loadingSlice.actions;

export const selectGlobalLoading = (state: RootState) =>
  state.loading.globalLoading;
export const selectSienaLoading = (state: RootState) =>
  state.loading.sienaLoading;
export const selectTaotajimaLoading = (state: RootState) =>
  state.loading.taotajimaLoading;
export const selectMediaLibraryLoading = (state: RootState) =>
  state.loading.mediaLibraryLoading;
export const selectAssetsManageLoading = (state: RootState) =>
  state.loading.assetsManageLoading;
export default loadingSlice.reducer;
