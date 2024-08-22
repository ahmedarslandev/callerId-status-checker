"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/models/user.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ButtonLoder from "@/components/ButtonLoder";
import Image from "next/image";

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/u/me");
        setUser(response.data.dbUser);
        setForm({
          username: response.data.dbUser.username,
          email: response.data.dbUser.email,
          bio: response.data.dbUser.bio,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/u/me", form);

      if (res.data.success == false) {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
          duration: 5000,
        });
      }
      setUser(res.data.dbUser);

      if (res.data.isEmailSent && res.data.isEmailSent == true) {
        setTimeout(() => {
          router.replace("/code-verification");
        }, 2000);
        return toast({
          title: "Success",
          description: "Email has been sent successfully.",
          duration: 5000,
        });
      }
      setTimeout(() => {
        router.replace("/profile");
      }, 2000);
      return toast({
        title: "Success",
        description: res.data.message,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (!user) {
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
              <Image
                data-src={user.profileImage}
                src={user.profileImage || "/default-profile.png"}
                alt={`${user.username}'s profile image`}
                width={100}
                height={100}
                className="rounded-full lazyload"
              />
              <div>
                <h3 className="text-xl font-semibold">{user.username}</h3>
              </div>
            </div>
            <Input
              type="text"
              name="username"
              value={form.username || ""}
              onChange={handleChange}
              placeholder="Username"
              className="w-full"
            />
            <Input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full"
            />
            <Textarea
              name="bio"
              value={form.bio || ""}
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
