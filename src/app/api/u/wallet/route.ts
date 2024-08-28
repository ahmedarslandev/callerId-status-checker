import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { transactionModel } from "@/models/transaction.model";
import connectMongo from "@/lib/dbConfig";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { data, user }: any = await auth();

    // Check for unauthorized access
    if (!data || !user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Fetch user and populate wallet details
    const dbUser: any = await userModel
      .findById(data.id)
      .populate("walletId")
      .lean(); // Use lean for performance improvement

    // Validate user and verification status
    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }

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
