"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoder from "@/components/ButtonLoder";
import HLine from "@/components/HLine";
import { SignUpSchema } from "@/zod-schemas/signup-schema";
import { SignIn as login, SignUp } from "@/lib/api.handler";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

export default function SignIn() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isUser = isAuthenticated();

  if (isUser) {
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
    const { data } = await axios.post("/api/auth/sign-up", values);
    if (data.success == false) {
      return toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
        duration: 5000,
      });
    }
    setIsLoading(false);
    router.replace("/code-verification");
    toast({
      title: "Success",
      description: data.message,
      duration: 5000,
    });
  }

  return (
    <div className="flex justify-center p-14 max-md:p-5 h-fit min-h-screen items-center bg-gray-50 dark:bg-gray-900">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full max-w-md border-zinc-400 rounded p-6 flex flex-col gap-4"
        >
          {[
            { name: "username", label: "Username", placeholder: "John Doe" },
            { name: "email", label: "Email", placeholder: "example@gmail.com" },
            { name: "phoneNo", label: "Phone No", placeholder: "1234567890" },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "********",
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              placeholder: "********",
            },
          ].map(({ name, label, placeholder, type }: any) => (
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
          <div className="flex flex-col gap-3 justify-center items-center">
            <p className="max-md:text-xs">or sign in with</p>
            <HLine />
            <div className="flex flex-col max-md:gap-2 md:flex-row w-full justify-around items-center">
              {["Google", "Facebook", "Twitter", "Github"].map((provider) => (
                <div
                  key={provider}
                  onClick={async () => {
                    await login(provider.toLowerCase(), {
                      callbackUrl: `/api/v1/auth/callback/${provider.toLowerCase()}`,
                    });
                  }}
                  className="flex flex-row max-md:w-full max-md:border-zinc-300 max-md:border-[1px] max-md:justify-start max-md:rounded max-md:p-2 md:flex-col cursor-pointer select-none justify-center gap-2 items-center"
                >
                  <Image
                    src={`/${provider.toLowerCase()}.svg`}
                    alt={provider}
                    width={20}
                    height={20}
                    className={`w-5 h-5 ${
                      theme === "dark" && provider === "Github" ? "invert" : ""
                    }`}
                    loading="lazy"
                  />
                  <p className="text-xs">{provider}</p>
                </div>
              ))}
            </div>
          </div>
          <ButtonLoder isLoading={isLoading} name="Sign Up" />
          <FormDescription className="text-center max-md:text-xs mt-4">
            Already have an account?{" "}
            <Link
              className="text-blue-600 max-md:text-xs hover:text-blue-700"
              href="/sign-in"
            >
              Sign In
            </Link>
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
