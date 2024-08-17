import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface Wallet extends Document {
  _id: ObjectId;
  balance: number;
  currency: string;
  user_id: ObjectId;
  transactions: [];
  transactionsCount: number;
  lastUpdated: Date;
  lastWithdraw: Date;
  lastDeposited: Date;
  totalTransactions: number;
  totalWithdrawn: number;
  totalDeposited: number;
  totalTransactionsCount: number;
  totalDepositsCount: number;
  totalWithdrawalsCount: number;
  totalBalanceCount: number;
}

const walletSchema = new Schema<Wallet>({
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    required: true,
    default: "USD",
    enum: [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "CNY",
      "INR",
      "PKR",
    ],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  transactionsCount: {
    type: Number,
    default: 0,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lastWithdraw: {
    type: Date,
    default: null,
  },
  lastDeposited: {
    type: Date,
    default: null,
  },
  totalTransactions: {
    type: Number,
    default: 0,
    required: true,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
    required: true,
  },
  totalDeposited: {
    type: Number,
    default: 0,
    required: true,
  },
  totalTransactionsCount: {
    type: Number,
    default: 0,
    required: true,
  },
  totalDepositsCount: {
    type: Number,
    default: 0,
    required: true,
  },
  totalWithdrawalsCount: {
    type: Number,
    default: 0,
    required: true,
  },
  totalBalanceCount: {
    type: Number,
    default: 0,
    required: true,
  }
});
const walletModel =
  mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export { walletModel };
