import { useSession } from "next-auth/react";

export function isAuthenticated() {
  const { status } = useSession();
  return status === "authenticated";
}
