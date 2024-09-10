import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/dbConfig";
import { transactionModel } from "@/models/transaction.model";
import { getAuthorizedUser } from "@/api-calls/backend-functions";

export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const user = await getAuthorizedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        message: "Invalid Transaction ID",
      });
    }

    const transaction = await transactionModel.findById(transactionId);

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: "Invalid Transaction",
      });
    }

    return NextResponse.json({
      success: true,
      message: "File successfully fetched",
      transaction,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error processing file",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    await getAuthorizedUser(req);

    const transactions = await transactionModel.find();

    return NextResponse.json({
      success: true,
      transactions: transactions.reverse(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Error retrieving files",
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();
    const { status, transactionId } = await req.json();

    if (!status) {
      return NextResponse.json({ success: false, message: "Invalid status" });
    }

    await getAuthorizedUser(req);

    const transaction = await transactionModel.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: "Transaction not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Transaction status updated",
      transaction,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Error updating transaction",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        message: "Invalid Transaction ID",
      });
    }

    await getAuthorizedUser(req);

    const result = await transactionModel.deleteOne({ _id: transactionId });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Transaction not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Error deleting transaction",
    });
  }
}
