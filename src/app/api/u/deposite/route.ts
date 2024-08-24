import { auth } from "@/auth";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { userModel } from "@/models/user.model";
import sendTransactionEmail from "@/resendEmailConfig/sendTransactionEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { data, user }: any = await auth();
    const { transactionId, bankName } = await req.json();

    if (!data || !user) {
      return NextResponse.json({ message: "Unauthorized", success: false });
    }

    const dbUser = await userModel
      .findById(data.id)
      .populate("walletId")
      .exec();

    if (!dbUser) {
      return NextResponse.json({ message: "User not found", success: false });
    }

    await Promise.all([
      dbUser.save(),
      dbUser.walletId.save(),
      sendTransactionEmail(
        { transactionId, bank:bankName, type: "deposit", timeStamp: Date.now() },
        dbUser
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
