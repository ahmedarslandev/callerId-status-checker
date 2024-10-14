// lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

// Data structure to store rate limit information
const rateLimit = new Map<
  string,
  {
    secondCount: number;
    minuteCount: number;
    hourCount: number;
    lastRequest: number;
    isBlocked: boolean;
  }
>();

// Time window settings
const SECOND_WINDOW = 5; // 5 seconds window
const MINUTE_WINDOW = 60; // 1 minute window
const HOUR_WINDOW = 3600; // 1 hour window

// Request limits for each time window
const MAX_REQUESTS_PER_SECOND_WINDOW = 50; // 20 requests per 5 seconds
const MAX_REQUESTS_PER_MINUTE = 300; // 100 requests per minute
const MAX_REQUESTS_PER_HOUR = 3000; // 1000 requests per hour

// Blocking duration after exceeding limits
const BLOCKED_TIME_IN_SECONDS = 15; // Block IP for 15 seconds after exceeding rate limit

// Function to clean up old entries (optional, for memory efficiency)
const cleanUpOldEntries = () => {
  const now = Date.now();
  for (const [ip, info] of rateLimit as any) {
    // Check if an IP is blocked and if the block has expired
    if (
      info.isBlocked &&
      now - info.lastRequest * 1000 > BLOCKED_TIME_IN_SECONDS * 1000
    ) {
      rateLimit.delete(ip); // Clean up old blocked IPs
      console.log(`IP ${ip} cleaned up due to expired block.`);
    }
  }
};

// The middleware function for rate-limiting
export async function rateLimiterMiddleware(req: NextRequest) {
  const clientIp = req.ip || req.headers.get("x-forwarded-for") || "";
  if (clientIp === "127.0.0.1" || clientIp === "::1") {
    console.log(`Bypassing rate limit for localhost (IP: ${clientIp})`);
    return NextResponse.next(); // Allow localhost requests to pass
  }
  
  if (!clientIp) return NextResponse.json({ error: "Unknown ip" }); // Exit early if no IP is found

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  let requestInfo = rateLimit.get(clientIp);

  // Initialize rate limit data if the IP is new
  if (!requestInfo) {
    requestInfo = {
      secondCount: 1,
      minuteCount: 1,
      hourCount: 1,
      lastRequest: currentTime,
      isBlocked: false,
    };
    rateLimit.set(clientIp, requestInfo);
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

  // Time difference from the last request
  const timeDifferenceInSeconds = currentTime - requestInfo.lastRequest;

  // If the IP has made a request within the second-level window
  if (timeDifferenceInSeconds < SECOND_WINDOW) {
    requestInfo.secondCount += 1;
  } else {
    // Reset second-level count and update lastRequest time if outside the window
    requestInfo.secondCount = 1;
    requestInfo.lastRequest = currentTime;
  }

  // Update minute and hour-level counts (without resetting them)
  if (timeDifferenceInSeconds < MINUTE_WINDOW) {
    requestInfo.minuteCount += 1;
  } else {
    requestInfo.minuteCount = 1;
  }

  if (timeDifferenceInSeconds < HOUR_WINDOW) {
    requestInfo.hourCount += 1;
  } else {
    requestInfo.hourCount = 1;
  }

  // Check if the request count exceeds any of the limits
  if (
    requestInfo.secondCount > MAX_REQUESTS_PER_SECOND_WINDOW ||
    requestInfo.minuteCount > MAX_REQUESTS_PER_MINUTE ||
    requestInfo.hourCount > MAX_REQUESTS_PER_HOUR
  ) {
    requestInfo.isBlocked = true;
    requestInfo.lastRequest = currentTime;
    console.log(
      `Rate limit exceeded for IP ${clientIp}: ${requestInfo.secondCount} requests in ${SECOND_WINDOW} seconds, ${requestInfo.minuteCount} requests in 1 minute, ${requestInfo.hourCount} requests in 1 hour`
    );

    // Block the IP for the BLOCKED_TIME_IN_SECONDS period
    setTimeout(() => {
      const current = rateLimit.get(clientIp);
      if (current) {
        current.isBlocked = false;
        current.secondCount = 0;
        current.minuteCount = 0;
        current.hourCount = 0;
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

  // Only update the map when necessary
  rateLimit.set(clientIp, requestInfo);

  // Optional: Clean up old entries periodically
  if (Math.random() < 0.01) {
    // Run clean-up 1% of the time
    cleanUpOldEntries();
  }

  return NextResponse.next();
}
