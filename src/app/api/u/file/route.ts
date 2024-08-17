import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { Buffer } from "buffer";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { fileModel } from "@/models/file.model";
import { join } from "path";
import connectMongo from "@/lib/dbConfig";
import { processFile } from "@/lib/fileProcessing";
import fileProcessing from "@/lib/intervalSetup";

export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const { data, user }: any = await auth();
    if (!data || !user) {
      return NextResponse.json({ message: "Unauthorized", success: false });
    }

    const dbUser = await userModel
      .findOne({ _id: data.id })
      .populate("walletId");
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

    const userDirectory = join(`./public/uploads`, dbUser._id.toString());
    await mkdir(userDirectory, { recursive: true });

    const filePath = join(userDirectory, `${filename}.${extension}`);
    await writeFile(filePath, buffer);

    const dbFile = new fileModel({
      owner: dbUser._id,
      filename: filename,
      filePath: `./public/uploads/${dbUser._id}/${filename}.${extension}`,
      size: file.size,
      noOfCallerIds: callerIds,
      type: file.type,
      lastModified: file.lastModified,
      extensionName: extension,
    });

    dbUser.files.push(dbFile._id);

    await Promise.all([
      dbFile.save(),
      dbUser.walletId.save(),
      dbUser.save(),
    ]).then(() => {
      fileProcessing.startProcessingInterval(
        dbFile._id,
        filePath,
        userDirectory,
        filename
      );
      processFile(dbFile._id, filePath, userDirectory, filename);
    });

    // Set interval to check for pending files every 20 seconds

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
