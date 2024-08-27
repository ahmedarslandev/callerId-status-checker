import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoveHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/admin/icons";
import { useState } from "react";

// Reusable DropdownMenu component
const ActionDropdown = ({ id }: any) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoveHorizontalIcon className="w-4 h-4" />
        <span className="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link href={`/admin/user/view?userId=${id}`}>View</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/admin/user/edit?userId=${id}`}>Edit</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/admin/user/delete?userId=${id}`}>Delete</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserTable = ({ users }: any) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user: any) => (
        <TableRow key={user.id}>
          <TableCell>
            <div className="font-medium">{user.id}</div>
          </TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.joined}</TableCell>
          <TableCell>
            <ActionDropdown id={user.id} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function UserComponent() {
  const [users, setUsers] = useState([
    {
      id: "#1001",
      name: "John Doe",
      email: "john@example.com",
      joined: "2023-04-01",
    },
    {
      id: "#1002",
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "2023-03-28",
    },
    {
      id: "#1003",
      name: "Michael Johnson",
      email: "michael@example.com",
      joined: "2023-04-05",
    },
    {
      id: "#1004",
      name: "Emily Davis",
      email: "emily@example.com",
      joined: "2023-04-03",
    },
  ]);

  return (
    <div className="min-h-screen py-5 w-full">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Users</h1>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button variant="outline" size="icon" className="rounded-full">
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">Add User</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                View and manage your recent user registrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={users} />
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button size="icon" variant="outline">
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size="icon" variant="outline">
                      <ChevronRightIcon className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
