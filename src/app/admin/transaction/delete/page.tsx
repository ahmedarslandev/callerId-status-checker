"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Transaction } from "@/models/transaction.model";
import ButtonLoader from "@/components/ButtonLoder";
import { DownloadIcon, ShareIcon } from "lucide-react";

export default function Component() {
  const router = useRouter();
  const params = useSearchParams();
  const transactionId = params.get("transactionId");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransaction = useCallback(async () => {
    try {
      const response = await axios.post("/api/admin/transactions", { transactionId });

      if (!response.data.success) {
        return toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
      }
      setTransaction(response.data.transaction);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
  }, [transactionId]);

  useEffect(() => {
    if (transactionId) fetchTransaction();
  }, [fetchTransaction, transactionId]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.patch("/api/admin/transactions", { transactionId });

      if (!res.data.success) {
        return toast({
          title: "Error",
          description: res.data.message,
          duration: 5000,
        });
      }
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
        duration: 5000,
      });
      router.replace("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
    setIsLoading(false);
  };

  if (!transaction) return <div>Loading...</div>;

  return (
    <Card className="w-full border-none">
      <CardHeader className="bg-muted/50 px-6 py-7">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Transaction Details</h2>
            <p className="text-sm text-red-400 text-muted-foreground">
              Warning! This transaction is also deleted from the client.
            </p>
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
          <DetailItem label="Transaction ID" value={transaction._id} />
          <DetailItem label="Wallet ID" value={transaction.wallet_id.toString()} />
          <DetailItem label="Amount" value={`$${transaction.amount}`} isPrimary />
          <DetailItem label="Transaction Type" value={transaction.type} />
          <DetailItem label="Status" value={transaction.status} isStatus />
          <DetailItem label="Timestamp" value={new Date(transaction.timeStamp).toLocaleString()} />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem label="Source" value={transaction.from} />
          <DetailItem label="Destination" value={transaction.to} />
          <DetailItem label="Bank Account Details" value={`${transaction.accountHolderName}\n${transaction.bankAccount}\n${transaction.bank}`} />
        </div>
        <ButtonLoader
          onClick={handleDelete}
          name="Delete transaction"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

const DetailItem = ({ label, value, isPrimary, isStatus }:any) => (
  <div className="space-y-1">
    <div className={`text-sm font-medium ${isPrimary ? "text-primary" : ""}`}>
      {label}
    </div>
    <div className={`text-sm ${isStatus ? "text-green-500" : "text-muted-foreground"}`}>
      {value}
    </div>
  </div>
);
