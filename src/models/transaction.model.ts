import mongoose, { Schema, ObjectId, Document, Model } from "mongoose";

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
  BBT: number;
  BAT: number;
  imageUrl?: string; // Image field
  comment?: string; // Comment field
}

const TransactionSchema = new Schema<Transaction>({
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
  BBT: {
    type: Number,
  },
  BAT: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  comment: {
    type: String,
  },
});
const transactionModel: Model<Document> =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

export { transactionModel };
