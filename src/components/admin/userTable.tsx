"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/models/user.model";
import { toast } from "../ui";
import axios from "axios";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<keyof User>("username");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof User) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handelBlockUser = async (user: User) => {
    try {
      const { data } = await axios.post("/api/admin/user/actions/block", {
        user,
      });

      if (data.success == false) {
        return toast({
          title: "Error",
          description: "Failed to block user",
          duration: 5000,
        });
      }

      toast({
        title: "Success",
        description: "User blocked successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user",
        duration: 5000,
      });
    }
    console.log("Block user:", user);
  };

  const handelDeletekUser = async (user: User) => {
    try {
      const { data } = await axios.post("/api/admin/user/actions/delete", {
        user,
      });

      if (data.success == false) {
        return toast({
          title: "Error",
          description: "Failed to delete user",
          duration: 5000,
        });
      }

      toast({
        title: "Success",
        description: "User delete successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user",
        duration: 5000,
      });
    }

    console.log("Delete user:", user);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead
              onClick={() => handleSort("username")}
              className="cursor-pointer"
            >
              Username <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("email")}
              className="cursor-pointer"
            >
              Email <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("role")}
              className="cursor-pointer"
            >
              Role <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("isVerified")}
              className="cursor-pointer"
            >
              Verified <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("createdAt")}
              className="cursor-pointer"
            >
              Created At <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[12px]">
          {sortedUsers.map((user) => (
            <TableRow key={String(user._id)}>
              <TableCell>
                <img
                  src={
                    user.profileImage || `/placeholder.svg?height=40&width=40`
                  }
                  alt={`${user.username}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email || "Linked with social media"}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(user.createdAt).toString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(String(user._id))
                      }
                    >
                      Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.replace(`/admin/users/${user._id}`)}
                    >
                      View full details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handelBlockUser(user);
                      }}
                    >
                      {user?.isBlocked ? "Unblock User" : "Block User"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handelDeletekUser(user);
                      }}
                    >
                      Delete user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
