"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setTranscations as setStoreTransactions } from "@/store/reducers/user.reducer";
import { RefreshCcw } from "lucide-react";
import { fetchWalletData } from "@/api-calls/api-calls";
import { InfoCard, TransactionsTable } from "./components";
import { Wallet } from "@/models/wallet.model";
import { Transaction } from "@/models/transaction.model";

export default function WalletComponent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wallet, setWallet] = useState<Partial<Wallet> | null | any>(null);
  const [transactions, setTranscations] = useState<
    Partial<Transaction> | null | any
  >(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { transactions: storedTransactions } = useSelector(
    (state: any) => state.userInfo
  );
  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user) {
      return router.replace("/sign-in");
    }
    console.log(setStoreTransactions);
    if (Object.keys(storedTransactions.wallet).length === 0) {
      // Fetch wallet data if not already in the store
      fetchWalletData().then(
        ({ transactions, wallet }: any | {} | null | undefined) => {
          console.log("run");
          dispatch(
            setStoreTransactions({
              transactions: {
                transactions,
                wallet,
              },
            })
          );
          setTranscations(transactions);
          setWallet(wallet);
        }
      );
    } else if (
      Object.keys(storedTransactions.wallet).length > 0 &&
      storedTransactions.transactions
    ) {
      setTranscations(storedTransactions.transactions);
      setWallet(storedTransactions.wallet);
    }
  }, []);

  const refreshFiles = async () => {
    setIsRefreshing(true);
    try {
      const { transactions, wallet }: any = await fetchWalletData();
      console.log(transactions, wallet);
      dispatch(
        setStoreTransactions({
          transactions: { transactions },
          wallet: { wallet },
        })
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!wallet || !transactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="flex flex-col w-full border border-zinc-300 rounded-lg">
        <header className="p-4 md:p-6 rounded-t-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl md:text-3xl font-bold">
                {wallet.balance.toFixed(3)}
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <div className="text-sm">{wallet.currency}</div>
                <div className="flex gap-1 items-center">
                  <Link href="/my-wallet/initiate-transaction">
                    <Button className="w-full h-8 text-xs">
                      Initiate Transaction
                    </Button>
                  </Link>
                  <Button
                    className="w-full md:w-24 h-8 text-xs"
                    onClick={refreshFiles}
                    variant="outline"
                    disabled={isRefreshing}
                  >
                    <RefreshCcw
                      className={`rotate-180 ${
                        isRefreshing ? "animate-spin" : ""
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
            <InfoCard title="Total Balance" value={wallet.balance.toFixed(3)} />
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
