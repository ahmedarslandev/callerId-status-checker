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
import { useState } from "react";
import { SignIn as login } from "@/lib/api.handler";
import ButtonLoder from "@/components/ButtonLoder";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

export default function SignIn() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { status } = useSession();
  const isUser = isAuthenticated(status);

  if (isUser) {
    if (isUser) {
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }

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
      setTimeout(() => window.location.reload(), 2000);
      return toast({
        title: "Success",
        description: "Successfully signed in",
        duration: 5000,
      });
    } catch (error: any) {
      return toast({
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
          <div className="flex flex-col gap-3 justify-center items-center">
            <p className="max-md:text-xs">or sign in with </p>
            <HLine />
            <div className="flex flex-col max-md:gap-2 md:flex-row w-full justify-around items-center">
              {["Google", "Facebook", "Twitter", "Github"].map((e, i) => (
                <div
                  onClick={async () => {
                    await login(e.toLocaleLowerCase(), {
                      callbackUrl: `/api/v1/auth/callback/${e.toLocaleLowerCase()}`,
                    });
                  }}
                  key={i}
                  className="flex flex-row max-md:w-full max-md:border-zinc-300 max-md:border-[1px] max-md:justify-start max-md:rounded max-md:p-2 md:flex-col cursor-pointer select-none justify-center gap-2 items-center"
                >
                  <Image
                    data-src={`/${e.toLowerCase()}.svg`}
                    className={`w-5 h-5 lazyload ${
                      theme === "dark" && e === "Github" ? "invert" : ""
                    }`}
                    src={`/${e.toLowerCase()}.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <p className="text-xs">{e}</p>
                </div>
              ))}
            </div>
          </div>
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
