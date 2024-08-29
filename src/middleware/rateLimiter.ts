// lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; lastRequest: number }>();

const WINDOW_SIZE_IN_MINUTES = 15;
const MAX_REQUESTS_PER_WINDOW = 100;

export async function rateLimiterMiddleware(req: NextRequest) {
  const clientIp = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  const currentTime = Date.now();

  if (!rateLimit.has(clientIp)) {
    rateLimit.set(clientIp, { count: 1, lastRequest: currentTime });
  } else {
    const requestInfo = rateLimit.get(clientIp)!;
    const timeDifference = (currentTime - requestInfo.lastRequest) / 1000 / 60;

    if (timeDifference < WINDOW_SIZE_IN_MINUTES) {
      requestInfo.count += 1;
    } else {
      requestInfo.count = 1;
      requestInfo.lastRequest = currentTime;
    }

    if (requestInfo.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    rateLimit.set(clientIp, requestInfo);
  }

  return NextResponse.next();
}
