"use server";
import { signIn, signOut } from "@/auth";
import axios, { Method } from "axios";

// Define types for values and the result
interface ApiHandlerResult {
  success: boolean;
  data?: any;
  message?: string;
}

export const SignIn = async (name: any, values = {} as any) => {
  const res = await signIn(name, values);
  return res;
};

export const SignOut = async () => {
  await signOut().then(() => {
    return {
      success: true,
      message: "Sign out successfully",
    };
  });
};

export const SignUp = async (values = {} as any) => {
  try {
    const { data } = await axios.post("/api/auth/sign-up", values);
    return data;
  } catch (error: any) {
    return { success: false, message: "Signup failed" };
  }
};

export const ApiHandler = async (
  values: Record<string, any> = {},
  method: Method = "GET",
  url: string
): Promise<ApiHandlerResult> => {
  try {
    // Validate method
    const validMethods: Method[] = ["get", "post", "put", "delete", "patch"];
    if (!validMethods.includes(method.toLowerCase() as Method)) {
      throw new Error("Invalid HTTP method");
    }

    // Perform the API request
    const { data } = await axios({
      method,
      url,
      data: method.toLowerCase() !== "get" ? values : undefined,
      params: method.toLowerCase() === "get" ? values : undefined,
    });

    return { success: true, data };
  } catch (error: any) {
    // Enhanced error handling
    console.error("API request error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
};
