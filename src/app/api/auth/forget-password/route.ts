import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "@/resendEmailConfig/sendEmail";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User with provided email does not exist.",
      });
    }
    const OTP = Math.floor(100000 + Math.random() * 900000);

    user.verifyCode = OTP;
    user.verifyCodeExpiry = Date.now() + 1000 * 60 * 2;
    sendEmail({ email: user.email, username: user.username, OTP });
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to sign up",
      error: error,
    });
  }
}
