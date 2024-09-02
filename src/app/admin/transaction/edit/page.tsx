"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Transaction } from "@/models/transaction.model";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { DownloadIcon, ShareIcon } from "lucide-react"; // Moved icons to a separate file
import { AppDispatch } from "@/store/auth.store";
import { useDispatch } from "react-redux";
import { updateTransactions } from "@/store/reducers/admin.reducer";

export default function TransactionDetails() {
  const params = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const transactionId = params.get("transactionId");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [status, setStatus] = useState<string>("");

  const fetchTransactionDetails = useCallback(async () => {
    try {
      const response = await axios.post("/api/admin/transactions", {
        transactionId,
      });

      if (!response.data.success) {
        toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
        return;
      }

      setTransaction(response.data.transaction);
      setStatus(response.data.transaction.status);
    } catch (error: any) {
      console.log(error, error.message);
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
  }, [transactionId]);

  useEffect(() => {
    fetchTransactionDetails();
  }, [fetchTransactionDetails]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await axios.put("/api/admin/transactions", {
        transactionId,
        status: newStatus,
      });

      if (!response.data.success) {
        toast({
          title: "Error",
          description: response.data.message,
          duration: 3000,
        });
        return;
      }
      setStatus(newStatus);
      dispatch(
        updateTransactions({
          transaction: response.data.transaction,
          transactionId: response.data.transaction._id,
          type: "update",
        })
      );
      toast({
        title: "Success",
        description: response.data.message,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update status",
        duration: 3000,
      });
    }
  };

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
          <DetailItem label="Transaction ID" value={String(transaction._id)} />
          <DetailItem
            label="Wallet ID"
            value={transaction.wallet_id.toString()}
          />
          <DetailItem label="Amount" value={`$${transaction.amount}`} isBold />
          <DetailItem label="Transaction Type" value={transaction.type} />
          <div className="space-y-1">
            <div className="text-sm font-medium">Status</div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem className="text-green-500" value="completed">
                    Completed
                  </SelectItem>
                  <SelectItem className="text-red-500" value="failed">
                    Failed
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DetailItem
            label="Timestamp"
            value={new Date(transaction.timeStamp).toLocaleString()}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem label="Source" value={transaction.from} />
          <DetailItem label="Destination" value={transaction.to} />
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

interface DetailItemProps {
  label: string;
  value: string;
  isBold?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isBold }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium">{label}</div>
    <div
      className={`text-sm ${
        isBold ? "font-medium text-primary" : "text-muted-foreground"
      }`}
    >
      {value}
    </div>
  </div>
);
