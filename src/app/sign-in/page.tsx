"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/ButtonLoder";
import { signInfields } from "@/utils/fields/signInFields";
import { SignInSchema } from "@/zod-schemas/schemas";
import { SignIn as login } from "@/lib/api.handler";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      router.replace("/");
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    try {
      await login("credentials", values);
      toast({
        title: "Success",
        description: "Successfully signed in",
        duration: 5000,
      });
      form.reset();
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Credentials",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex p-14 max-md:p-5 justify-center h-fit min-h-screen items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="border-[1px] w-[60%] max-md:w-full border-zinc-400 rounded p-6 flex flex-col gap-4">
          {signInfields.map(({ name, label, placeholder, type }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof z.infer<typeof SignInSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type={type || "text"} placeholder={placeholder} className="max-md:text-xs" {...field} />
                  </FormControl>
                  {form.formState.errors[name as keyof typeof form.formState.errors] && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors[name as keyof typeof form.formState.errors]?.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          ))}

          <FormDescription className="max-md:text-xs">
            Forgot your password?{" "}
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 max-md:text-xs">
              Forgot Password
            </Link>
          </FormDescription>
          <ButtonLoader isLoading={isLoading} name="Sign In" />
          <FormDescription className="max-md:text-xs">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 max-md:text-xs">
              Sign Up
            </Link>
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
