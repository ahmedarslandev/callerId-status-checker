import connectMongo from "@/lib/dbConfig";
import { uploadToS3 } from "@/lib/upload.to.s3";
import { NextResponse, NextRequest } from "next/server";
import { userModel } from "@/models/user.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
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
