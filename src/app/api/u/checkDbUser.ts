import { auth } from "@/auth";
import { userModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function IsUser() {
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
  const dbUser = await userModel.findById(data?.data?.id).populate("walletId");

  // Check if user exists and is verified
  if (!dbUser || !dbUser.isVerified) {
    return NextResponse.json(
      { message: "Invalid User", success: false },
      { status: 403 }
    );
  }

  return dbUser;
}
