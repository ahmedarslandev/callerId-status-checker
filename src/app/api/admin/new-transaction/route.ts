import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { walletModel } from "@/models/wallet.model";
import { getAuthorizedUser } from "@/api-calls/backend-functions";
import { nanoid } from "nanoid";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

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
      image,
    } = await req.json();

    console.log(image);

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

    const filename = nanoid(20);
    const extension = image.name.split(".").pop();
    const buffer = Buffer.from(await image.arrayBuffer());

    const imageDirectory = join(
      process.cwd(),
      `../file-server-handler/transactionImages/${authorizedUser.id.toString()}`
    );

    try {
      await mkdir(imageDirectory, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
    }

    const filePath = join(imageDirectory, `${filename}.${extension}`);
    await writeFile(filePath, buffer);

    const transaction: any = new transactionModel({
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
      imageUrl: imageDirectory,
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
