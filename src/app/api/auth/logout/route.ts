import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    await cookies().delete("token");
    return NextResponse.json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}
