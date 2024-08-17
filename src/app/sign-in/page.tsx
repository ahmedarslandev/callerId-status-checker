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
import { SignIn as login } from "@/lib/auth.helper";
import ButtonLoder from "@/components/ButtonLoder";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { status } = useSession();
  const router = useRouter();

  if (status == "authenticated") {
    router.replace("/");
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
    <div className="flex p-14 justify-center h-fit min-h-screen items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-[60%] border-zinc-400 rounded p-6 flex flex-col justify-center gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
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
                  <Input type="password" placeholder="********" {...field} />
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
            <p>or sign in with </p>
            <HLine />
            <div className="flex w-full justify-around items-center">
              {["Google", "Facebook", "Twitter", "Github"].map((e, i) => (
                <div
                  onClick={async () => {
                    await login(e.toLocaleLowerCase(), {
                      callbackUrl: `/api/v1/auth/callback/${e.toLocaleLowerCase()}`,
                    });
                  }}
                  key={i}
                  className="flex flex-col cursor-pointer select-none justify-center gap-2 items-center"
                >
                  <Image
                    className={`w-5 h-5 ${
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
          <FormDescription>
            Forgot your password?{" "}
            <Link
              className="text-blue-600 hover:text-blue-700"
              href="/forgot-password"
            >
              Forgot Password
            </Link>
          </FormDescription>
          <ButtonLoder isLoading={isLoading} name={"Sign In"} />
          <FormDescription>
            Dont have an account?{" "}
            <Link className="text-blue-600 hover:text-blue-700" href="/sign-up">
              Sign Up
            </Link>
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
