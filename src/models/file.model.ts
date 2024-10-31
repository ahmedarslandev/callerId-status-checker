import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface File extends Document {
  _id: ObjectId;
  owner: ObjectId;
  filename: string;
  filePath: string;
  size: number;
  type: string;
  lastModefied: number;
  noOfCallerIds: number;
  extentionName: string;
  status: string;
  realname: string;
}

const fileSchema = new Schema<File>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    default: "",
    unique: true,
  },
  filePath: {
    type: String,
    default: "",
    unique: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "",
  },
  lastModefied: {
    type: Number,
    default: Date.now(),
  },
  noOfCallerIds: {
    type: Number,
    default: 0,
  },
  extentionName: {
    type: String,
    enum: ["xlsx", "xlsm", "csv"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "completed", "failed"],
  },
  realname: {
    type: String,
    default: "",
  },
});

const fileModel =
  mongoose.models.File || mongoose.model("File", fileSchema);

export { fileModel };
