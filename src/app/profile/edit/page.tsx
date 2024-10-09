"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ButtonLoder from "@/components/ButtonLoder";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { setUser } from "@/store/reducers/auth.reducer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profileEditSchema } from "@/zod-schemas/other.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui";
import { profileEditFields } from "@/utils/fields/profileEditFields";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import Link from "next/link";
import { fetchUserData } from "@/api-calls/api-calls";

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user: authUser } = useSelector((state: any) => state.user) as any;
  const dispatch: AppDispatch = useDispatch();

  const form = useForm<z.infer<typeof profileEditSchema>>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!authUser) {
      router.replace("/sign-in");
      return;
    }

    form.reset({
      username: authUser.username || "",
      email: authUser.email || "",
      bio: authUser.bio || "",
    });
  }, [authUser, router]);

  // Form submission handler
  async function onSubmit(values: z.infer<typeof profileEditSchema>) {
    setIsLoading(true);
    try {
      const { data } = await axios.put("/api/u/me", values);
      if (data.success === false) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      dispatch(setUser({ user: data.dbUser }));
      if (data.isEmailSent) {
        setTimeout(() => {
          fetchUserData().then((user) => {
            if(Object.keys(user).length > 0) {
              dispatch(setUser({ user }));
            }
          });
        }, 1000 * 120);
        toast({
          title: "Email Verification",
          description:
            "Please verify your email address to complete the profile update",
          duration: 5000,
        });
        router.replace("/code-verification");
        return;
      }
      toast({
        title: "Success",
        description: data.message,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex w-full  justify-center items-center h-fit min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full border-zinc-200 h-fit rounded p-6 flex flex-col justify-center gap-4"
        >
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Edit Profile</h3>
              </CardHeader>
              <CardContent>
                <div className=" flex items-center justify-start w-full  gap-4">
                  <div className="w-fit h-fit overflow-hidden rounded-full justify-center items-center">
                    <img
                      className="object-cover h-20 rounded-md lazyload"
                      src={authUser.profileImage}
                      alt={authUser.username}
                    />
                  </div>
                  <p className="font-bold">{authUser.username}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {profileEditFields.map(({ name, placeholder, type }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={type || "text"}
                      className="max-md:text-xs"
                      placeholder={placeholder}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors[name] && (
                    <FormDescription className="text-xs text-red-500">
                      {form.formState.errors[name]?.message}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          ))}

          <div className="flex gap-2">
            <ButtonLoder
              variant={"outline"}
              isLoading={isLoading}
              name="Update profile"
            />
            <Link href={`/profile`}>
              <Button>Back to Profile</Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
