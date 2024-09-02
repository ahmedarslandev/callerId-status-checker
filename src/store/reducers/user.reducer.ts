import { createSlice } from "@reduxjs/toolkit";

// Thunk to fetch user data

// Slice to manage user state
export const userSlice = createSlice({
  name: "userInfo",
  initialState: {
    transactions: {
      transactions: [],
      wallet: {},
    } as any,
    files: [] as any,
  },
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload.files;
    },
    updateFiles: (state, action) => {
      if (action.payload.type === "add") {
        state.files = state.files.push(action.payload.file);
      } else if (action.payload.type === "delete") {
        state.files = state.files.filter(
          (e: any) => e._id !== action.payload.fileId
        );
      }
    },
    setTranscations: (state, action) => {
      state.transactions.transactions =
        action.payload.transactions.transactions;
      state.transactions.wallet = action.payload.transactions.wallet;
    },
    updateTransactions: (state, action) => {
      if (action.payload.type === "add") {
        state.transactions.transactions.push(action.payload.transaction);
      } else if (action.payload.type === "delete") {
        state.transactions.transactions =
          state.transactions.transactions.filter(
            (e: any) => e._id !== action.payload.transactionId
          );
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFiles, setTranscations, updateFiles, updateTransactions } =
  userSlice.actions;

export default userSlice.reducer;
