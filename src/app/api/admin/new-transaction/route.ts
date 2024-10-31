import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/dbConfig";
import { Transaction, transactionModel } from "@/models/transaction.model";
import { getAuthorizedUser } from "@/api-calls/backend-functions";
import { nanoid } from "nanoid";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { userModel } from "@/models/user.model";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const formData = await req.formData();

    const userId = formData.get("userId") as any;
    const comment = formData.get("comment") as any;
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
      !userId ||
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
    const user = await userModel.findById(userId).populate("walletId");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
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
        `../file-server-handler/transactionImages/${user.walletId._id.toString()}/${filename}.${extension}`
      );

      // Create the directory if it doesn't exist
      await mkdir(
        join(
          process.cwd(),
          `../file-server-handler/transactionImages/${user.walletId._id.toString()}`
        ),
        { recursive: true }
      );

      // Save the image
      await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

      // Set the imageUrl
      imageUrl = `/transaction/${user.walletId._id}/${filename}.${extension}`;
    }

    const transaction: any = new transactionModel({
      wallet_id: user.walletId,
      amount: parseInt(amount),
      type: transactionType,
      status,
      to: sender,
      from: recipient,
      timestamp,
      bankAccount: bankAccountNumber,
      accountHolderName: bankAccountHolder,
      bank: bankName,
      BBT: user.walletId.balance,
      imageUrl,
      comment,
    });

    // Update wallet balance based on transaction type
    if (transactionType === "deposit") {
      user.walletId.balance += parseInt(amount);
      user.walletId.lastDeposited = Date.now();
      user.walletId.totalDeposited++;
    } else if (transactionType === "withdrawal") {
      if (user.walletId.balance < parseInt(amount)) {
        return NextResponse.json({
          success: false,
          message: "User do not have enough amount to withdraw",
        });
      }
      user.walletId.balance -= parseInt(amount);
      user.walletId.lastWithdraw = Date.now();
      user.walletId.totalWithdraw++;
    }

    user.walletId.transactionsCount++;
    user.walletId.lastUpdated = Date.now();
    transaction.BAT = user.walletId.balance;
    user.walletId.transactions.push(transaction);

    await transaction.save();
    await user.walletId.save();
    await user.save();

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
