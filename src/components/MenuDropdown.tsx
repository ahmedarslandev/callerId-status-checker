"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Menu,
  Settings,
  Image as Picture,
  Wallet,
  File,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import { SignOut } from "@/lib/api.handler";
import Link from "next/link";
import { useSession } from "next-auth/react";
import HLine from "./HLine";
import Image from "next/image";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { useRouter } from "next/navigation";

export function MenuDropDown() {
  const { data, status, update } = useSession();
  const router = useRouter();

  const Logout = async () => {
    try {
      await SignOut();
      update(null);
      toast({
        title: "Success",
        description: "Logged out successfully",
        duration: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
        {status === "authenticated" && (
          <div className="px-3 py-2 gap-3 flex items-center">
            <div className="w-8 h-8 rounded-full flex justify-center items-center overflow-hidden bg-gray-500">
              <img
                data-src={data.user?.image!}
                src={data.user?.image!}
                alt="User Image"
                width={100}
                height={100}
                layout="responsive"
                className="lazyload"
              />
            </div>
            <p className="text-sm font-bold">{data.user?.name}</p>
          </div>
        )}
        <HLine />
        <DropdownMenuSeparator />
        <Link href={"/profile"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4 ">
            <Picture />
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
        <Link href={"/my-files"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4">
            <File />
            <p>My files</p>
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
