import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { securityModel } from "@/models/security.model";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();
  try {
    const { verifyCode } = await req.json();
    const email = await cookies().get("email")?.value;
    const updatedUserString = (await cookies().get("updatedUser")?.value) as
      | string
      | null
      | undefined;
    const updatedSecurityString = (await cookies().get("updatedSecurity")
      ?.value) as string | null | undefined;

    let user = await userModel.findOne({ email });
    if (updatedSecurityString && updatedUserString) {
      const updatedSecurity = JSON.parse(updatedSecurityString);
      const updatedUser = JSON.parse(updatedUserString);

      const security = await securityModel.findOne({
        _id: updatedSecurity._id,
      });
      const user = await userModel.findOne({ _id: updatedUser._id });

      security.recovery_email = updatedSecurity.recovery_email;
      security.two_factor_enabled = updatedSecurity.two_factor_enabled;

      if (
        user.verifyCodeExpiry < Date.now() &&
        Date.now() > user.verifyCodeExpiry
      ) {
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

      user.verifyCode = "";
      user.verifyCodeExpiry = "";
      user.verifyCodeLimit = 0;
      user.isVerified = true;
      console.log("Verified")
      await cookies().delete("updatedSecurity");
      await cookies().delete("email");
      await security.save();
      await user.save();
      return NextResponse.json({
        success: true,
        message: "Recovery email saved successfully",
        user,
      });
    }
    if (updatedUserString) {
      const updateduser = JSON.parse(updatedUserString);
      user = await userModel.findOne({ _id: updateduser._id });
      user.email = updateduser.email;

      await cookies().delete("email");
      await cookies().delete("updatedUser");
    }
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Verification code is incorrect or expired",
      });
    }

    if (
      user.verifyCodeExpiry < Date.now() &&
      Date.now() > user.verifyCodeExpiry
    ) {
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

    user.verifyCode = "";
    user.verifyCodeExpiry = "";
    user.verifyCodeLimit = 0;
    user.isVerified = true;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Your account has been verified successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Failed to verify your code. Internal Server error",
      error: error,
    });
  }
}
