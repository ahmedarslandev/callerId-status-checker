import { NextRequest, NextResponse } from "next/server";
import { transactionModel } from "@/models/transaction.model";
import connectMongo from "@/lib/dbConfig";
import { IsUser } from "../checkDbUser";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const dbUser = await IsUser();
    // Fetch transactions associated with the user's wallet
    const transactions = await transactionModel
      .find({ wallet_id: dbUser.walletId?._id })
      .lean();

    // Return the response with user and transaction details
    return NextResponse.json({
      success: true,
      message: "Signed In Successfully",
      dbUser, // Using lean() avoids the need to manually convert to a plain object
      wallet: dbUser.walletId,
      transactions,
    });
  } catch (error: any) {
    console.error("Error in POST request:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while signing in",
        error: error.message,
      },
      { status: 500 } // Internal Server Error status code
    );
  }
}
