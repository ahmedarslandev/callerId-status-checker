import { userModel } from "@/models/user.model";
import { cookies } from "next/headers";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const email = await cookies().get("email")?.value;
    const user = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    if (user.verifyCodeLimit >= 5) {
      setTimeout(async () => {
        user.verifyCodeLimit = 0;
        await user.save();
      }, 1000 * 60 * 2);
      return NextResponse.json({
        success: false,
        message: "Verify Code Limit reached please try after 1 hour.",
      });
    }
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = Date.now() + 1000 * 60 * 2;
    user.verifyCodeLimit = user.verifyCodeLimit + 1;

    await user.save();
    await cookies().set("code-expiry", user.verifyCodeExpiry);
    const response = axios.post(
      (process.env.EMAIL_MESSAGE_SENDER_URL as any) + "/send-otp",
      {
        email: user.email,
        otp: verifyCode,
        username: user.username,
      }
    );
    response.then((data) => {
      console.log(data);
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      verifyCode,
      expiry: user.verifyCodeExpiry,
      limit: user.verifyCodeLimit,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Failed to send email to user",
      error,
    });
  }
}
