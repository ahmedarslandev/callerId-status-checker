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
import html2canvas from "html2canvas";

const openShareMenu = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Check this out!",
        text: "Here is something interesting I wanted to share with you.",
        url: window.location.href, // or any other URL you want to share
      })
      .then(() => console.log("Successfully shared"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing is not supported in this browser.");
  }
};

const captureAndDownloadScreenshot = () => {
  const element = document.getElementById("capture"); // ID of the element to capture

  html2canvas(element as HTMLElement).then((canvas) => {
    // Convert the canvas to a data URL
    const imgURL = canvas.toDataURL("image/png");

    // Create a temporary link to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = imgURL;
    downloadLink.download = "screenshot.png"; // Name of the downloaded file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
};
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
    <div
      id="capture"
      className="flex justify-center items-center w-full h-full p-10"
    >
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
              <Button
                onClick={captureAndDownloadScreenshot}
                variant="outline"
                size="icon"
              >
                <DownloadIcon className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button onClick={openShareMenu} variant="outline" size="icon">
                <ShareIcon className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {/* Transaction Details */}
          <div className="md:grid grid-cols-2 gap-4 hidden md:grid-cols-3">
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
          <Separator className="hidden md:block" />
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
                Balance Before Transaction (<span className="text-blue-600 underline">BBT</span>)
              </div>
              <div className="text-sm text-muted-foreground">
                ${transaction.BBT.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Balance After Transaction (<span className="text-blue-600 underline">BAT</span>)
              </div>
              <div className="text-sm text-muted-foreground">
                ${transaction.BAT.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Comment (<span className="text-blue-600 underline">More information</span>)
              </div>
              <div className="text-sm text-muted-foreground">
                {transaction.comment}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
