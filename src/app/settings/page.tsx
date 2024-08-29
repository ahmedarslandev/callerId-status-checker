"use client";

import { isAuthenticated } from "@/lib/auth/isAuthenticated";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const isUser = isAuthenticated();

  if (isUser) {
    router.replace("/");
  }
  return <div>Settings Page</div>;
};

export default Page;
