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

import Link from "next/link";
import HLine from "@/components/HLine";
import { SignUpSchema } from "@/zod-schemas/signup-schema";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import ButtonLoder from "@/components/ButtonLoder";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SignIn as login } from "@/lib/auth.helper";

export default function SignIn() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { status } = useSession();

  if (status == "authenticated") {
    router.replace("/");
  }

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/sign-up", values);
      if (res.data.success == false) {
        return toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }
      router.replace("/code-verification");
      return toast({
        title: "Success",
        description: res.data.message,
        duration: 5000,
      });
    } catch (error: any) {
      return toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center p-14 h-fit min-h-screen items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border-[1px] w-[60%] border-zinc-400 rounded p-6 flex flex-col justify-center gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Jhon Doe" {...field} />
                  </FormControl>
                  {form.formState.errors.username && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors.username.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
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
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  {form.formState.errors.phoneNo && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors.phoneNo.message}
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  {form.formState.errors.confirmPassword && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors.confirmPassword.message}
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
                        theme == "dark" && e == "Github" ? "invert" : null
                      }`}
                      src={`/${e.toLocaleLowerCase()}.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                    <p className="text-xs">{e}</p>
                  </div>
                ))}
              </div>
            </div>
            <ButtonLoder isLoading={isLoading} name={"Sign Up"} />
            <FormDescription>
              Already have an account?{" "}
              <Link
                className="text-blue-600 hover:text-blue-700"
                href="/sign-in"
              >
                Sign In
              </Link>
            </FormDescription>
          </form>
        </Form>
      </div>
    </>
  );
}
