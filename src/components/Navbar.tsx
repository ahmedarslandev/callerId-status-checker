"use client";

import Link from "next/link";
import HLine from "./HLine";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ModeToggle from "./theme-toggle";
import { MenuDropDown } from "./MenuDropdown";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/reducers/auth.reducer";

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { AppDispatch } from "@/store/auth.store";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();
  const dispatch: AppDispatch = useDispatch();

  useMemo(() => {
    dispatch(setUser({ user: data?.data }));
  }, [data]);

  const { user } = useSelector((state: any) => state.user) as any;
  if (!user) {
    return null
  }
  return (
    <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex md:flex-row w-full items-center justify-between p-3 z-40 gap-3 md:gap-0">
        <Link href={"/"} className="flex gap-5 justify-center items-center">
          <img
            className="object-cover w-10 lazyload"
            data-src="/Sigma-dialer_logo-removebg-preview.png"
            src="/Sigma-dialer_logo-removebg-preview.png"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 id="logo-text" className="text-lg md:text-xl font-bold">
            Sigma Dialer
          </h1>
        </Link>
        <div className="md:w-fit px-2 flex md:flex-row gap-3 md:gap-5 list-none items-center">
          <div className="flex justify-center items-center md:hidden gap-3">
            <ModeToggle />
            <MenuDropDown profileImage={user.picture} username={user.name} />
          </div>

          <div className="hidden md:flex gap-3 md:gap-5 items-center">
            <Input placeholder="Search..." className="w-full md:w-auto" />
            <ModeToggle />
            {user ? (
              <div className="flex gap-2 justify-center items-center">
                <MenuDropDown
                  profileImage={user.picture}
                  username={user.name}
                />
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href={"/sign-in"}>
                  <Button variant={"outline"}>Login</Button>
                </Link>
                <Link href={"/sign-up"}>
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <HLine />
    </div>
  );
};

export default Navbar;
