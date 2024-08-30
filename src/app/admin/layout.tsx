"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/SideBar";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (status === "loading") {
      // Session is still loading
      return;
    }

    if (status !== "authenticated" || !data) {
      // Not authenticated or no data
      router.replace("/sign-in");
      return;
    }

    const userData = data?.data; // Assuming `data.data` contains the user information
    if (userData?.role !== "admin") {
      // User is an admin
      router.replace("/");
      return;
    }

    // Authentication and role check passed
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [status, data, router]);

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can display a loading spinner or message here
  }

  return (
    <div className="flex w-full h-screen">
      <div className="h-full w-1/5">
        <Sidebar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
