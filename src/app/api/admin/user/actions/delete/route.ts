import { getAuthorizedUser } from "@/api-calls/backend-functions";
import connectMongo from "@/lib/dbConfig";
import { fileModel } from "@/models/file.model";
import { securityModel } from "@/models/security.model";
import { Transaction, transactionModel } from "@/models/transaction.model";
import { userModel } from "@/models/user.model";
import { walletModel } from "@/models/wallet.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { user: userToDelete } = await req.json();

    if (!userToDelete) {
      return NextResponse.json({
        success: false,
        message: "User is required",
      });
    }

    const { user }: any = await getAuthorizedUser(req);

    if (!user || user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const dbUser = await userModel.findById(userToDelete._id);

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const wallet = await walletModel
      .findById(dbUser.walletId)
      .populate({path:"transactions" , model:transactionModel});

    if (!wallet) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    wallet.transactions.forEach(async (transaction: Transaction) => {
      await transactionModel.findByIdAndDelete(transaction._id);
    });

    dbUser.files.forEach(async (file: File) => {
      await fileModel.findByIdAndDelete(file);
    });

    await securityModel.findOneAndDelete({ owner: dbUser._id });
    await walletModel.findByIdAndDelete(wallet._id);
    await userModel.findByIdAndDelete(dbUser._id);

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
