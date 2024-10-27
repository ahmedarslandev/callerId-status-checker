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

import { DollarSignIcon, UsersIcon, LockIcon } from "@/components/admin/icons";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full gap-4 border-r bg-background p-4">
      <div className="flex h-[60px] items-center justify-between">
        <Link
          href="#"
          className="flex items-center gap-2 font-semibold"
          prefetch={false}
        >
          <span className="">Admin Panel</span>
        </Link>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <LockIcon className="w-4 h-4" />
            </Button>
           </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <nav className="flex flex-col gap-1">
        <SidebarLink
          href="/admin"
          icon={<DollarSignIcon />}
          label="Transactions"
        />
        <SidebarLink href="/admin/users" icon={<UsersIcon />} label="Users" />
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
