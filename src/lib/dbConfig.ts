import { transactionModel } from "@/models/transaction.model";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};
async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    console.log("Mongoose connection is available already");
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "CallerId-Status-Checker",
    };

    cached.promise = mongoose.connect(MONGO_URI, opts);
    console.log("Mongoose connectioned successfully");
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}
export default connectMongo;
