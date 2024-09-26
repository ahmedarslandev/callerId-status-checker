"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { User } from "@/models/user.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setUser as setStoreUser } from "@/store/reducers/auth.reducer";
import { AppDispatch } from "@/store/auth.store";
import { RefreshCcw } from "lucide-react";
import { fetchUserData } from "@/api-calls/api-calls";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data } = useSession();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { user: authUser } = useSelector((state: any) => state.user) as any;

  useEffect(() => {
    // Redirect if no user is logged in
    if (!authUser || Object.keys(authUser).length === 0) {
      router.replace("/");
    } else {
      setUser(authUser);
      setLoading(false);
    }
  }, [authUser, router]);

  const refreshFiles = async () => {
    setIsRefreshing(true);
    try {
      const userData = await fetchUserData();
      setUser(userData);
      dispatch(setStoreUser({ user: userData }));
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setLoading(false);
    } else {
      setLoading(true);
      fetchUserData().then((data) => {
        if (!data) {
          return router.replace("/sign-in");
        }
        setUser(data);
        dispatch(setStoreUser({ user: data }));
        setLoading(false);
      });
    }
  }, []);

  // Early return for loading state
  if (loading) {
    return <div className="p-4 md:p-6">Loading...</div>;
  }

  // Early return for null user data
  if (!user) {
    return <div className="p-4 md:p-6">No user data available.</div>;
  }

  const handleButton = (path: string) => {
    router.replace(path);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="max-w-lg md:w-full md:max-w-full mx-auto">
        <CardHeader className="w-full flex-row flex justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Profile</h2>
          <Button
            disabled={isRefreshing}
            onClick={refreshFiles}
            variant="outline"
          >
            <RefreshCcw
              className={`rotate-180 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <img
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
