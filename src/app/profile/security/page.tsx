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
  const { data } = useSession();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/u/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        isLoggedInWithCredentials: data?.data.isLoggedInWithCredentials,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          duration: 5000,
        });
        router.replace("/profile");
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
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
          {data?.data.isLoggedInWithCredentials && (
            <div className="mb-4">
              <Input
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                value={form.currentPassword}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div className="mb-4">
            <Input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <Button
            variant="default"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
