import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define your secret here (should match the one in your [...nextauth].ts configuration)
const secret: any = process.env.NEXTAUTH_SECRET;
const salt: any = process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
  // Extract token from the request
  const token = await getToken({ req: request, secret: secret, salt: salt });

  // Check if token exists and if email matches the expected email
  if (!token || !token.email) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token.email !== process.env.TRANSACTION_EMAIL) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to /admin
  return NextResponse.next();
}

// Define the paths to match
export const config = {
  matcher: ["/:path*", "/"],
};
