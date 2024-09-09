"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { User } from "@/models/user.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ButtonLoder from "@/components/ButtonLoder";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { setUser } from "@/store/reducers/auth.reducer";

export default function EditProfilePage() {
  const [form, setForm] = useState<Partial<User>>({
    username: "",
    email: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user: authUser } = useSelector((state: any) => state.user) as any;
  const dispatch: AppDispatch = useDispatch(); // Adjust the import path

  useEffect(() => {
    if (!authUser) {
      router.replace("/sign-in");
    } else {
      // Initialize form state with user data
      setForm({
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
      });
    }
  }, [authUser, router]);

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put("/api/u/me", form);
      const { success, message, dbUser, isEmailSent } = response.data;

      if (!success) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      dispatch(setUser({ user: dbUser }));

      if (isEmailSent) {
        toast({
          title: "Success",
          description: "Email has been sent successfully.",
          duration: 5000,
        });
        router.replace("/code-verification");
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        duration: 5000,
      });
      router.replace("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || error.message || "An error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                data-src={authUser.profileImage || "/default-profile.png"}
                src={authUser.profileImage || "/default-profile.png"}
                alt={`${authUser.username}'s profile image`}
                width={100}
                height={100}
                className="rounded-full lazyload"
              />
              <div>
                <h3 className="text-xl font-semibold">{authUser.username}</h3>
              </div>
            </div>
            <Input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full"
            />
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full"
            />
            <Textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full"
            />
            <ButtonLoder name={"Update"} isLoading={isLoading} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
