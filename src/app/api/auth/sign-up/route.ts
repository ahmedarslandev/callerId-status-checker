import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { walletModel } from "@/models/wallet.model";
import { securityModel } from "@/models/security.model";
import axios from "axios";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { username, email, password, confirmPassword } = await req.json();
    // Validate required fields
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if the user or security data already exists
    const existingUser = await userModel.findOne({ email });
    const existingSecurity = await securityModel.findOne({
      recovery_email: email,
    });

    if (existingUser || existingSecurity) {
      return NextResponse.json({
        success: false,
        message: "User with the provided email already exists.",
      });
    }

    // Create and hash password
    const role = email == process.env.ADMIN_EMAIL ? "admin" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    const verifyCodeExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes expiry

    // Create new user, wallet, and security documents
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
      isLoggedInWithCredentials: true,
      verifyCodeLimit: 1,
      role,
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

    user.walletId = wallet._id;
    // Set cookies
    await cookies().set("email", user.email);
    await cookies().set("code-expiry", verifyCodeExpiry.toString());

    // Schedule user deletion if not verified within 24 hours
    setTimeout(async () => {
      const unverifiedUser = await userModel.findOne({
        email: user.email,
        isVerified: false,
      });
      if (unverifiedUser) {
        await userModel.deleteOne({ _id: unverifiedUser._id });
        await walletModel.deleteOne({ _id: unverifiedUser.walletId });
      }
    }, 1000 * 60 * 60 * 24); // 24 hours

    // Send verification email
    const res = axios.post(
      (process.env.EMAIL_MESSAGE_SENDER_URL as any) + "/send-otp",
      {
        email: user.email,
        otp: verifyCode,
        username: user.username,
      }
    );

    res.then((data) => {
      console.log(data);
    });

    // Save all documents
    await Promise.all([user.save(), wallet.save(), security.save()]);

    return NextResponse.json({
      success: true,
      message: "User created successfully. OTP has been sent to your email.",
      user,
    });
  } catch (error: any) {
    console.error("Error in POST /api/create-user:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create user. Please try again later.",
      error: error.message,
    });
  }
}
