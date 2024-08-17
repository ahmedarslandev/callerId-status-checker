"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, Settings, Image, Wallet, File } from "lucide-react";
import { toast } from "./ui/use-toast";
import { SignOut } from "@/lib/auth.helper";
import Link from "next/link";
export function MenuDropDown() {
  const Logout = async () => {
    try {
      await SignOut();
      toast({
        title: "Success",
        description: "Logged out successfully",
        duration: 5000,
      });
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 2000);
    } catch (error) {
      return toast({
        title: "Error",
        description: "Failed to log out",
        duration: 5000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Menu className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Menu Bar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/profile"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4 ">
            <Image />
            <p>Profile</p>
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={"/my-wallet"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4 ">
            <Wallet />
            <p>Wallet</p>
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={"/file-submission"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4">
            <File />
            <p>Upload file</p>
          </DropdownMenuCheckboxItem>
        </Link>
        <Link href={"/settings"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4">
            <Settings />
            <p>Settings</p>
          </DropdownMenuCheckboxItem>
        </Link>
        <DropdownMenuCheckboxItem
          onClick={Logout}
          className="flex cursor-pointer gap-2 pl-4"
        >
          <LogOut />
          <p>Logout</p>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
