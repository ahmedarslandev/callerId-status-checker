import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer"; // Adjust the import path
import userReducer from "./reducers/user.reducer";
import adminReducer from "./reducers/admin.reducer";

export const store = configureStore({
  reducer: {
    user: authReducer,
    userInfo: userReducer,
    admin: adminReducer,
    // other reducers...
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
