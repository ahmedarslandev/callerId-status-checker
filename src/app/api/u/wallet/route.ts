import { NextRequest, NextResponse } from"next/server";
import { auth } from"@/auth";
import { userModel } from"@/models/user.model";
import { walletModel } from"@/models/wallet.model";
import connectMongo from"@/lib/dbConfig";
import { transactionModel } from"@/models/transaction.model";

export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const { data, user }: any = await auth();
    if (!data || !user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const dbUser = await userModel.findOne({ _id: data.id }).populate({
      path: "walletId",
    });

    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }

    const transactions = await transactionModel.find({
      wallet_id: dbUser.walletId._id,
    });

    return NextResponse.json({
      success: true,
      message: "Signed In Successfully",
      dbUser: dbUser.toObject(), // Convert to plain object to avoid circular referenceswallet: dbUser.wallet.toObject(),
      transactions: transactions.map((transaction) => transaction.toObject()),
    });
  } catch (error:any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error occurred while signing up",
      error: error.message, // Only include the error message to avoid circular references
    });
  }
}
