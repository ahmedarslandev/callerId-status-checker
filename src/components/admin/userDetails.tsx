"use client";

import { useEffect, useState } from "react";
import { UserTable } from "./userTable";
import { getUsers } from "@/api-calls/api-calls";

export function AdminUsersPage() {
  const [users, setUsers] = useState<[] | null>(null);
  useEffect(() => {
    getUsers().then((users) => setUsers(users));
  }, []);

  if (!users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Administration</h1>
      <UserTable users={users} />
    </div>
  );
}
