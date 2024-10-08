"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { paymentGateways } from "@/lib/banks";
import { depositeSchema } from "@/zod-schemas/deposite.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import ButtonLoder from "@/components/ButtonLoder";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Component() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<any | null>(null);

  // Always call hooks, even if we later conditionally render the JSX
  const form = useForm({
    resolver: zodResolver(depositeSchema),
    defaultValues: {
      bankName: "",
      file: null,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;
  const selectedBank = watch("bankName");

  useEffect(() => {
    const bank = paymentGateways.find((e) => e.bankName === selectedBank);
    let details: any = bank ? bank.details : null;
    setBankDetails(details);
  }, [selectedBank]);

  const onSubmit = async (values: any) => {
    const file = values.file; // Get file from form data
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a screenshot of your transaction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData: any = new FormData();
      formData.append("file", file); // Appending file from form values

      const { data } = await axios.post(
        "/api/u/initiate-transaction",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: data.success ? "Success" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });

      if (data.success) {
        router.replace("/my-wallet/success");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to submit deposit request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Conditionally render the JSX, but ensure hooks are called before this
  if (!user) {
    router.replace("/");
    return null; // Prevent component from rendering without user data
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="container w-full border border-zinc-300 rounded-lg mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Deposit</h1>
            <p>Step 1: Select Bank.</p>
            <p>Step 2: Send payment to bank.</p>
            <p>Step 3: Take a screenshot of the transaction.</p>
            <p>Step 4: Upload the screenshot below.</p>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Bank</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Bank..." />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentGateways.map((e) => (
                              <SelectItem key={e.bankName} value={e.bankName}>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 flex items-center rounded-full overflow-hidden">
                                    <img
                                      data-src={e.icon}
                                      className="object-cover lazyload"
                                      src={e.icon}
                                      alt={e.bankName}
                                    />
                                  </div>
                                  <p>{e.bankName}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {errors.bankName && (
                        <FormDescription className="text-red-500">
                          {errors.bankName.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                {bankDetails && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-semibold">Bank Details</h2>
                    <p>
                      <strong>Bank Name:</strong> {selectedBank}
                    </p>
                    <p>
                      <strong>Account Number:</strong> {bankDetails.number}
                    </p>
                    <p>
                      <strong>Account Holder Name:</strong> {bankDetails.name}
                    </p>
                  </div>
                )}

                <FormField
                  control={control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Transaction Screenshot</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const selectedFile: any = e.target.files?.[0];
                            field.onChange(selectedFile); // Updates the form state with the selected file
                          }}
                        />
                      </FormControl>
                      {errors.file && (
                        <FormDescription className="text-red-500">
                          {errors.file.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <ButtonLoder isLoading={isLoading} name="Request Deposit" />
              </form>
            </Form>
          </div>
          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Deposit Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Processing Time</h3>
                <p className="text-muted-foreground">
                  Deposits are typically processed within 2-3 business days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Fees</h3>
                <p className="text-muted-foreground">
                  There is a $1 fee for each deposit. This fee is deducted from
                  the deposit amount.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Limits</h3>
                <p className="text-muted-foreground">
                  The maximum deposit amount is $10,000 per day. You can make up
                  to 5 deposits per month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}