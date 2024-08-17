import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface Security extends Document {
  _id: ObjectId;
  user_id: ObjectId;
  recovery_email: string;
  two_factor_enabled: boolean;
}

const securitySchema = new Schema<Security>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  recovery_email: {
    type: String,
  },
  two_factor_enabled: {
    type: Boolean,
    default: false,
  }
});

const securityModel =
  mongoose.models.Security || mongoose.model("Security", securitySchema);

export { securityModel };
