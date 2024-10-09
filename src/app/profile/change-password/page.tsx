"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  useState } from "react";
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

// Zod schema for change password validation
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters long."),
  newPassword: z.string().min(6, "New password must be at least 6 characters long."),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long.")
});

export default function ChangePasswordPage() {
  const { data } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
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

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full max-w-md border-zinc-400 rounded p-6 flex flex-col gap-4"
        >
          {data?.data.isLoggedInWithCredentials && (
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Current Password" {...field} />
                  </FormControl>
                  {form.formState.errors.currentPassword && (
                    <FormDescription className="text-red-500">
                      {form.formState.errors.currentPassword?.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New Password" {...field} />
                </FormControl>
                {form.formState.errors.newPassword && (
                  <FormDescription className="text-red-500">
                    {form.formState.errors.newPassword?.message}
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm New Password" {...field} />
                </FormControl>
                {form.formState.errors.confirmPassword && (
                  <FormDescription className="text-red-500">
                    {form.formState.errors.confirmPassword?.message}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <ButtonLoder isLoading={isLoading} name="Change Password" />
        </form>
      </Form>
    </div>
  );
}
