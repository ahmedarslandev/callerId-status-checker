import axios from "axios";

// Configure axios instance for optimization
const axiosInstance = axios.create({
  timeout: 5000, // Set a reasonable timeout
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  },
  maxRedirects: 5, // Limit redirects
  maxContentLength: 300 * 1024, // Limit the size of the response (300KB)
});

// Retry mechanism
const MAX_RETRIES = 5;

async function fetchWithRetry(url: string, retries: number = 0): Promise<string> {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error: any) {
    if (retries < MAX_RETRIES && (error.response?.status === 429 || error.code === 'ECONNABORTED')) {
      const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
      await new Promise((res) => setTimeout(res, waitTime));
      return fetchWithRetry(url, retries + 1);
    } else {
      throw error;
    }
  }
}

export async function getTitle(url: string): Promise<{ callerId: string; status: string }> {
  try {
    const data = await fetchWithRetry(url);
    const titleMatch = data.match(/<title>(.*?)<\/title>/);

    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].trim();
      const callerIdMatch = title.match(/\d{10,}/); // Extract the caller ID (assuming it's at least 10 digits)

      const callerId = callerIdMatch ? callerIdMatch[0] : "Unknown";

      let status = "not categorized";
      if (title.includes("Unknown Caller")) {
        status = "unknown";
      } else if (
        title.includes("Phone Scam Alert!") ||
        title.includes("robo")
      ) {
        status = "spam";
      }

      console.log(callerId, status);
      return { callerId, status };
    } else {
      return { callerId: "Unknown", status: "no title found" };
    }
  } catch (error:any) {
    console.error('Error fetching title:', error.message);
    return { callerId: "Unknown", status: "error" };
  }
}
