import { getAuthorizedUser } from "@/api-calls/backend-functions";
import connectMongo from "@/lib/dbConfig";
import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { user: userToBlock } = await req.json();

    if (!userToBlock) {
      return NextResponse.json({
        success: false,
        message: "User is required",
      });
    }

    const { user }: any = await getAuthorizedUser(req);

    if (!user || user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await userModel.findByIdAndUpdate(
      userToBlock._id,
      {
        isBlocked: !userToBlock.isBlocked,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Users blocked successfully",
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
