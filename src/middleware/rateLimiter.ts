// lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<
  string,
  { count: number; lastRequest: number; isBlocked: boolean }
>();

const WINDOW_SIZE_IN_SECONDS = 5; // 5 seconds window
const MAX_REQUESTS_PER_WINDOW = 20; // Allow 20 requests per 5 seconds
const BLOCKED_TIME_IN_SECONDS = 15; // Block IP for 15 seconds after exceeding rate limit

// Function to clean up old entries (optional, for memory efficiency)
const cleanUpOldEntries = () => {
  const now = Date.now();
  for (const [ip, info] of rateLimit as any) {
    if (
      info.isBlocked &&
      now - info.lastRequest * 1000 > BLOCKED_TIME_IN_SECONDS * 1000
    ) {
      rateLimit.delete(ip); // Cleanup old blocked IPs
    }
  }
};

// The middleware function for rate-limiting
export async function rateLimiterMiddleware(req: NextRequest) {
  const clientIp = req.ip || req.headers.get("x-forwarded-for") || "";
  if (!clientIp) return NextResponse.next(); // Exit early if no IP is found

  const currentTime = Math.floor(Date.now() / 1000);
  const requestInfo = rateLimit.get(clientIp);

  // If the IP is new, initialize rate limiting data
  if (!requestInfo) {
    rateLimit.set(clientIp, {
      count: 1,
      lastRequest: currentTime,
      isBlocked: false,
    });
    return NextResponse.next();
  }

  // Check if the IP is currently blocked
  if (requestInfo.isBlocked) {
    console.log(`IP ${clientIp} is currently blocked`);
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  // Time difference in seconds from the last request
  const timeDifferenceInSeconds = currentTime - requestInfo.lastRequest;

  // If within the time window, increment request count
  if (timeDifferenceInSeconds < WINDOW_SIZE_IN_SECONDS) {
    requestInfo.count += 1;
  } else {
    // If outside the window, reset the count and last request time
    requestInfo.count = 1;
    requestInfo.lastRequest = currentTime;
  }

  // Check if the request count exceeds the allowed limit
  if (requestInfo.count > MAX_REQUESTS_PER_WINDOW) {
    requestInfo.isBlocked = true;
    requestInfo.lastRequest = currentTime;
    console.log(
      `Rate limit exceeded for IP ${clientIp}: ${requestInfo.count} requests`
    );

    // Unblock the IP after the blocked time
    setTimeout(() => {
      const current = rateLimit.get(clientIp);
      if (current) {
        current.isBlocked = false;
        current.count = 0; // Reset count after unblocking
        console.log(
          `IP ${clientIp} unblocked after ${BLOCKED_TIME_IN_SECONDS} seconds`
        );
      }
    }, BLOCKED_TIME_IN_SECONDS * 1000);

    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  // Only update the map if necessary
  rateLimit.set(clientIp, requestInfo);

  // Optional: Clean up old entries periodically
  if (Math.random() < 0.01) {
    // Run clean-up 1% of the time
    cleanUpOldEntries();
  }

  return NextResponse.next();
}
