"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Transaction } from "@/models/transaction.model";
import { DownloadIcon, ShareIcon } from "@/components/admin/icons";

export default function TransactionPage() {
   const params = useSearchParams(); // Fetch search params from the URL
  const transactionId = params.get("transactionId") || null; // Default to null if not present

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const fetchTransaction = useCallback(async () => {
    if (!transactionId) return; // Ensure transactionId is available

    try {
      const response = await axios.post("/api/u/transactions", {
        transactionId,
      });

      if (!response.data.success) {
        return toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
      }

      setTransaction(response.data.transaction || null); // Handle case where transaction might be null
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
  }, [transactionId]);

  useEffect(() => {
    fetchTransaction(); // Fetch transaction data when the component mounts
  }, [fetchTransaction]);

  if (!transaction) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  return (
    <div className="flex justify-center items-center w-full h-full p-10">
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-muted/50 px-6 py-7">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-medium">Transaction Details</div>
              <div className="text-sm text-muted-foreground">
                View the details of your recent transaction.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <DownloadIcon className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button variant="outline" size="icon">
                <ShareIcon className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Transaction ID</div>
              <div className="text-sm text-muted-foreground">
                {String(transaction._id)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Wallet ID</div>
              <div className="text-sm text-muted-foreground">
                {transaction.wallet_id.toString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Amount</div>
              <div className="text-sm font-medium text-primary">
                ${transaction.amount}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Transaction Type</div>
              <div className="text-sm text-muted-foreground">
                {transaction.type}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm text-green-500">{transaction.status}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Timestamp</div>
              <div className="text-sm text-muted-foreground">
                {new Date(transaction.timeStamp).toLocaleString()}
              </div>
            </div>
          </div>
          {/* Additional Transaction Information */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Source</div>
              <div className="text-sm text-muted-foreground">
                {transaction.from}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Destination</div>
              <div className="text-sm text-muted-foreground">
                {transaction.to}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Bank Account Details</div>
              <div className="text-sm text-muted-foreground">
                {transaction.accountHolderName}
                <br />
                {transaction.bankAccount}
                <br />
                {transaction.bank}
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Balance Before Transaction (BBT)
              </div>
              <div className="text-sm text-muted-foreground">
                ${transaction.BBT.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Balance After Transaction (BAT)
              </div>
              <div className="text-sm text-muted-foreground">
                ${transaction.BAT.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
