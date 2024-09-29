"use client";

import { useEffect, useState } from "react";
import { UserTable } from "./userTable";
import { getUser, getUsers } from "@/api-calls/api-calls";
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";

export function AdminUsersPage() {
  const [users, setUsers] = useState<[] | null>(null);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const handelUserSearching = ({ searchBy = "email", search }: any) => {
    if (searchBy == "id") {
      getUser({ id: search }).then((user) => {
        if (user) {
          return setUsers((): any => [user]);
        }
        setUsers([]);
      });
    } else if (searchBy == "all") {
      getUsers().then((users) => setUsers(users));
      setSearch("");
      setSearchBy("all");
    } else {
      getUser({ email: search }).then((user) => {
        if (user) {
          return setUsers((): any => [user]);
        }
        setUsers([]);
      });
    }
  };
  const handelSearchChange = (event: any) => {
    setSearch(event.target.value);
    handelUserSearching({ searchBy, search: event.target.value });
  };

  const handelUserSearchByChange = (event: any) => {
    setSearchBy(event);
    handelUserSearching({ searchBy: event, search });
  };

  useEffect(() => {
    getUsers().then((users) => setUsers(users));
  }, []);

  if (!users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-2xl font-bold">User Administration</h1>
        <div className="flex justify-between items-center w-fit gap-2">
          <Input
            type="text"
            value={search}
            onChange={(e) => handelSearchChange(e)}
            placeholder="Search users..."
            className="w-[18vw] "
          />
          <Select
            value={searchBy}
            onValueChange={(e) => handelUserSearchByChange(e)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="email">email</SelectItem>
                <SelectItem value="all">show all</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <UserTable users={users} />
    </div>
  );
}
