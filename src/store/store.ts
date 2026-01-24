import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import loadingReducer from "./loading/loading-slice";
import sienaControlReducer from "./sienaControl/sinaControl-slice";
import taotajimaReducer from "./taotajimaControl/taotajima-slice";
import jiejoeReducer from "./jiejoeControl/jiejoeControl-slice";
import darkModeReducer from "./darkMode/darkMode-slice";

// ...
export const makeStore = () => {
  return configureStore({
    reducer: {
      loading: loadingReducer,
      sienaControl: sienaControlReducer,
      taotajimaControl: taotajimaReducer,
      jiejoeControl: jiejoeReducer,
      darkMode: darkModeReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
