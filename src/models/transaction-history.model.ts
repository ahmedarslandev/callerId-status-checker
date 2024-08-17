import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface TransactionHistory extends Document {
  _id: ObjectId;
  wallet_id: ObjectId;
  transactions: [];
  created_at: Date;
  updated_at: Date;
}


const transactionHistorySchema = new Schema<TransactionHistory>({
    wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  const transactionHistoryModel = mongoose.models.TransactionHistory || mongoose.model("TransactionHistory", transactionHistorySchema);

export { transactionHistoryModel };
  