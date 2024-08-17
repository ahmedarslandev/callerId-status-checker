import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { securityModel } from "@/models/security.model";
import { cookies } from "next/headers";
import sendEmail from "@/resendEmailConfig/sendEmail";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { data, user }: any = await auth();
    if (!data || !user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }
    const dbUser = await userModel.findById(data.id);
    if (!dbUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid User",
      });
    }
    // Update user information in the database

    const security = await securityModel.findOne({ user_id: dbUser._id });
    if (!security) {
      return NextResponse.json({
        success: false,
        message: "Security information not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "User information updated successfully",
      security,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while connecting to the database",
      error: error.message,
    });
  }
}
export async function PUT(req: NextRequest) {
  connectMongo();
  try {
    const { recovery_email, two_factor_enabled } = await req.json();
    if (!recovery_email && !two_factor_enabled) {
      return NextResponse.json({
        success: false,
        message: "Nothing details Provided",
      });
    }
    if (recovery_email) {
      const UserByEmail = await userModel.findOne({ email: recovery_email });
      if (UserByEmail) {
        return NextResponse.json({
          success: false,
          message: "User with provided email already exists",
        });
      }
    }
    const { user, data }: any = await auth();
    if (!user || !data) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dbUser = await userModel.findById(data.id);
    if (!dbUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid User",
      });
    }

    const security = await securityModel.findOne({ user_id: dbUser._id });
    if (!security) {
      return NextResponse.json({
        success: false,
        message: "Security information not found",
      });
    }
    if (
      security.recovery_email == recovery_email &&
      security.two_factor_enabled == two_factor_enabled
    ) {
      return NextResponse.json({
        success: false,
        message: "No changes made",
      });
    }

    if (
      (!recovery_email && two_factor_enabled) ||
      security.recovery_email == recovery_email
    ) {
      security.two_factor_enabled = two_factor_enabled;
      await security.save();
      return NextResponse.json({
        success: true,
        message: `Two-factor authentication ${
          two_factor_enabled ? "enabled" : "disabled"
        } successfully`,
      });
    }
    security.recovery_email = recovery_email;
    security.two_factor_enabled = two_factor_enabled;

    const cookiesData = JSON.stringify(security);

    cookies().set("email", recovery_email);
    cookies().set("updatedSecurity", cookiesData);
    cookies().set("updatedUser", dbUser);

    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    dbUser.verifyCode = verifyCode;
    dbUser.verifyCodeExpiry = Date.now() + 1000 * 60 * 2;
    dbUser.verifyCodeLimit = 1;

    const updatedUser = JSON.stringify(dbUser);
    cookies().set("updatedUser", updatedUser);
    await sendEmail({
      email: recovery_email,
      username: dbUser.username,
      verifyCode,
    });
    await dbUser.save();

    return NextResponse.json({
      isEmailSent: true,
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while connecting to the database",
      error: error.message,
    });
  }
}
