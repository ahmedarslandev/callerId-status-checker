"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTransaction } from "@/api-calls/api-calls";

const isProduction = process.env.NODE_ENV === "production";

export default function TransactionPage({
  params,
}: {
  params: { userId: string; transactionId: string };
}) {
  const [transaction, setTransaction] = useState<any | null>();
  const [hasImage, setHasImage] = useState(false);
  const [activeTab, setActiveTab] = useState(hasImage ? "Picture" : "Details");

  useEffect(() => {
    getTransaction(params.transactionId).then((transaction) => {
      setTransaction(transaction);
      transaction.imageUrl ? setHasImage(true) : null;
    });
  }, []);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  // Determine if the image exists

  // Tabs state, default to 'Picture' if the image exists, otherwise 'Details'

  return (
    <div className="w-full h-full">
      <Card className="w-full border-none shadow-none mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link
              href={`/admin/users/${params.userId}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to User
            </Link>
          </div>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Transaction ID: {transaction._id}</CardDescription>
        </CardHeader>

        <CardContent className="h-full">
          {/* Tabs for Picture and Details */}
          <div className="mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "Picture" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveTab("Picture")}
              disabled={!hasImage} // Disable picture tab if no image is available
            >
              Picture
            </button>
            <button
              className={`px-4 py-2 ml-4 ${
                activeTab === "Details" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveTab("Details")}
            >
              Details
            </button>
          </div>

          {/* Picture Tab Content */}
          {activeTab === "Picture" && hasImage && (
            <div className="w-full h-full max-h-60vh flex justify-center items-center">
              <div className="p-3  overflow-hidden flex justify-center items-center flex-col w-[45%] h-full max-h-[60vh]">
                <div className="w-fit h-full cursor-pointer border-zinc-200 border-[1px] shadow-md overflow-hidden rounded-sm">
                  <img
                    src={isProduction ? `http://157.90.174.166:5000${transaction.imageUrl}` : `http://localhost:5000${transaction.imageUrl}`}
                    alt="Transaction Screenshot"
                    className="w-fit rounded-sm h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Details Tab Content */}
          {activeTab === "Details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <p>{transaction.amount}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p>{transaction.type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p>{transaction.status}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{transaction.timeStamp.toLocaleString()}</p>
              </div>
              <div>
                <Label>From</Label>
                <p>{transaction.from}</p>
              </div>
              <div>
                <Label>To</Label>
                <p>{transaction.to}</p>
              </div>
              <div>
                <Label>Bank Account</Label>
                <p>{transaction.bankAccount}</p>
              </div>
              <div>
                <Label>Account Holder</Label>
                <p>{transaction.accountHolderName}</p>
              </div>
              <div>
                <Label>Bank</Label>
                <p>{transaction.bank}</p>
              </div>
              <div>
                <Label>BBT</Label>
                <p>
                  <span className="font-bold">$</span>{" "}
                  {transaction.BBT.toFixed(3)}
                </p>
              </div>
              <div>
                <Label>BAT</Label>
                <p>
                  <span className="font-bold">$</span>{" "}
                  {transaction.BAT.toFixed(3)}
                </p>
              </div>
            </div>
          )}

          {/* If no image exists and the user clicks on the "Picture" tab, show a message */}
          {activeTab === "Picture" && !hasImage && (
            <p>No picture available for this transaction.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
