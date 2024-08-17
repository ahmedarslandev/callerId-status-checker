import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import sendEmail from "@/resendEmailConfig/sendEmail";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { user, data }: any = await auth();
    const { currentPassword, newPassword, isLoggedInWithCredentials } =
      await req.json();

    if (!newPassword) {
      return NextResponse.json({
        success: false,
        message: "New password is required",
      });
    }

    if (
      isLoggedInWithCredentials &&
      (!currentPassword || currentPassword.length <= 0)
    ) {
      return NextResponse.json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!data || !user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dbUser = await userModel.findOne({ _id: data.id });

    if (!dbUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid User",
      });
    }

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
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModel.findOneAndUpdate(
        { _id: dbUser._id },
        { password: hashedPassword },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: dbUser._id },
      { password: hashedPassword },
      { new: true }
    );
    console.log(updatedUser);
    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Failed to send verification email",
      error: error.message,
    });
  }
}
