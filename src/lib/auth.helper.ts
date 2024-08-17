"use server";
import { signIn, signOut } from "@/auth";

export const SignIn = async (name: any, values = {} as any) => {
  const res = await signIn(name, values);
  return res;
};

export const SignOut = async () => {
   await signOut().then(() => {
    return {
      success: true,
      message: "Sign out successful",
    }
   })
};
