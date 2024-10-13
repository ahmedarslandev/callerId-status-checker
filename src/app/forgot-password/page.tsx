"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import ButtonLoader from "@/components/ButtonLoder";
import { forgotPasswordSchema } from "@/zod-schemas/schemas";

// Forgot Password Form
export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { isLoading } = form.formState;

  const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const { data } = await axios.post("/api/auth/forget-password", { email: values.email });

      if (data.success === false) {
        toast({
          title: "Error",
          description: data.message,
          duration: 5000,
          variant: "destructive",
        });
        return;
      }

      setSuccess(true);
      toast({
        title: "Success",
        description: "Password reset OTP sent to your email.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        duration: 5000,
        variant: "destructive",
      });
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
              We&apos;ve sent a password reset link to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                If you don&apos;t see the email, check your spam folder.
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
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <ButtonLoader isLoading={isLoading} className="w-full mt-4" name="Send verification code" />
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
