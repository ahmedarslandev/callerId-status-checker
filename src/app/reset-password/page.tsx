"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  toast,
} from "@/components/ui";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/zod-schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoder from "@/components/ButtonLoder";
import { resetPasswordFields } from "@/utils/fields/resetPasswordFileds";
import { z } from "zod";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form setup using useForm with zod validation schema
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: useMemo(
      () => ({
        OTP: "",
        newPassword: "",
        confirmPassword: "",
      }),
      []
    ),
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof resetPasswordSchema>) => {
      setIsLoading(true);

      if (values.newPassword !== values.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      const email = Cookies.get("email");
      if (!email) {
        router.replace("/sign-in");
        toast({
          title: "Error",
          description: "Email not found, redirecting...",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      try {
        const { data } = await axios.post("/api/auth/reset-password", {
          email,
          verifyCode: values.OTP,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmPassword,
        });

        if (!data.success) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
            duration: 5000,
          });
          return;
        }

        toast({
          title: "Success",
          description: "Password reset successful",
          duration: 5000,
        });
        router.replace("/sign-in");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Invalid Credentials",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="flex p-14 max-md:p-5 justify-center h-fit min-h-screen items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-[60%] max-md:w-full border-zinc-400 rounded p-6 flex flex-col justify-center gap-4"
        >
          {resetPasswordFields.map(({ name, label, placeholder, type }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      type={type || "text"}
                      className="max-md:text-xs"
                      placeholder={placeholder}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors[name] && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors[name]?.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          ))}
          <ButtonLoder isLoading={isLoading} name="Verify" />
          <Button
            variant="link"
            className="w-full"
            onClick={() => router.back()}
          >
            Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
