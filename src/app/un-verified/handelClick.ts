"use server";

import { cookies } from "next/headers";

export const handelSettingCookies = async (data: any) => {
  try {
    await cookies().set("email", data?.data?.email as any);
    return true;
  } catch (error) {
    return false;
  }
};
