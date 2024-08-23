import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface Transaction extends Document {
  _id: ObjectId;
  wallet_id: ObjectId;
  amount: string;
  type: string;
  status: string;
  from: string;
  to: string;
  timeStamp: Date;
  bankAccount: string;
  accountHolderName: string;
  bank: string;
}

const transactionSchema = new Schema<Transaction>({
  wallet_id: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
  amount: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["deposit", "withdrawal"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  bankAccount: {
    type: String,
    required: true,
  },
  accountHolderName: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
});
const transactionModel =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export { transactionModel };
