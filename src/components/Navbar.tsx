"use client";

import Link from "next/link";
import HLine from "./HLine";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ModeToggle from "./theme-toggle";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MenuDropDown } from "./MenuDropdown";
import { SignOut } from "@/lib/auth.helper";
import { toast } from "./ui/use-toast";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const Navbar = () => {
  const { data, status } = useSession();
  const theme: any = useTheme();

 

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
    <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex md:flex-row w-full items-center justify-between p-3 z-40 gap-3 md:gap-0">
        <Link href={"/"} className="flex gap-5 justify-center items-center">
          <Image
            className="object-cover w-10"
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
            <MenuDropDown />
          </div>

          <div className="hidden md:flex gap-3 md:gap-5 items-center">
            <Input placeholder="Search..." className="w-full md:w-auto" />
            <ModeToggle />
            {status === "authenticated" ? (
              <div className="flex gap-2 justify-center items-center">
                <MenuDropDown />
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
