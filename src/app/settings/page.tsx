"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  if (!user) {
    router.replace("/");
  }

  return <div>Settings Page</div>;
};

export default Page;
