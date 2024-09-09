"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;
  
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return <div>Settings Page</div>;
};

export default Page;
