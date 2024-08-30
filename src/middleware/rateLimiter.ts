// lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; lastRequest: number }>();

const WINDOW_SIZE_IN_SECONDS = 100; // 1 second
const MAX_REQUESTS_PER_WINDOW = 500; // Allow 3 requests per second

export async function rateLimiterMiddleware(req: NextRequest) {
  const clientIp = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  const currentTime = Date.now();
  const currentTimeInSeconds = Math.floor(currentTime / 1000);

  if (!rateLimit.has(clientIp)) {
    rateLimit.set(clientIp, { count: 1, lastRequest: currentTimeInSeconds });
  } else {
    const requestInfo = rateLimit.get(clientIp)!;
    const timeDifferenceInSeconds =
      currentTimeInSeconds - requestInfo.lastRequest;

    if (timeDifferenceInSeconds < WINDOW_SIZE_IN_SECONDS) {
      requestInfo.count += 1;
    } else {
      requestInfo.count = 1;
      requestInfo.lastRequest = currentTimeInSeconds;
    }

    if (requestInfo.count > MAX_REQUESTS_PER_WINDOW) {
      console.log(
        `Rate limit exceeded for IP ${clientIp}: ${requestInfo.count} requests`
      );
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    rateLimit.set(clientIp, requestInfo);
  }

  return NextResponse.next();
}
