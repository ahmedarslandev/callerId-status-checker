"use client";

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
import { Badge } from "@/components/ui/badge";
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
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Transaction } from "@/models/transaction.model";
import { AppDispatch } from "@/store/auth.store";
import { useDispatch, useSelector } from "react-redux";
import { setTranscations as setAdminTransactions } from "@/store/reducers/admin.reducer";
import { RefreshCcw } from "lucide-react";

const fetchTransactions = async (toast: any): Promise<Transaction[] | null> => {
  try {
    const response = await axios.get("/api/admin/transactions");
    if (response.data.success === false) {
      toast({
        title: "Error",
        description: response.data.message,
        duration: 5000,
      });
      return null;
    }
    return response.data.transactions;
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong",
      duration: 5000,
    });
    return null;
  }
};

const TransactionRow = ({
  transaction,
}: {
  transaction: Transaction | any;
}) => (
  <TableRow key={transaction._id}>
    <TableCell>
      <div className="font-medium">{transaction._id}</div>
    </TableCell>
    <TableCell>{new Date(transaction.timeStamp).toLocaleString()}</TableCell>
    <TableCell>${transaction.amount}</TableCell>
    <TableCell>
      <Badge
        variant="secondary"
        className={`${
          transaction.status === "failed"
            ? "bg-red-400"
            : transaction.status === "completed"
            ? "bg-green-400"
            : ""
        }`}
      >
        {transaction.status}
      </Badge>
    </TableCell>
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoveHorizontalIcon className="w-4 h-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link
            href={`/admin/transaction/view?transactionId=${transaction._id}`}
          >
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          <Link
            href={`/admin/transaction/edit?transactionId=${transaction._id}`}
          >
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <Link
            href={`/admin/transaction/delete?transactionId=${transaction._id}`}
          >
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [copiedTransactions, setCopiedTransactions] = useState<
    Transaction[] | null
  >(null);
  const [search, setSearch] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const { transactions: Transactions } = useSelector(
    (state: any) => state.admin
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshFiles = async () => {
    setIsRefreshing(true);
    const transactions = await fetchTransactions(toast);
    setTransactions(transactions);
    setCopiedTransactions(transactions);
    dispatch(setAdminTransactions({ transactions: { transactions } }));
    setIsRefreshing(false);
    return;
  };

  const handelSearch = (e: any) => {
    setSearch(e.target.value);
    const filteredTransactions: any = copiedTransactions?.filter((t) =>
      t.amount.includes(e.target.value)
    );
    setTransactions(filteredTransactions);
  };

  useEffect(() => {
    if (
      Transactions &&
      Transactions.transactions &&
      Transactions.transactions.length > 0
    ) {
      setTransactions(Transactions.transactions);
      setCopiedTransactions(Transactions.transactions);
    } else {
      fetchTransactions(toast).then((data: any) => {
        if (data) {
          dispatch(
            setAdminTransactions({
              transactions: data,
            })
          );
          setTransactions(data);
          setCopiedTransactions(data);
        }
      });
    }
  }, [Transactions]);

  if (!transactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full py-5 flex flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="gap-2 flex-row w-full flex">
          <h1 className="font-semibold text-lg">Transactions</h1>
          <Button
            onClick={refreshFiles}
            className="w-fit h-8 text-xs"
            variant={"outline"}
          >
            <RefreshCcw
              className={`rotate-180 ${isRefreshing ? "animate-spin" : null}`}
            />
          </Button>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e: any) => handelSearch(e)}
                placeholder="Enter amount..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Link href={"/admin/transaction/new-transaction"}>
            <Button variant="outline" size="icon" className="rounded-full">
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Add Transaction</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and manage your recent transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={JSON.stringify(transaction._id)}
                      transaction={transaction}
                    />
                  ))}
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
