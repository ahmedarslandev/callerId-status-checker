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

export default function WalletComponent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user,
    transactions: storedTransactions,
    wallet: storedWallet,
  } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user) {
      return router.replace("/sign-in");
    } else if (!storedWallet || Object.keys(storedWallet).length === 0) {
      // Fetch wallet data if not already in the store
      fetchWalletData().then(({ transactions, wallet }: any) => {
        dispatch(setStoreTransactions({ transactions, wallet }));
      });
    }
  }, [user, storedWallet, dispatch, router]);

  const refreshFiles = async () => {
    setIsRefreshing(true);
    try {
      const { transactions, wallet }: any = await fetchWalletData();
      dispatch(setStoreTransactions({ transactions, wallet }));
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!storedWallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="flex flex-col w-full border border-zinc-300 rounded-lg">
        <header className="p-4 md:p-6 rounded-t-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl md:text-3xl font-bold">
                {storedWallet.balance.toFixed(3)}
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <div className="text-sm">{storedWallet.currency}</div>
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
              Last updated:{" "}
              {new Date(storedWallet.lastUpdated).toLocaleString()}
            </div>
          </div>
        </header>
        <div className="bg-background p-4 md:p-6 flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <InfoCard
              title="Total Transactions"
              value={storedWallet.transactionsCount}
            />
            <InfoCard
              title="Total Withdrawn"
              value={storedWallet.totalWithdraw}
            />
            <InfoCard
              title="Total Deposited"
              value={storedWallet.totalDeposited}
            />
            <InfoCard
              title="Total Balance"
              value={storedWallet.balance.toFixed(3)}
            />
          </div>
          <TransactionsTable
            transactions={storedTransactions}
            currency={storedWallet.currency}
          />
        </div>
      </div>
    </div>
  );
}
