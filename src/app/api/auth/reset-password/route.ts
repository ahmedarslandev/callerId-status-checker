import { userModel } from "@/models/user.model";
import { securityModel } from "@/models/security.model";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { email, verifyCode, newPassword, confirmNewPassword } =
      await req.json();

    // Validate required fields
    if (!email || !verifyCode || !newPassword || !confirmNewPassword) {
      return NextResponse.json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user and their security document
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User with the provided email does not exist.",
      });
    }

    if (
      !user ||
      user.verifyCode != verifyCode ||
      Date.now() > user.verifyCodeExpiry
    ) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    (user.verifyCode = ""),
      (user.verifyCodeExpiry = ""),
      (user.verifyCodeLimit = 0);
    await user.save();

    // Optionally clear the verification code from the security document
    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error: any) {
    console.error("Error in POST /api/reset-password:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to reset password. Please try again later.",
      error: error.message,
    });
  }
}
