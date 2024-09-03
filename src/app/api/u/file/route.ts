import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { Buffer } from "buffer";
import { nanoid } from "nanoid";
import { join } from "path";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { fileModel } from "@/models/file.model";
import connectMongo from "@/lib/dbConfig";
import { processFile } from "@/lib/fileProcessing";
import { startProcessingInterval } from "@/lib/intervalSetup";

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
    const callerIds = parseInt(formData.get("callerIds") as string);

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" });
    }

    const cost = callerIds * 0.1;
    if (dbUser.walletId.balance < cost) {
      return NextResponse.json({
        success: false,
        message: "Insufficient balance in wallet",
      });
    }

    dbUser.walletId.balance -= cost;

    const filename = nanoid(20);
    const extension = file.name.split(".").pop();
    const buffer = Buffer.from(await file.arrayBuffer());

    const userDirectory = join(
      process.cwd(),
      "../file-server-handler/uploads",
      dbUser._id.toString()
    );
    await mkdir(userDirectory, { recursive: true });

    const filePath = join(userDirectory, `${filename}.${extension}`);
    await writeFile(filePath, buffer);

    const dbFile = new fileModel({
      owner: dbUser._id,
      filename,
      filePath,
      size: file.size,
      noOfCallerIds: callerIds,
      type: file.type,
      lastModified: file.lastModified,
      extentionName: extension?.toString(),
      realname: file.name,
    });

    dbUser.files.push(dbFile._id);
    await Promise.all([dbFile.save(), dbUser.walletId.save(), dbUser.save()]);

    startProcessingInterval();
    processFile(
      dbFile._id,
      filePath,
      userDirectory,
      filename,
      extension as any
    );

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file: dbFile,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file", success: false },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectMongo();
  try {
    const { data }: any = await auth();

    if (!data) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const dbUser = await userModel.findById(data.id).populate("files").exec();

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "Invalid User" });
    }

    return NextResponse.json({ success: true, files: dbUser.files });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error retrieving files",
      error: error.message,
    });
  }
}
