import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface User extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: string;
  verifyCodeLimit: number;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  profileImage: string;
  bio: string;
  walletId: ObjectId;
  googleId: string;
  githubId: string;
  twitterId: string;
  facebookId: string;
  files: [];
  isLoggedInWithCredentials: boolean;
  isBlocked: boolean;
}

const userSchema = new Schema<User>({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  profileImage: { type: String, default: "https://via.placeholder.com/150" },
  verifyCode: { type: String, default: "" },
  verifyCodeExpiry: { type: String, default: "" },
  verifyCodeLimit: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  bio: { type: String, default: "" },
  walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
  googleId: { type: String, default: "" },
  githubId: { type: String, default: "" },
  twitterId: { type: String, default: "" },
  facebookId: { type: String, default: "" },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  files: [
    {
      type:Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  isLoggedInWithCredentials: { type: Boolean, default: false },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export { userModel };
