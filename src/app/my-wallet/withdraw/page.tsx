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
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { useState } from "react";
import ButtonLoader from "@/components/ButtonLoder";
import axios from "axios";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";
import Image from "next/image";

export default function WithdrawFunds() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isUser = isAuthenticated();
  if (!isUser) {
    router.replace("/sign-in");
  }

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
    formState: { errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof withdrawalSchema>) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/u/withdraw", values);
      if (!data.success) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
      });

      setTimeout(() => {
        router.replace("/my-wallet/success");
      }, 2000);
    } catch {
      toast({
        title: "Error",
        description:
          "Failed to submit withdrawal request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 md:p-10">
      <div className="container mx-auto border border-zinc-300 rounded-lg px-6 py-12 md:py-20 w-full">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Withdraw Funds</h1>
            <p className="mb-8 text-muted-foreground">
              Request a withdrawal from your account balance.
            </p>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {[
                  {
                    label: "Account Holder Name",
                    name: "accountHolderName",
                    placeholder: "Enter account name",
                  },
                  {
                    label: "Withdrawal Amount",
                    name: "amount",
                    placeholder: "Enter amount",
                    type: "number",
                    min: 0,
                    step: 1,
                  },
                  {
                    label: "Bank Account Number",
                    name: "bankAccount",
                    placeholder: "Enter account number",
                  },
                ].map(({ label, name, placeholder, type, min, step }) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            id={name}
                            placeholder={placeholder}
                            type={type}
                            min={min}
                            step={step}
                            {...field}
                          />
                        </FormControl>
                        {errors[name as keyof typeof form.formState.errors] && (
                          <FormDescription className="text-red-500">
                            {
                              errors[name as keyof typeof form.formState.errors]
                                ?.message
                            }
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Bank</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Bank..." />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentGateways.map(({ bankName, icon }: any) => (
                              <SelectItem key={bankName} value={bankName}>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 overflow-hidden rounded-full">
                                    <Image
                                      src={icon}
                                      data-src={icon}
                                      className="lazyload object-cover"
                                      alt={bankName}
                                    />
                                  </div>
                                  <p>{bankName}</p>
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

                <ButtonLoader isLoading={isLoading} name="Request Withdrawal" />
              </form>
            </Form>
          </div>

          <div className="p-8 bg-muted rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">Withdrawal Process</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Processing Time",
                  description:
                    "Withdrawals are typically processed within 2-3 business days.",
                },
                {
                  title: "Fees",
                  description:
                    "There is a $1 fee for each withdrawal. This fee is deducted from the withdrawal amount.",
                },
                {
                  title: "Limits",
                  description:
                    "The maximum withdrawal amount is $10,000 per day. You can make up to 5 withdrawals per month.",
                },
              ].map(({ title, description }) => (
                <div key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
