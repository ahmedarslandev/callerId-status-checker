import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { Buffer } from "buffer";
import { join } from "path";
import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { fileModel } from "@/models/file.model";
import connectMongo from "@/lib/dbConfig";
import { walletModel } from "@/models/wallet.model";

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

    const dbUser = await userModel
      .findById(data?.data?.id)
      .populate({ path: "walletId", model: walletModel });

    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const callerIds = parseInt(formData.get("callerIds") as string);

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" });
    }

    const cost = callerIds * parseInt(process.env.AMOUNT_PER_CALLERID as string);

    if (dbUser.walletId.balance < cost) {
      return NextResponse.json({
        success: false,
        message: "Insufficient balance in wallet",
      });
    }

    dbUser.walletId.balance -= cost;

    const date = new Date().toDateString();

    // Get the file extension
    const extension = file.name.split(".").pop();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the user directory where files will be uploaded
    const userDirectory = join(
      process.cwd(),
      `../file-server-handler/uploads/${dbUser._id.toString()}`
    );

    try {
      await mkdir(userDirectory, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
    }

    const filename = `${date} ${Date.now()}.${extension}`;
    const filePath = join(userDirectory, filename);

    // Write the file to the determined path
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
      .populate("files")
      .exec();

    // Check if user exists and is verified
    if (!dbUser || !dbUser.isVerified) {
      return NextResponse.json(
        { message: "Invalid User", success: false },
        { status: 403 }
      );
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
