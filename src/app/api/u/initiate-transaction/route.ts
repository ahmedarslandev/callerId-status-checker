import connectMongo from "@/lib/dbConfig";
import { uploadToS3 } from "@/lib/upload.to.s3";
import { NextResponse, NextRequest } from "next/server";
import { IsUser } from "../checkDbUser";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const dbUser = await IsUser();
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
