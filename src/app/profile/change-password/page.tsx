"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoder from "@/components/ButtonLoder";
import { newPasswordSchema } from "@/zod-schemas/other.schemas";

export default function ChangePasswordPage() {
  const { data } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: useMemo(
      () => ({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }),
      []
    ),
  });

  const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/u/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        isLoggedInWithCredentials: data?.data.isLoggedInWithCredentials,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          duration: 5000,
        });
        router.replace("/profile");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable error message component
  const ErrorMessage = ({ error }: any) => (
    <FormDescription className="text-red-500">{error?.message}</FormDescription>
  );

  // Render input fields with error handling
  const renderField = (name: string, label: string) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="password" placeholder={label} {...field} />
          </FormControl>
          {form.formState.errors[
            name as keyof typeof form.formState.errors
          ] && (
            <ErrorMessage
              error={
                form.formState.errors[
                  name as keyof typeof form.formState.errors
                ]
              }
            />
          )}
        </FormItem>
      )}
    />
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full max-w-md border-zinc-400 rounded p-6 flex flex-col gap-4"
        >
          {data?.data.isLoggedInWithCredentials &&
            renderField("currentPassword", "Current Password")}
          {renderField("newPassword", "New Password")}
          {renderField("confirmPassword", "Confirm New Password")}
          <ButtonLoder isLoading={isLoading} name="Change Password" />
        </form>
      </Form>
    </div>
  );
}
