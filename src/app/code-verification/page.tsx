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
import ButtonLoder from "@/components/ButtonLoder";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

import axios from "axios";
import { CodeVerificationSchema } from "@/zod-schemas/code-verification.schema";

export default function CodeVerification() {
  const router = useRouter();
  const cookies = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const codeExpiry = cookies.get("code-expiry") as any;
    const timer = Math.floor((codeExpiry - Date.now()) / 1000);

    setTime(timer > 0 ? timer : 0);
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [cookies]);

  const form = useForm<z.infer<typeof CodeVerificationSchema>>({
    resolver: zodResolver(CodeVerificationSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof CodeVerificationSchema>) {
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/code-verification", values);
      if (res.data.success == false) {
        return toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }

      router.replace("/sign-in");

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

  async function resendVerifyCode() {
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/resend-verifycode");
      
      if (res.data.success == false) {
        return toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }

      const codeExpiry = cookies.get("code-expiry") as any;
      const timer = Math.floor((codeExpiry - Date.now()) / 1000);

      setTime(timer > 0 ? timer : 0);
      const interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1000);

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
    <div className="flex justify-center items-center min-h-screen p-4 md:p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] border-zinc-400 rounded p-4 sm:p-6 md:p-8 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-md flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify Code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                {form.formState.errors.verifyCode && (
                  <FormDescription className="text-xs text-red-500">
                    {form.formState.errors.verifyCode.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <ButtonLoder isLoading={isLoading} name={"Verify"} />
          <FormDescription className="text-center text-sm">
            Please enter the verification code sent to your registered email
            address.{" "}
            <span
              onClick={time > 0 ? () => {} : resendVerifyCode}
              className={`${
                time > 0
                  ? "hidden"
                  : "text-blue-600 hover:text-blue-700 cursor-pointer"
              }`}
            >
              Send Code again
            </span>
            {time > 0 && <p className="mt-2">{time}s</p>}
          </FormDescription>
        </form>
      </Form>
    </div>
  );
}
