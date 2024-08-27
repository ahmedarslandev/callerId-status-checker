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
  Package2Icon,
  SearchIcon,
  PlusIcon,
  MoveHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/admin/icons";

const ActionDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoveHorizontalIcon className="w-4 h-4" />
        <span className="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>View</DropdownMenuItem>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const TableRowData = ({ id, balance, currency, transactions, updated }:any) => (
  <TableRow>
    <TableCell>
      <div className="font-medium">{id}</div>
    </TableCell>
    <TableCell>{balance}</TableCell>
    <TableCell>{currency}</TableCell>
    <TableCell>{transactions}</TableCell>
    <TableCell>{updated}</TableCell>
    <TableCell>
      <ActionDropdown />
    </TableCell>
  </TableRow>
);

export default function Component() {
  return (
    <div className="grid min-h-screen py-5 w-full grid-cols-1">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Wallets</h1>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search wallets..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button variant="outline" size="icon" className="rounded-full">
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">Add Wallet</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Wallets</CardTitle>
              <CardDescription>
                View and manage your recent user wallet activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRowData
                    id="#1001"
                    balance="$1,234.56"
                    currency="USD"
                    transactions="45"
                    updated="2023-04-01"
                  />
                  <TableRowData
                    id="#1002"
                    balance="$789.12"
                    currency="USD"
                    transactions="23"
                    updated="2023-03-28"
                  />
                  <TableRowData
                    id="#1003"
                    balance="$456.78"
                    currency="USD"
                    transactions="18"
                    updated="2023-04-05"
                  />
                  <TableRowData
                    id="#1004"
                    balance="$321.00"
                    currency="USD"
                    transactions="12"
                    updated="2023-04-03"
                  />
                </TableBody>
              </Table>
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
