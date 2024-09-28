import { getAuthorizedUser } from "@/api-calls/backend-functions";
import connectMongo from "@/lib/dbConfig";
import { fileModel } from "@/models/file.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({
        success: false,
        message: "Invalid Transaction ID",
      });
    }

    await getAuthorizedUser(req);

    const file = await fileModel.findById(fileId);

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "Invalid Transaction",
      });
    }

    return NextResponse.json({
      success: true,
      message: "File successfully fetched",
      file,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error processing file",
    });
  }
}
