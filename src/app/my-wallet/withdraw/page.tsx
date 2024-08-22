"use client";

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
import { useRouter } from "next/navigation";
import { paymentGateways } from "@/lib/banks";
import { withdrawalSchema } from "@/zod-schemas/withdrawal.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { useState } from "react";
import ButtonLoder from "@/components/ButtonLoder";

export default function Component() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
      bankAccount: "",
      accountHolderName: "",
      bank: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  async function onSubmit(values: z.infer<typeof withdrawalSchema>) {
    setIsLoading(true);
    // Handle form submission
    console.log(values);
    // Simulate a loading state and response
    // setTimeout(() => {
    //   toast({
    //     title: "Success",
    //     description: "Withdrawal request submitted.",
    //   });
    //   router.push("/success");
    // }, 1000);
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-10">
      <div className="container w-full border border-zinc-300 rounded-lg mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Withdraw Funds</h1>
            <p className="text-muted-foreground mb-8">
              Request a withdrawal from your account balance.
            </p>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          id="accountHolderName"
                          placeholder="Enter account Name"
                          {...field}
                        />
                      </FormControl>
                      {errors.accountHolderName && (
                        <FormDescription className="text-red-500">
                          {errors.accountHolderName.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Withdrawal Amount</FormLabel>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          min="0"
                          step="1"
                          {...field}
                        />
                      </FormControl>
                      {errors.amount && (
                        <FormDescription className="text-red-500">
                          {errors.amount.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Number</FormLabel>
                      <FormControl>
                        <Input
                          id="bankAccount"
                          placeholder="Enter account number"
                          {...field}
                        />
                      </FormControl>
                      {errors.bankAccount && (
                        <FormDescription className="text-red-500">
                          {errors.bankAccount.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Bank</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => field.onChange(value)} // Update form state on selection change
                          value={field.value} // Display the selected value
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
                      {errors.bank && (
                        <FormDescription className="text-red-500">
                          {errors.bank.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <ButtonLoder isLoading={isLoading} name="Request Withdrawal" />
              </form>
            </Form>
          </div>
          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Withdrawal Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Processing Time</h3>
                <p className="text-muted-foreground">
                  Withdrawals are typically processed within 2-3 business days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Fees</h3>
                <p className="text-muted-foreground">
                  There is a $1 fee for each withdrawal. This fee is deducted
                  from the withdrawal amount.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Limits</h3>
                <p className="text-muted-foreground">
                  The maximum withdrawal amount is $10,000 per day. You can make
                  up to 5 withdrawals per month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
