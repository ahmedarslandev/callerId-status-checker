"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { SignUpSchema } from "@/zod-schemas/signup-schema";
import { useSelector } from "react-redux";
import { SignUpfields } from "@/utils/fields/signUpFields";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      router.replace("/");
    }
  }, [user]);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    <div className="flex justify-center p-14 max-md:p-5 h-fit min-h-screen items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full max-w-md border-zinc-400 rounded p-6 flex flex-col gap-4"
        >
          {SignUpfields.map(({ name, label, placeholder, type }: any) => (
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
