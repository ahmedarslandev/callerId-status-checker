import pLimit from "p-limit";
import { getTitle } from "./checkStatus";

const limit = pLimit(3); // Limit to 5 concurrent requests
const MAX_RETRIES = 10; // Maximum number of retries for rate limiting

async function fetchWithRetry(
  url: string,
  retries: number = MAX_RETRIES
): Promise<any> {
  try {
    return await getTitle(url);
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      // If rate limited, wait and retry
      console.log(`Rate limited. Retrying... ${retries} attempts left`);
      return fetchWithRetry(url, retries - 1);
    } else {
      throw error; // Rethrow if not rate limited or retries exhausted
    }
  }
}

export async function handleDidsRes(
  callerIds: string[]
): Promise<{ callerId: string; status: string }[]> {
  const titlePromises = callerIds.map((callerId) =>
    limit(async () => {
      const url = `${process.env.CHECK_STATUS_CALLERID_URL}/1${callerId}`;
      try {
        const { callerId: extractedId, status } = await fetchWithRetry(url);
        return { callerId, status: status || "Unknown" }; // Ensure status is always defined
      } catch (error) {
        console.error(`Error fetching title for callerId ${callerId}:`, error);
        return { callerId, status: "Error" };
      }
    })
  );

  return Promise.all(titlePromises);
}
