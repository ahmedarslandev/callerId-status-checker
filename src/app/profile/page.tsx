"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/models/user.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/u/me"); // Changed to GET request
        console.log(response.data);
        setUser(response.data.dbUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleButton = (path: string) => {
    router.replace(path);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img
              src={user.profileImage || "/default-profile.png"}
              alt={`${user.username}'s profile image`}
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{user.username}</h3>
              <p>{user.email}</p>
              {user.isVerified ? (
                <Badge className="mt-2 bg-green-600">Verified</Badge>
              ) : (
                <Badge className="mt-2 bg-red-500">Unverified</Badge>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-medium">Bio</h4>
            <p className="text-zinc-400 text-sm">
              {user.bio || "No bio available"}
            </p>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              variant="default"
              onClick={() => handleButton("/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleButton("/profile/change-password")}
            >
              Change Password
            </Button>
            {data?.data.isLoggedInWithCredentials == false && (
              <Button
                variant="secondary"
                onClick={() => handleButton("/profile/security")}
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
