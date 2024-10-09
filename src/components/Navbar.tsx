"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ModeToggle from "./theme-toggle";
import { MenuDropDown } from "./MenuDropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser as setStoreUser } from "@/store/reducers/auth.reducer";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { AppDispatch } from "@/store/auth.store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/models/user.model";
import { fetchUserData } from "@/api-calls/api-calls";

export default function Navbar() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<User | any | null>(null);
  const { user: authUser } = useSelector((state: any) => state.user) as any;

  useEffect(() => {
    if (Object.keys(authUser).length > 0) {
      setUser(authUser);
    } else {
      fetchUserData().then((data) => {
        if (!data) {
          return router.replace("/sign-in");
        } else if (data.isBlocked == true) {
          return router.replace("/blocked");
        } else if (data.isVerified == false) {
          router.replace("/un-verified");
          return;
        }
        setUser(data);
        dispatch(setStoreUser({ user: data }));
      });
    }
  }, []);

  if (!user) {
    router.replace("/sign-in");
    return null;
  }
  return (
    <>
      <div className="w-full h-16 flex relative top-0 left-0"></div>
      <div className="fixed z-50 top-0 left-0 right-0 w-full h-fit">
        <header className="flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <img
                className="object-cover w-10 lazyload"
                data-src="/Sigma-dialer_logo-removebg-preview.png"
                src="/Sigma-dialer_logo-removebg-preview.png"
                alt="logo"
                width={40}
                height={40}
              />
              <span className="text-lg font-semibold">Sigma Dialer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-muted pl-8 pr-4 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ModeToggle />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                ${user.walletId.balance.toFixed(2)}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MenuDropDown
                  profileImage={user.profileImage}
                  username={user.username}
                />
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
