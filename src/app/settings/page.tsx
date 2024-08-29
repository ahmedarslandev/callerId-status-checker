"use client";

import { isAuthenticated } from "@/lib/auth/isAuthenticated";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const { status } = useSession();
  const isUser = isAuthenticated(status);

  if (isUser) {
    router.replace("/");
  }
  return <div>Settings Page</div>;
};

export default Page;
