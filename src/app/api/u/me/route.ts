import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import sendEmail from "@/resendEmailConfig/sendEmail";
import { cookies } from "next/headers";
import { securityModel } from "@/models/security.model";
import { auth } from "@/auth";

// Handler for GET requests
export async function GET(req: NextRequest) {
  await connectMongo();

  try {
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

    console.log("User verified");

    // Return success response with the user data
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
  await connectMongo();

  try {
    const data = await auth();

    // Check if user is authenticated
    if (!data || !data?.user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const { username, email, bio } = await req.json();

    // Check if email already exists in userModel or securityModel
    const emailExists =
      (await userModel.exists({ email })) ||
      (await securityModel.exists({ recovery_email: email }));
    if (emailExists) {
      return NextResponse.json({
        message: "User with provided email already exists",
        success: false,
      });
    }

    const dbUser = await userModel.findById(data?.data?.id);

    // Handle email verification if the email length is greater than 8
    if (email.length > 8) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000);
      await sendEmail({ email, username, verifyCode });

      dbUser.username = username;
      dbUser.email = email;
      dbUser.bio = bio;
      dbUser.verifyCode = verifyCode;
      dbUser.verifyCodeExpiry = Date.now() + 1000 * 60 * 2; // 2 minutes expiry
      dbUser.verifyCodeLimit = 1;

      await dbUser.save();

      // Set the cookies
      const cookiesInstance = cookies();
      cookiesInstance.set("email", dbUser.email);
      cookiesInstance.set("updatedUser", JSON.stringify(dbUser));

      return NextResponse.json({
        isEmailSent: true,
        dbUser,
        success: true,
        message: "Verification code sent successfully",
      });
    }

    // Update user profile without email verification
    const updatedUser = await userModel.findByIdAndUpdate(
      data?.data?.id,
      { username, email, bio },
      { new: true }
    );

    return NextResponse.json({
      dbUser: updatedUser,
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
