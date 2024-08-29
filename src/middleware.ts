// middleware.ts
import { rateLimiterMiddleware } from "@/middleware/rateLimiter";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const response = await rateLimiterMiddleware(req);
  return response;
}

// Optionally, you can configure which routes this middleware applies to:
export const config = {
  matcher: "/:path*", // Apply to all API routes
};
