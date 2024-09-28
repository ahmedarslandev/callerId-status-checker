import { getAuthorizedUser } from "@/api-calls/backend-functions";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { userModel } from "@/models/user.model";
import { walletModel } from "@/models/wallet.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectMongo();

  try {
    const { user }: any = await getAuthorizedUser(req);

    if (!user || user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const users = await userModel.find();

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { userId, email } = await req.json();

    if (!userId && !email) {
      return NextResponse.json({
        success: false,
        message: "User ID  or Email is required",
      });
    }

    const { user }: any = await getAuthorizedUser(req);

    if (!user || user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }
    let dbUser;
    if (email) {
      dbUser = await userModel.findOne({ email: email }).populate({
        path: "walletId",
        populate: { path: "transactions", model: transactionModel },
        model: walletModel,
      });
    } else {
      dbUser = await userModel.findOne({ _id: userId }).populate({
        path: "walletId",
        populate: { path: "transactions", model: transactionModel },
        model: walletModel,
      });
    }

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      user: dbUser,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}

export async function PUT(req: NextRequest) {
  await connectMongo();

  try {
    const { updatedUser } = await req.json();
    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User data is required",
      });
    }

    const { user }: any = await getAuthorizedUser(req);
    if (!user || user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const userToSave = { ...updatedUser, walletId: updatedUser.walletId._id };
    const walletToSave = {
      ...updatedUser.walletId,
      transactions: updatedUser.walletId.transactions.map(
        (transaction: any) => transaction._id
      ),
    };

    console.log(userToSave, walletToSave);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      updatedUser: await userModel.findByIdAndUpdate(
        updatedUser._id,
        userToSave,
        { new: true }
      ),
      updatedWallet: await walletModel.findByIdAndUpdate(
        updatedUser.walletId._id,
        walletToSave,
        { new: true }
      ),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
