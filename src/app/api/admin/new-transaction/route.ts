import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { walletModel } from "@/models/wallet.model";
import { getAuthorizedUser } from "@/api-calls/backend-functions";
import { nanoid } from "nanoid";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    // Get formData from the request
    const formData = await req.formData();

    // Extract fields from formData
    const walletId = formData.get("walletId") as any;
    const amount = formData.get("amount") as any;
    const transactionType = formData.get("transactionType") as any;
    const status = formData.get("status") as any;
    const sender = formData.get("sender");
    const recipient = formData.get("recipient");
    const timestamp = formData.get("timestamp");
    const bankAccountNumber = formData.get("bankAccountNumber");
    const bankAccountHolder = formData.get("bankAccountHolder") as any;
    const bankName = formData.get("bankName") as any;
    const image = formData.get("image") as any; // The uploaded file (optional)

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

    if (parseInt(amount) <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" });
    }

    let imageUrl = null;

    // Check if an image was uploaded
    if (image && image?.name) {
      // Ensure the image has a name or assign a default extension
      const filename = nanoid(20);
      const extension = image.name ? image.name.split(".").pop() : "jpg"; // Default to jpg if name is missing

      const filePath = join(
        process.cwd(),
        `../file-server-handler/transactionImages/${wallet._id.toString()}/${filename}.${extension}`
      );

      // Create the directory if it doesn't exist
      await mkdir(
        join(
          process.cwd(),
          `../file-server-handler/transactionImages/${wallet._id.toString()}`
        ),
        { recursive: true }
      );

      // Save the image
      await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

      // Set the imageUrl
      imageUrl = `/transaction/${walletId}/${filename}.${extension}`;
    }

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
      imageUrl, // Use the imageUrl if an image was uploaded, otherwise null
    });

    // Update wallet balance based on transaction type
    if (transactionType === "deposit") {
      wallet.balance += parseInt(amount);
      wallet.lastDeposited = Date.now();
      wallet.totalDeposited++;
    } else if (transactionType === "withdrawal") {
      wallet.balance -= parseInt(amount);
      wallet.lastWithdraw = Date.now();
      wallet.totalWithdraw++;
    }

    wallet.transactionsCount++;
    wallet.lastUpdated = Date.now();
    transaction.BAT = wallet.balance;
    wallet.transactions.push(transaction);

    await transaction.save();
    await wallet.save();

    return NextResponse.json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
