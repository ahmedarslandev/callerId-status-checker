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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ButtonLoder from "@/components/ButtonLoder";

export default function Component() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<{
    number: string;
    name: string;
  } | null>(null);

  const form = useForm<z.infer<typeof depositeSchema>>({
    resolver: zodResolver(depositeSchema),
    defaultValues: {
      bankName: "",
      transactionId: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  const selectedBank = watch("bankName");

  // Update bank details when the selected bank changes
  useEffect(() => {
    const bank = paymentGateways.find((e: any) => e.bankName === selectedBank);
    if (bank) {
      setBankDetails({ number: bank.details.number, name: bank.details.name });
    } else {
      setBankDetails(null);
    }
  }, [selectedBank]);

  async function onSubmit(values: z.infer<typeof depositeSchema>) {
    setIsLoading(true);
    try {
      // Handle form submission
      console.log(values);
      // Simulate a loading state and response
      // setTimeout(() => {
      //   toast({
      //     title: "Success",
      //     description: "Deposit request submitted.",
      //   });
      //   // Optionally, redirect to another page or reset form
      //   // router.push("/success");
      // }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="container w-full border border-zinc-300 rounded-lg mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Deposit Funds</h1>
            <p className="text-muted-foreground mb-8">
              Request a deposit from your account balance.
            </p>
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
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Bank..." />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentGateways.map((e, i) => (
                              <SelectItem key={i} value={e.bankName}>
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
                <p className="text-xs">
                  Send the amount in this account and paste the transactionId
                  below.
                </p>
                <FormField
                  control={control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Transaction ID</FormLabel>
                      <FormControl>
                        <Input
                          id="transactionId"
                          type="transactionId"
                          placeholder="Enter transaction ID"
                          {...field}
                        />
                      </FormControl>
                      {errors.transactionId && (
                        <FormDescription className="text-red-500">
                          {errors.transactionId.message}
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
