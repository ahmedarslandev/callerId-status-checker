import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer"; // Adjust the import path
import userReducer from "./reducers/user.reducer";

export const store = configureStore({
  reducer: {
    user: authReducer,
    userInfo: userReducer,
    // other reducers...
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
