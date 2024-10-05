"use client";

import { useState } from "react";
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
import { resetPasswordSchema } from "@/zod-schemas/other.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonLoder from "@/components/ButtonLoder";
import { resetPasswordFields } from "@/utils/fields/resetPasswordFileds";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      OTP: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    try {
      if (values.newPassword !== values.confirmPassword) {
        return toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
          duration: 5000,
        });
      }

      const email = Cookies.get("email");
      if (!email) {
        router.replace("/sign-in");
        return toast({
          title: "Error",
          description: "Didn't get an email",
          variant: "destructive",
          duration: 5000,
        });
      }

      const { data } = await axios.post("/api/auth/reset-password", {
        email: email,
        verifyCode: values.OTP,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      });

      if (data.success === false) {
        return toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
          duration: 5000,
        });
      }

      router.replace("/sign-in");
      return toast({
        title: "Success",
        description: "Password reset successful",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Invalid Credentials",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

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
                  {form.formState.errors[
                    name as keyof typeof form.formState.errors
                  ] && (
                    <FormDescription className="text-xs text-red-500">
                      {
                        form.formState.errors[
                          name as keyof typeof form.formState.errors
                        ]?.message
                      }
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          ))}
          <ButtonLoder isLoading={isLoading} name={"Verify"} />
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
