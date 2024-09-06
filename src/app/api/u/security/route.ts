import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { securityModel } from "@/models/security.model";
import { cookies } from "next/headers";
import sendEmail from "@/resendEmailConfig/sendEmail";
import { IsUser } from "../checkDbUser";

// Handler for POST requests
export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const dbUser = await IsUser();

    const security = await securityModel.findOne({ user_id: dbUser._id });

    // Check if security information exists
    if (!security) {
      return NextResponse.json({
        success: false,
        message: "Security information not found",
      });
    }

    // Successfully return the security information
    return NextResponse.json({
      success: true,
      message: "User information retrieved successfully",
      security,
    });
  } catch (error: any) {
    console.error("Error during POST request:", error.message);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
}

// Handler for PUT requests (updating security information)
export async function PUT(req: NextRequest) {
  await connectMongo();

  try {
    const { recovery_email, two_factor_enabled } = await req.json();

    // Validate if any details are provided
    if (!recovery_email && !two_factor_enabled) {
      return NextResponse.json({
        success: false,
        message: "No details provided",
      });
    }

    // Check if the provided email already exists in userModel
    if (recovery_email) {
      const userByEmail = await userModel.findOne({ email: recovery_email });
      const securityByEmail = await securityModel.findOne({ recovery_email });

      if (userByEmail || securityByEmail) {
        return NextResponse.json({
          success: false,
          message: "User with the provided email already exists",
        });
      }
    }

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
      .populate("walletId");
    console.log("User fetched");

    // Check if user exists and is verified
    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }


    const security = await securityModel.findOne({ user_id: dbUser._id });

    // Check if security information exists
    if (!security) {
      return NextResponse.json({
        success: false,
        message: "Security information not found",
      });
    }

    // Check if there are any changes to be made
    if (
      security.recovery_email === recovery_email &&
      security.two_factor_enabled === two_factor_enabled
    ) {
      return NextResponse.json({
        success: false,
        message: "No changes made",
      });
    }

    // Update only two-factor authentication if recovery email is not provided
    if (!recovery_email && two_factor_enabled !== undefined) {
      security.two_factor_enabled = two_factor_enabled;
      await security.save();

      return NextResponse.json({
        success: true,
        message: `Two-factor authentication ${
          two_factor_enabled ? "enabled" : "disabled"
        } successfully`,
      });
    }

    // Update security information
    security.recovery_email = recovery_email;
    security.two_factor_enabled = two_factor_enabled;
    await security.save();

    // Set cookies with updated security information
    cookies().set("email", recovery_email);
    cookies().set("updatedSecurity", JSON.stringify(security));
    cookies().set("updatedUser", JSON.stringify(dbUser));

    // Generate and send a verification code if the email is updated
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    dbUser.verifyCode = verifyCode;
    dbUser.verifyCodeExpiry = Date.now() + 1000 * 60 * 2; // 2 minutes expiry
    dbUser.verifyCodeLimit = 1;

    // Save updated user and set cookies
    await dbUser.save();
    cookies().set("updatedUser", JSON.stringify(dbUser));

    await sendEmail({
      email: recovery_email,
      username: dbUser.username,
      verifyCode,
    });

    return NextResponse.json({
      isEmailSent: true,
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error: any) {
    console.error("Error during PUT request:", error.message);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
}
