import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { securityModel } from "@/models/security.model";

export async function POST(req: NextRequest) {
  await connectMongo();
  
  try {
    const { verifyCode } = await req.json();
    const email = cookies().get("email")?.value;
    const updatedUserString = cookies().get("updatedUser")?.value;
    const updatedSecurityString = cookies().get("updatedSecurity")?.value;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "No email found in cookies",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verifyCodeExpiry < Date.now()) {
      return NextResponse.json({
        success: false,
        message: "Verification code is expired",
      });
    }

    if (user.verifyCode !== verifyCode) {
      return NextResponse.json({
        success: false,
        message: "Verification code is incorrect",
      });
    }

    if (updatedSecurityString && updatedUserString) {
      const updatedSecurity = JSON.parse(updatedSecurityString);
      const updatedUser = JSON.parse(updatedUserString);

      const security = await securityModel.findOne({ _id: updatedSecurity._id });

      if (!security) {
        return NextResponse.json({
          success: false,
          message: "Security record not found",
        });
      }

      security.recovery_email = updatedSecurity.recovery_email;
      security.two_factor_enabled = updatedSecurity.two_factor_enabled;

      user.email = updatedUser.email;

      await security.save();
      await cookies().delete("updatedSecurity");
    } else if (updatedUserString) {
      const updatedUser = JSON.parse(updatedUserString);
      user.email = updatedUser.email;
    }

    user.verifyCode = "";
    user.verifyCodeExpiry = "";
    user.verifyCodeLimit = 0;
    user.isVerified = true;

    await user.save();

    await cookies().delete("email");
    await cookies().delete("updatedUser");

    return NextResponse.json({
      success: true,
      message: "Account verified successfully",
      user,
    });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to verify your code. Internal Server error",
      error: error.message,
    });
  }
}
