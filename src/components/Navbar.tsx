"use client";

import Link from "next/link";
import HLine from "./HLine";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ModeToggle from "./theme-toggle";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MenuDropDown } from "./MenuDropdown";

const Navbar = () => {
  const { data, status } = useSession();
  return (
    <div className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex w-full items-center justify-between p-3 z-40 ">
        <Link href={"/"} className="flex gap-5 justify-center items-center">
          <Image
            className=" object-cover w-10"
            src="/Sigma-dialer_logo-removebg-preview.png"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 id="logo-text">Sigma Dialer</h1>
        </Link>
        <div className="w-fit py-0 px-2 flex gap-5 list-none">
          <Input placeholder="Search..." />
          <ModeToggle />
          {status === "authenticated" ? (
            <>
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 justify-center items-center w-full">
                  <div className=" w-8 h-8 rounded-full flex justify-center items-center overflow-hidden bg-gray-500">
                    <img src={data.user?.image!} alt="" />
                  </div>
                  <p className="text-sm object-cover object-center font-bold">
                    {data.user?.name}
                  </p>
                </div>
                <MenuDropDown />
              </div>
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <Button variant={"outline"}>Login</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <HLine />
    </div>
  );
};

export default Navbar;
