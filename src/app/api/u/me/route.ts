import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import sendEmail from "@/resendEmailConfig/sendEmail";
import { cookies } from "next/headers";
import { securityModel } from "@/models/security.model";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { data, user }: any = await auth();
    if (!data || !user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const dbUser = await userModel.findOne({ _id: data.id }).populate({
      path: "walletId",
    });

    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signed In Successfully",
      dbUser,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      success: false,
      message: "Error occurred while signing up",
      error,
    });
  }
}

export async function PUT(req: NextRequest, res: Response) {
  try {
    const { user, data }: any = await auth();

    if (user && data) {
      const { username, email, bio } = await req.json();
      const userByEmail = await userModel.findOne({ email });
      const securityByEmail = await securityModel.findOne({
        recovery_email: email,
      });
      if (userByEmail || securityByEmail) {
        return NextResponse.json({
          message: "User with provided email already exists",
          success: false,
        });
      }
      if (email.length > 8) {
        const verifyCode = Math.floor(10000 + Math.random() * 900000);
        await sendEmail({ email, username, verifyCode });
        const dbUser = await userModel.findOne({ _id: data.id });
        const updatedUser = {
          ...dbUser,

          username,
          email,
          bio,
          verifyCode,
          verifyCodeExpiry: Date.now() + 1000 * 60 * 2,
          verifyCodeLimit: 0,
        };
        dbUser.verifyCodeLimit = 1;
        dbUser.verifyCode = verifyCode;
        dbUser.verifyCodeExpiry = Date.now() + 1000 * 60 * 2;
        await dbUser.save();
        await cookies().set("email", updatedUser.email);
        await cookies().set("updatedUser", JSON.stringify(updatedUser));

        return NextResponse.json({
          isEmailSent: true,
          dbUser: updatedUser,
          success: true,
          message: "Verification code sent successfully",
        });
      }
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: data.id },
        { username, email, bio },
        { new: true }
      );
      return NextResponse.json({
        dbUser: updatedUser,
        success: true,
        message: "Updated user successfully",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Error updating profile",
      success: false,
    });
  }
}
