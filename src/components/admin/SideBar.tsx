"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  DollarSignIcon,
  UsersIcon,
  WalletIcon,
  FileIcon,
  PhoneIcon,
  LockIcon,
  Package2Icon,
} from "@/components/admin/icons"; // Assuming these are exported from a central icons file.

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full gap-4 border-r bg-background p-4">
      <div className="flex h-[60px] items-center justify-between">
        <Link
          href="#"
          className="flex items-center gap-2 font-semibold"
          prefetch={false}
        >
          <Package2Icon className="h-6 w-6" />
          <span className="">Acme Admin</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
                style={{ aspectRatio: "32/32", objectFit: "cover" }}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex flex-col gap-1">
        <SidebarLink
          href="/admin"
          icon={<DollarSignIcon />}
          label="Transactions"
        />
        <SidebarLink href="/admin/users" icon={<UsersIcon />} label="Users" />
        <SidebarLink href="/admin/files" icon={<FileIcon />} label="Files" />
      </nav>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground`}
      prefetch={false}
    >
      {icon}
      {label}
    </Link>
  );
}
