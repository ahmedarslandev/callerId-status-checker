"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "@/components/ui";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasNonalphas
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const email = Cookies.get("email");
    if (!email) {
      return setError("Didn't get an email");
    }

    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validatePassword(password)) {
      setError("Password does not meet the requirements.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("api/auth/reset-password", {
        email,
        verifyCode: otp,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      if (data.success == false) {
        setError(data.message);
        return toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
          duration: 5000,
        });
      }
      Cookies.remove("email");
      setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    setTimeout(() => {
      router.replace("/sign-in");
    }, 2000);
    return (
      <div className="flex p-14 max-md:p-5 justify-center h-fit min-h-screen items-center">
        <Card className="border-[1px] w-[60%] max-md:w-full border-zinc-400 rounded p-6 flex flex-col justify-center gap-4">
          <CardHeader>
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                You can now log in with your new password.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex p-14 max-md:p-5 justify-center h-fit min-h-screen items-center">
      <Card className="border-[1px] w-[60%] max-md:w-full border-zinc-400 rounded p-6 flex flex-col justify-center gap-4">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="otp">One Time Password (OTP)</Label>
                <div className="relative">
                  <Input
                    id="opt"
                    type={"number"}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Alert className="mt-4">
              <AlertDescription>
                Password must be at least 8 characters long and include
                uppercase, lowercase, number, and special character.
              </AlertDescription>
            </Alert>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
