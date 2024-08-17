import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please provide both email and password",
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found with provided email",
      });
    }
    if (user.isVerified == false && user.isVerified != true) {
      return NextResponse.json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const data = {user};

    const token = await jwt.sign(data, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Failed to create token",
      });
    }

    await cookies().set("token", token);
    await cookies().delete("email");

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      token,
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
