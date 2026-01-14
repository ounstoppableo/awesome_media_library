import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import testReducer from "./test/test-slice";

// ...
export const makeStore = () => {
  return configureStore({
    reducer: {
      test: testReducer,
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
