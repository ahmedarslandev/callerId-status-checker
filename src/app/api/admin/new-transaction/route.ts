import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { walletModel } from "@/models/wallet.model";

type AuthData = {
  id: string;
  email: string;
};

async function getAuthorizedUser(req: NextRequest): Promise<AuthData> {
  await connectMongo();
  const { data }: any = await auth();

  if (!data) {
    throw new Error("Unauthorized");
  }

  const dbUser = await userModel.findById(data.id);
  if (!dbUser || dbUser.email !== process.env.TRANSACTION_EMAIL) {
    throw new Error("Unauthorized");
  }

  return { id: dbUser._id.toString(), email: dbUser.email };
}

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const {
      walletId,
      amount,
      transactionType,
      status,
      sender,
      recipient,
      timestamp,
      bankAccountNumber,
      bankAccountHolder,
      bankName,
    } = await req.json();

    if (
      !walletId ||
      !amount ||
      !transactionType ||
      !status ||
      !sender ||
      !recipient ||
      !timestamp ||
      !bankAccountNumber ||
      !bankAccountHolder ||
      !bankName
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const authorizedUser = await getAuthorizedUser(req);
    if (!authorizedUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const wallet = await walletModel.findById(walletId);
    if (!wallet) {
      return NextResponse.json({ success: false, message: "Invalid wallet" });
    }
    if (amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" });
    }

    const transaction = new transactionModel({
      wallet_id: walletId,
      amount: parseInt(amount),
      type: transactionType,
      status,
      to: sender,
      from: recipient,
      timestamp,
      bankAccount: bankAccountNumber,
      accountHolderName: bankAccountHolder,
      bank: bankName,
      BBT: wallet.balance,
    });

    transactionType == "deposit"
      ? (wallet.balance += parseInt(transaction.amount))
      : (wallet.balance -= parseInt(transaction.amount));
    transactionType == "deposit"
      ? (wallet.lastDeposited = Date.now())
      : (wallet.lastWithdraw = Date.now());
    transactionType == "deposit"
      ? wallet.totalDeposited++
      : wallet.totalWithdraw++;

    transaction.BAT = wallet.balance;
    wallet.transactionsCount++;
    wallet.lastUpdated = Date.now();

    wallet.transactions.push(transaction);

    await transaction.save();
    await wallet.save();

    return NextResponse.json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
