"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { SignOut } from "@/lib/auth.helper";
import { toast } from "@/components/ui/use-toast";
import ButtonLoder from "@/components/ButtonLoder";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
      <div className="section1">
        <div className="left">
          <h1>Auto Dialer</h1>
          <p>
            Maximize your contact center’s agent potential by connecting to live
            callers
          </p>
          <Link href="/file-submission">
            <Button className="w-1/4">
              Get Started
              <span className="ml-2">
                <ArrowRight className="w-4 h-4 " />
              </span>
            </Button>
          </Link>
        </div>
        <div className="right">
          <img
            src="https://telcastnetworks.com/wp-content/uploads/2019/07/WholeSale-Termination-01.png"
            alt="right-img"
          />
        </div>
      </div>
    </>
  );
}
