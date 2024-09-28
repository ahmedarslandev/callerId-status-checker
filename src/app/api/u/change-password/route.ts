import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { walletModel } from "@/models/wallet.model";

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
      .populate({path:"walletId" , model:walletModel});
    console.log("User fetched");

    // Check if user exists and is verified
    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }
    const { currentPassword, newPassword, isLoggedInWithCredentials } =
      await req.json();

    // Validate input
    if (!newPassword) {
      return NextResponse.json({
        success: false,
        message: "New password is required",
      });
    }

    if (isLoggedInWithCredentials && !currentPassword) {
      return NextResponse.json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!dbUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid user",
      });
    }

    // Check current password if user is logged in with credentials
    if (isLoggedInWithCredentials) {
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        dbUser.password
      );
      if (!passwordMatch) {
        return NextResponse.json({
          success: false,
          message: "Incorrect current password",
        });
      }
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(
      dbUser._id,
      { password: hashedPassword },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating password:", error.message);
    return NextResponse.json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
}
