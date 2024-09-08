import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: NextRequest) {
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
        message: "User with the provided email does not exist.",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    user.verifyCode = OTP;
    user.verifyCodeExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes expiry
    user.verifyCodeLimit = 0;
    user.verifyCodeLimit += 1; // Only allow one verification attempt per user within 2 minutes

    // Send email asynchronously and log any errors, without blocking the response
    const response = axios.post(
      (process.env.EMAIL_MESSAGE_SENDER_URL as any) + "/send-otp",
      {
        email: user.email,
        otp: OTP,
        username: user.username,
      }
    );
    response.then((data) => {
      console.log(data);
    });

    cookies().set("email", user.email);

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error: any) {
    console.error("Error in POST /api/send-verification:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send verification code. Please try again later.",
      error: error.message,
    });
  }
}
