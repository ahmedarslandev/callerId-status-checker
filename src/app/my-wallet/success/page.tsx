import { isAuthenticated } from "@/lib/auth/isAuthenticated";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
  const isUser = isAuthenticated();
  if (!isUser) {
    router.replace("/sign-in");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Transaction Successful
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your transaction has been completed successfully. You will receive
          your amount in the wallet within 2-3 business days.
        </p>
        <div className="mt-6">
          <Link
            href="/my-wallet"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}

function CircleCheckIcon({ className }: any) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
