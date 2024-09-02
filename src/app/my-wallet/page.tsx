"use client";

import { useEffect, useState } from "react";
import { Wallet } from "@/models/wallet.model";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setTranscations as setStoreTransactions } from "@/store/reducers/user.reducer";
import { RefreshCcw } from "lucide-react";

const fetchWalletData = async () => {
  try {
    const { data } = await axios.post("/api/u/wallet");
    const formattedWallet = {
      ...data.dbUser.walletId,
      lastUpdated: new Date(data.dbUser.walletId.lastUpdated).toLocaleString(),
      lastWithdraw: data.dbUser.walletId.lastWithdraw
        ? new Date(data.dbUser.walletId.lastWithdraw).toLocaleString()
        : "N/A",
      lastDeposited: data.dbUser.walletId.lastDeposited
        ? new Date(data.dbUser.walletId.lastDeposited).toLocaleString()
        : "N/A",
    };
    return { transactions: data.transactions, wallet: formattedWallet };
  } catch (error) {
    console.error("Failed to fetch wallet data:", error);
  }
};

export default function WalletComponent() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user) as any;

  const refreshFiles = async () => {
    setIsRefreshing(true);
    const { transactions, wallet }: any = await fetchWalletData();
    setTransactions(transactions);
    setWallet(wallet);
    dispatch(setStoreTransactions({ transactions: { transactions, wallet } }));
    setIsRefreshing(false);
    return;
  };

  const { transactions: Transactions } = useSelector(
    (state: any) => state.userInfo
  ) as any;

  if (!user) {
    router.replace("/");
  }

  useEffect(() => {
    if (Object.keys(Transactions.wallet).length > 0) {
      setTransactions(Transactions.transactions);
      setWallet(Transactions.wallet);
    } else {
      fetchWalletData().then(({ transactions, wallet }: any) => {
        if (transactions) {
          setTransactions(transactions);
        }
        setWallet(wallet);
        dispatch(
          setStoreTransactions({ transactions: { transactions, wallet } })
        );
      });
    }
    fetchWalletData();
  }, []);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="flex flex-col w-full border border-zinc-300 rounded-lg">
        <header className="p-4 md:p-6 rounded-t-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl md:text-3xl font-bold">
                {wallet.balance}
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full">
                <div className="text-sm">{wallet.currency}</div>
                <div className="flex gap-1 items-center">
                  <Link href="/my-wallet/withdraw">
                    <Button
                      className="w-full md:w-24 h-8 text-xs"
                    >
                      Withdraw
                    </Button>
                  </Link>
                  <Link href="/my-wallet/deposite">
                    <Button className="w-full md:w-24 h-8 text-xs">
                      Deposit
                    </Button>
                  </Link>
                  <Button
                    className="w-full md:w-24 h-8 text-xs"
                    onClick={refreshFiles}
                    variant={"outline"}
                  >
                    <RefreshCcw
                      className={`rotate-180 ${
                        isRefreshing ? "animate-spin" : null
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-sm">
              Last updated: {new Date(wallet.lastUpdated).toLocaleString()}
            </div>
          </div>
        </header>
        <div className="bg-background p-4 md:p-6 flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <InfoCard
              title="Total Transactions"
              value={wallet.transactionsCount}
            />
            <InfoCard title="Total Withdrawn" value={wallet.totalWithdraw} />
            <InfoCard title="Total Deposited" value={wallet.totalDeposited} />
            <InfoCard title="Total Balance" value={wallet.balance} />
          </div>
          <TransactionsTable
            transactions={transactions}
            currency={wallet.currency}
          />
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <div className="bg-card p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
  </div>
);

const TransactionsTable = ({
  transactions,
  currency,
}: {
  transactions: Transaction[];
  currency: string;
}) => (
  <div className="bg-card p-4 md:p-8 rounded-lg shadow-md mt-8 overflow-x-auto">
    <div className="mb-4 md:mb-6 text-lg md:text-xl font-medium">
      Transactions
    </div>
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bank Account</TableHead>
          <TableHead>Bank Name</TableHead>
          <TableHead>Account Holder Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction, i) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(transaction.timeStamp).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {transaction.amount}{" "}
                <span className="text-[8px] font-bold">{currency}</span>
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.bankAccount}</TableCell>
              <TableCell>{transaction.bank}</TableCell>
              <TableCell>{transaction.accountHolderName}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              You have no transactions yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
