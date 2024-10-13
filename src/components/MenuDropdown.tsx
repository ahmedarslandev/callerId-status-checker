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
  Settings,
  Wallet,
  File,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import { SignOut } from "@/lib/api.handler";
import Link from "next/link";
import HLine from "./HLine";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { setUser } from "@/store/reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineUploadFile } from "react-icons/md";

export function MenuDropDown({
  profileImage,
  username,
  isAdmin,
}: {
  profileImage: string;
  username: string;
  isAdmin: boolean;
}) {
  const dispatch: AppDispatch = useDispatch();
  const Logout = async () => {
    try {
      await SignOut();
      dispatch(setUser({ user: {} }));
      toast({
        title: "Success",
        description: "Logged out successfully",
        duration: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        duration: 5000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserIcon className="h-5 w-5" />
          <span className="sr-only">Account menu</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-3 py-2 gap-3 flex items-center">
          <div className="w-8 h-8 rounded-full flex justify-center items-center overflow-hidden bg-gray-500">
            <img
              data-src={profileImage}
              src={profileImage}
              alt="User Image"
              width={100}
              height={100}
              className="lazyload"
            />
          </div>
          <p className="text-xs  w-2/3 font-bold">{username}</p>
        </div>
        <HLine />
        <DropdownMenuSeparator />
        {isAdmin && (
          <Link href={"/admin"}>
            <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4 ">
              <RiAdminLine className="font-extrabold text-2xl" />
              <p>Admin</p>
            </DropdownMenuCheckboxItem>
          </Link>
        )}
        <Link href={"/profile"}>
          <DropdownMenuCheckboxItem className="flex cursor-pointer gap-2 pl-4 ">
            <CgProfile className="font-extrabold text-2xl"/>
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
            <MdOutlineUploadFile className="font-extrabold text-2xl"/>
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

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
