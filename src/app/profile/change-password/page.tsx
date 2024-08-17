"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

export default function ChangePasswordPage() {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChangePassword = async () => {
    setIsLoading(true);
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      let values = {
        currentPassword,
        newPassword,
        isLoggedInWithCredentials:data?.data.isLoggedInWithCredentials,
      };

      const response = await axios.post("/api/u/change-password", values);
      console.log(response.data);
      if (response.data.success == true) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          duration: 5000,
        })
        router.replace("/profile");
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (err:any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">Change Password</h2>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {data?.data.isLoggedInWithCredentials ? (
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          ) : null}
          <div className="mb-4">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button variant="default" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
