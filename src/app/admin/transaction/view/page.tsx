"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Transaction } from "@/models/transaction.model";

export default function Component() {
  const params = useSearchParams();
  const transactionId = params.get("transactionId");

  const [transaction, setTransactions] = useState<Transaction | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!transactionId) return; // Ensure transactionId is available

    try {
      const response = await axios.post("/api/admin/transactions", {
        transactionId,
      });

      if (!response.data.success) {
        return toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
      }
      setTransactions(response.data.transaction);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
  }, [transactionId]); // Include `transactionId` in dependency array

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // Use `fetchFiles` as the dependency

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full border-none">
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
      </CardContent>
    </Card>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
