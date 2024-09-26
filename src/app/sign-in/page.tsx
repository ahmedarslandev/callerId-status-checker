"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SignInSchema } from "@/zod-schemas/signin-schema";
import Link from "next/link";
import HLine from "@/components/HLine";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { SignIn as login } from "@/lib/api.handler";
import ButtonLoder from "@/components/ButtonLoder";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { useSelector } from "react-redux";

export default function SignIn() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      router.replace("/");
    }
  }, [user]);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    setIsLoading(true);
    try {
      await login("credentials", values);
      setTimeout(() => window.location.reload(), 1500);
      return toast({
        title: "Success",
        description: "Successfully signed in",
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-xs"
                    placeholder="example@gmail.com"
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <FormDescription className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-xs"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.password && (
                  <FormDescription className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormDescription className="max-md:text-xs">
            Forgot your password?{" "}
            <Link
              className="text-blue-600 max-md:text-xs hover:text-blue-700"
              href="/forgot-password"
            >
              Forgot Password
            </Link>
          </FormDescription>
          <ButtonLoder isLoading={isLoading} name={"Sign In"} />
          <FormDescription className="max-md:text-xs">
            Dont have an account?{" "}
            <Link
              className="text-blue-600 max-md:text-xs hover:text-blue-700"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
