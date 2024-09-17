import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { cookies } from "next/headers";
import { securityModel } from "@/models/security.model";
import { auth } from "@/auth";
import axios from "axios";

// Utility to handle authentication and DB connection
async function authenticateAndConnect() {
  await connectMongo();
  const data = await auth();

  if (!data || !data.user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      ),
    };
  }

  return { user: data.user, userId: data.data.id };
}

// Handler for GET requests
export async function GET(req: NextRequest) {
  try {
    const { user, userId, errorResponse } = await authenticateAndConnect();

    if (!user) return errorResponse;

    console.log("Authentication successful");

    // Fetch user and populate walletId
    const dbUser = await userModel.findById(userId).populate("walletId");

    if (!dbUser) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }

    console.log("User verified");

    return NextResponse.json({
      success: true,
      message: "Signed In Successfully",
      dbUser,
    });
  } catch (error: any) {
    console.error("Error occurred while signing in:", error);
    return NextResponse.json({
      success: false,
      message: "Error occurred while signing in",
      error: error.message,
    });
  }
}

// Handler for PUT requests (updating user profile)
export async function PUT(req: NextRequest) {
  try {
    const { user, userId, errorResponse } = await authenticateAndConnect();

    if (!user) return errorResponse;

    const { username, email, bio } = await req.json();

    // Check if the email is already taken by another user
    const emailExists = await userModel.findOne({ email });
    const securityExists = await securityModel.findOne({
      recovery_email: email,
    });

    if (emailExists && emailExists._id.toString() !== userId) {
      if (!securityExists || securityExists.user_id.toString() !== userId) {
        return NextResponse.json({
          message: "User with provided email already exists",
          success: false,
        });
      }
    }

    const dbUser = await userModel.findById(userId);

    // Check if email is changing and send verification if needed
    if (dbUser.email !== email && email.length > 8) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000);

      await axios.post(`${process.env.EMAIL_MESSAGE_SENDER_URL}/send-otp`, {
        email,
        otp: verifyCode,
        username,
      });

      // Update the user with verification data
      dbUser.verifyCode = verifyCode;
      dbUser.verifyCodeExpiry = Date.now() + 1000 * 60 * 2; // 2 minutes
      dbUser.verifyCodeLimit = 1;
      dbUser.username = username;
      dbUser.bio = bio;

      await dbUser.save();

      console.log(verifyCode);
      // Set the cookies
      const cookiesInstance = cookies();
      cookiesInstance.set("email", dbUser.email);
      dbUser.email = email;
      cookiesInstance.set("updatedUser", JSON.stringify(dbUser));

      return NextResponse.json({
        isEmailSent: true,
        dbUser,
        success: true,
        message: "Verification code sent successfully",
      });
    }

    // Update user profile without email change
    dbUser.username = username;
    dbUser.bio = bio;

    await dbUser.save();

    return NextResponse.json({
      dbUser,
      success: true,
      message: "Updated user successfully",
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({
      message: "Error updating profile",
      success: false,
    });
  }
}
