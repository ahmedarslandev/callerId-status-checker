import { NextRequest, NextResponse } from "next/server";
import { transactionModel } from "@/models/transaction.model";
import connectMongo from "@/lib/dbConfig";
import { IsUser } from "../checkDbUser";
import { userModel } from "@/models/user.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const data = await auth();

    // Check if user is authenticated
    if (!data || !data?.user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    console.log("Authentication successful");

    // Fetch the user from the database and populate the walletId field
    const dbUser = await userModel
      .findById(data?.data?.id)
      .populate("walletId");
    console.log("User fetched");

    // Check if user exists and is verified
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
