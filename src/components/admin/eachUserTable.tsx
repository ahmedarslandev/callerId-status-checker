"use client";

import { UserDetails } from "./eachUserDetails";
import { getUser } from "@/api-calls/api-calls";
import { useEffect, useState } from "react";
import { User } from "@/models/user.model";

export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser({ id: params.id }).then((user) => {
      setUser(user);
    });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      <UserDetails user={user} />
    </div>
  );
}
