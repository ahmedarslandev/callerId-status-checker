import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface CallerId extends Document {
  _id: ObjectId;
  number: string;
  type: string;
}

const CallerIdSchema = new Schema<CallerId>({
  number: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Spam", "Robo"],
  },
});
const callerIdModel =
  mongoose.models.CallerId || mongoose.model("CallerId", CallerIdSchema);

export { callerIdModel };
