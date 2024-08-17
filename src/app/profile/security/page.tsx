"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Security } from "@/models/security.model"; // Adjust the import path
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [security, setSecurity] = useState<Security | null>(null);
  const [form, setForm] = useState<Partial<Security>>({
    recovery_email: "",
    two_factor_enabled: false,
  });

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await axios.post("/api/u/security"); // Adjust the API endpoint
        setSecurity(response.data.security);
        console.log(response.data);
        setForm({
          recovery_email: response.data.security.recovery_email,
          two_factor_enabled: response.data.security.two_factor_enabled,
        });
      } catch (error) {
        console.error("Error fetching security data:", error);
      }
    };

    fetchSecurityData();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLButtonElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/u/security", form); // Adjust the API endpoint
      if (res.data.success == false) {
        return toast({
          title: "Error",
          description: res.data.message,
          duration: 5000,
        });
      }
      if (res.data.isEmailSent) {
        setTimeout(() => router.replace("/code-verification"), 2000);
        return toast({
          title: "Success",
          description: res.data.message,
          duration: 5000,
        });
      }
      return toast({
        title: "Success",
        description: res.data.message,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
    }
  };

  if (!security) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Security Settings</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="recovery_email"
                className="block text-sm font-medium"
              >
                Recovery Email
              </label>
              <Input
                type="email"
                id="recovery_email"
                name="recovery_email"
                value={form.recovery_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <Checkbox
                id="two_factor_enabled"
                name="two_factor_enabled"
                checked={form.two_factor_enabled}
                onCheckedChange={(checked) =>
                  setForm(
                    (prev) =>
                      ({
                        ...prev,
                        two_factor_enabled: checked,
                      } as any)
                  )
                }
              />

              <label
                htmlFor="two_factor_enabled"
                className="ml-2 text-sm font-medium"
              >
                Enable Two-Factor Authentication
              </label>
            </div>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
