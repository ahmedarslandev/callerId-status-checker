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
    const { amount, bankAccount, accountHolderName, bank } = await req.json();
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

    const transaction = new transactionModel({
      wallet_id: dbUser.walletId,
      amount,
      bankAccount,
      accountHolderName,
      bank,
      status: "pending",
      type: "withdrawal",
      to: dbUser.username,
      from: bank,
    });
    if (dbUser.walletId.balance <= amount) {
      return NextResponse.json({
        message: "Insufficient balance",
        success: false,
      });
    }
    dbUser.walletId.balance -= amount;
    dbUser.walletId.transactions.push(transaction);
    dbUser.walletId.transactionsCount++;
    dbUser.walletId.lastWithdraw = Date.now();
    dbUser.walletId.lastUpdated = Date.now();
    dbUser.walletId.totalWithdraw++;

    sendTransactionEmail(transaction, dbUser);
    await Promise.all([
      dbUser.save(),
      dbUser.walletId.save(),
      transaction.save(),
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
