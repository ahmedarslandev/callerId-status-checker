"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/models/user.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const { data } = useSession();

  const router = useRouter();
  const isUser = isAuthenticated();
  if (!isUser) {
    router.replace("/sign-in");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/u/me"); // Changed to GET request
        setUser(response.data.dbUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-4 md:p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 md:p-6">No user data available.</div>;
  }

  const handleButton = (path: string) => {
    router.replace(path);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="max-w-lg md:w-full md:max-w-full mx-auto">
        <CardHeader>
          <h2 className="text-xl md:text-2xl font-bold">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <Image
              data-src={user.profileImage || "/default-profile.png"}
              src={user.profileImage || "/default-profile.png"}
              alt={`${user.username}'s profile image`}
              width={100}
              height={100}
              className="rounded-full w-24 h-24 lazyload"
            />
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold">
                {user.username}
              </h3>
              <p className="text-sm md:text-base">{user.email}</p>
              <Badge
                className={`mt-2 ${
                  user.isVerified ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {user.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-md md:text-lg font-medium">Bio</h4>
            <p className="text-zinc-400 text-sm md:text-base">
              {user.bio || "No bio available"}
            </p>
          </div>
          <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Button
              variant="default"
              onClick={() => handleButton("/profile/edit")}
              className="w-full md:w-auto"
            >
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleButton("/profile/change-password")}
              className="w-full md:w-auto"
            >
              Change Password
            </Button>
            {data?.data.isLoggedInWithCredentials && (
              <Button
                variant="secondary"
                onClick={() => handleButton("/profile/security")}
                className="w-full md:w-auto"
              >
                Security
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
