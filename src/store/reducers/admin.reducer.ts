import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    transactions: {
      transactions: [],
    } as any,
  },
  reducers: {
    setTranscations: (state, action) => {
      state.transactions.transactions =
        action.payload.transactions.transactions;
    },
    updateTransactions: (state, action) => {
      if (action.payload.type === "add") {
        state.transactions.transactions.push(action.payload.transaction);
      } else if (action.payload.type === "delete") {
        state.transactions.transactions =
          state.transactions.transactions.filter(
            (e: any) => e._id !== action.payload.transactionId
          );
      } else if (state.transactions.type == "update") {
        const index = state.transactions.transactions.findIndex(
          (trans: any) => trans._id === action.payload.transactionId
        );

        if (index !== -1) {
          state.transactions.transactions[index] = {
            ...state.transactions.transactions[index],
            ...action.payload.transaction,
          };
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTranscations, updateTransactions } = adminSlice.actions;

export default adminSlice.reducer;
