"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { SignOut } from "@/lib/auth.helper";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  const { replace } = useRouter();

  if (status === "unauthenticated") {
    replace("/sign-in");
  }

  const signOut = async () => {
    setIsLoading(true);
    try {
      await SignOut();
      toast({
        title: "Success",
        description: "You have successfully logged out.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        window.location.replace("/sign-in");
      }, 1000);
    }
  };

  return (
    <>
      <div className="section1 flex flex-col gap-5 lg:gap-0 lg:flex-row items-center min-h-screen max-h-screen lg:items-center px-4 lg:px-16 py-8 lg:py-16">
        <div className="left lg:w-1/2 text-center h-full lg:text-left mb-8 lg:mb-0">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">Auto Dialer</h1>
          <p className="text-lg lg:text-xl mb-6">
            Maximize your contact center’s agent potential by connecting to live
            callers
          </p>
          <Link href="/file-submission">
            <Button className="w-full lg:w-1/4 mx-auto lg:mx-0">
              Get Started
              <span className="ml-2">
                <ArrowRight className="w-4 h-4 " />
              </span>
            </Button>
          </Link>
        </div>
        <div className="right lg:w-1/2 flex h-fit justify-center lg:justify-end">
          <Image
            className="w-full max-w-md lg:max-w-full animate-bounce lazyload"
            data-src="https://telcastnetworks.com/wp-content/uploads/2019/07/WholeSale-Termination-01.png"
            src="https://telcastnetworks.com/wp-content/uploads/2019/07/WholeSale-Termination-01.png"
            alt="right-img"
            width={600}
            height={600}
            layout="responsive"
          />
        </div>
      </div>
    </>
  );
}
