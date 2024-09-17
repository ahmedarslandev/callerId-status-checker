"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handelSettingCookies } from "./handelClick";

export default function UserUnverified() {
  const { data } = useSession();
  const router = useRouter();

  const handelClick = async () => {
    try {
      const res = await handelSettingCookies(data);
      if (res) {
        router.replace("/code-verification");
      }
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Account Unverified
          </CardTitle>
          <CardDescription className="text-center">
            Your account needs to be verified before you can access all
            features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            We've sent a verification email to your registered email address.
            Please check your inbox and follow the instructions to verify your
            account.
          </p>
        </CardContent>
        <CardContent className="flex justify-center">
          <Button onClick={handelClick}>Verify Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
