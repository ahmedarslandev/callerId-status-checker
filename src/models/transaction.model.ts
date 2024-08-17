import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface Transaction extends Document {
  _id: ObjectId;
  wallet_id: ObjectId;
  amount: string;
  type: string;
  status: string;
  from: ObjectId;
  to: ObjectId;
  timeStamp:Date;
}

const transactionSchema = new Schema<Transaction>({
    wallet_id:{
        type: Schema.Types.ObjectId,
        ref: "Wallet"
    },
    amount: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["deposit", "withdrawal"]
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"]
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }
});
const transactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export { transactionModel };
