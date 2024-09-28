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
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui";
import ButtonLoder from "@/components/ButtonLoder";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Here you would typically call your API to handle the password reset request
    try {
      const { data } = await axios.post("/api/auth/forget-password", { email });

      if (data.success == false) {
        setError(data.message);
        return toast({
          title: "Error",
          description: data.message,
          duration: 5000,
          variant: "destructive",
        });
      }
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    setTimeout(() => {
      router.push("/reset-password");
    }, 2000);
    return (
      <div className="flex p-14 max-md:p-5 justify-center h-fit min-h-screen items-center">
        <Card className="border-[1px] w-[60%] max-md:w-full border-zinc-400 rounded p-6 flex flex-col justify-center gap-4">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                If you don't see the email, check your spam folder.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
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
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <ButtonLoder className="w-full mt-4" type="submit" disabled={isLoading} name={"Send verification code"}/>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => router.push("/sign-in")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
