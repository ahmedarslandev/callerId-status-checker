import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import sendEmail from "@/resendEmailConfig/sendEmail";
import { walletModel } from "@/models/wallet.model";
import { securityModel } from "@/models/security.model";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { username, email, password, confirmPassword } = await req.json();
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match",
      });
    }
    let user: any;
    user = await userModel.findOne({ email });
    const securitydata = await securityModel.findOne({ recovery_email: email });
    if (user || securitydata) {
      return NextResponse.json({
        success: false,
        message: "User with provided phone number already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    user = new userModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: Date.now() + 1000 * 60 * 2,
      isLoggedInWithCredentials: true,
    });
    const wallet = new walletModel({
      user_id: user._id,
      balance: 0,
      currency: "USD",
    });
    const security = new securityModel({
      user_id: user._id,
      recovery_email: "",
      recovery_phone: "",
      two_factor_enabled: false,
    });

    user.verifyCodeLimit = 1;
    user.walletId = wallet._id;
    await cookies().set("email", user.email);
    await cookies().set("code-expiry", user.verifyCodeExpiry);
    setTimeout(async () => {
      if (user.isVerified != true) {
        await userModel.deleteOne({ phoneNo: user.phoneNo, email: user.email });
      }
    }, 1000 * 60 * 60 * 24);
    sendEmail({ email, username, verifyCode });

    await wallet.save();
    await security.save();
    await user.save();
    return NextResponse.json({
      success: true,
      message: "User created successfully , OTP has been sent successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to create user",
      error: error,
    });
  }
}
