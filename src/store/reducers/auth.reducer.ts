import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch user data
export const getUser = createAsyncThunk("user/getUser", async () => {
  const { data } = await axios.get("/api/u/me");
  return data.dbUser;
});

// Slice to manage user state
export const authSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions;

export default authSlice.reducer;
