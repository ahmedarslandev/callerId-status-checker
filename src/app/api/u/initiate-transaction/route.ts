import { auth } from "@/auth";
import connectMongo from "@/lib/dbConfig";
import { uploadToS3 } from "@/lib/upload.to.s3";
import { userModel } from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const { data, user }: any = await auth();
    if (!data || !user) {
      return NextResponse.json({ message: "Unauthorized", success: false });
    }

    const dbUser = await userModel
      .findById(data.id)
      .populate("walletId")
      .exec();
    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json({ message: "Invalid User", success: false });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    console.log(file);

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" });
    }

    const uploadResult = await uploadToS3(file, dbUser.walletId._id);

    if (uploadResult.success == false) {
      return NextResponse.json({
        success: false,
        message: uploadResult.message,
      });
    }
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Error retrieving files",
    });
  }
}
