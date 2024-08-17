"use client";

import { useEffect, useState } from "react";
import { Wallet } from "@/models/wallet.model";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Transaction } from "@/models/transaction.model";

export default function Component() {
  const { theme } = useTheme(); // Hook to get the current theme
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      const response = (await axios.post("/api/u/wallet")) as any;
      const data = await response.data;
      setTransactions(data.transactions);
      setWallet({
        ...data.dbUser.walletId,
        lastUpdated: new Date(
          data.dbUser.walletId.lastUpdated
        ).toLocaleString(),
        lastWithdraw: data.dbUser.walletId.lastWithdraw
          ? new Date(data.dbUser.walletId.lastWithdraw).toLocaleString()
          : "N/A",
        lastDeposited: data.dbUser.walletId.lastDeposited
          ? new Date(data.dbUser.walletId.lastDeposited).toLocaleString()
          : "N/A",
      });
    };

    fetchWalletData();
  }, []);

  const handleDeposit = async () => {
    const response = await fetch("/api/u/deposite", {
      method: "POST",
    });

    if (response.ok) {
      const { updatedWallet } = await response.json();
      setWallet(updatedWallet);
    }
  };
  console.log(wallet);

  const handleWithdrawal = async () => {
    const response = await fetch("/api/u/withdrawal", {
      method: "POST",
    });

    if (response.ok) {
      const updatedWallet = await response.json();
      setWallet(updatedWallet);
    }
  };

  if (!wallet) {
    return <div>Loading...</div>;
  }
  return (
    <div className=" w-full h-full justify-center items-center flex flex-col p-10">
      <div className="flex flex-col h-full w-full border-[1px] border-zinc-300 rounded-lg">
        <header className="p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{wallet.balance}</div>
              <div className="flex gap-2 items-center w-full">
                <div className="text-sm">{wallet.currency}</div>
                <div className="flex justify-center gap-1 items-center">
                  <Button
                    variant={"outline"}
                    className="flex justify-center items-center w-10 h-5 text-[7px]"
                  >
                    Withdraw
                  </Button>
                  <Button className="flex justify-center items-center w-10 h-5 text-[7px]">
                    Deposite
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-sm ">Last updated: 2023-08-16</div>
          </div>
        </header>
        <div className="bg-background p-6 flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-sm text-muted-foreground">
                Total Transactions
              </div>
              <div className="text-3xl font-bold">
                {wallet.totalTransactionsCount}
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-sm text-muted-foreground">
                Total Withdrawn
              </div>
              <div className="text-3xl font-bold">
                {wallet.totalWithdrawalsCount}
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-sm text-muted-foreground">
                Total Deposited
              </div>
              <div className="text-3xl font-bold">{wallet.totalDeposited}</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-3xl font-bold">{wallet.balance}</div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-lg shadow-md mt-8">
            <div className="mb-6 text-xl font-medium">Transactions</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((e: any, i) => (
                    <TableRow key={i}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.amount}</TableCell>
                      <TableCell>{e.type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      You have no transactions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
