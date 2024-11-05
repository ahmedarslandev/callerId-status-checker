"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ModeToggle from "./theme-toggle";
import { MenuDropDown } from "./MenuDropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser as setStoreUser } from "@/store/reducers/auth.reducer";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { AppDispatch } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { User } from "@/models/user.model";
import { fetchUserData } from "@/api-calls/api-calls";
import { links } from "@/utils/navlinks/links";
import { SignOut } from "@/lib/api.handler";

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
  }, [user]);

  const logoutUser = async () => {
    SignOut();
    dispatch(setStoreUser({ user: null }));
    router.replace("/sign-in");
  };

  if (!user) {
    return null;
  }
  return (
    <>
      <div className="w-full h-16 flex relative top-0 left-0"></div>
      <div className="fixed z-50 top-0 left-0 right-0 w-full h-fit">
        <header className="flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3" prefetch={false}>
              <span className="text-base md:text-lg font-semibold">
                BULK DID
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative md:block hidden flex-1 max-w-sm">
              <ul className="flex justify-center items-center py-0 gap-3 px-5">
                {links.map((link) => (
                  <>
                    <Link
                      className="links relative"
                      href={link.href}
                      key={link.label}
                    >
                      <p className="text-[13px] font-bold">{link.label}</p>
                    </Link>
                  </>
                ))}
                <p
                  onClick={logoutUser}
                  className="links text-[13px] font-bold relative cursor-pointer"
                >
                  Logout
                </p>
                {user.role === "admin" && (
                  <>
                    <Link href="/admin">
                      <p className="bg-green-500 px-3 py-1 text-xs font-bold text-white rounded-sm cursor-pointer">
                        Admin
                      </p>
                    </Link>
                  </>
                )}
              </ul>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ModeToggle />
            </Button>
            <div className="flex items-center gap-1">
              <div className="text-sm md:hidden flex font-medium">
                ${user.walletId.balance.toFixed(2)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full flex md:hidden"
              >
                <MenuDropDown
                  profileImage={user.profileImage}
                  username={user.username}
                  isAdmin={user.role === "admin" ? true : false}
                />
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
