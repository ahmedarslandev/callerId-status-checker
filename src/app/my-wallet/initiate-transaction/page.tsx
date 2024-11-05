"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { depositeSchema } from "@/zod-schemas/schemas";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import ButtonLoader from "@/components/ButtonLoder";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DepositProcess = () => (
  <div className="bg-muted rounded-lg p-8">
    <h2 className="text-2xl font-bold mb-4">Deposit Process</h2>
    <div className="space-y-4">
      <ProcessStep title="Processing Time">
        Deposits are typically processed within 2-3 business days.
      </ProcessStep>
      <ProcessStep title="Fees">
        There is a $1 fee for each deposit, deducted from the deposit amount.
      </ProcessStep>
      <ProcessStep title="Limits">
        The maximum deposit amount is $10,000 per day. You can make up to 5 deposits per month.
      </ProcessStep>
    </div>
  </div>
);

const ProcessStep = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-muted-foreground">{children}</p>
  </div>
);

export default function Component() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<any | null>(null);

  const form = useForm({
    resolver: zodResolver(depositeSchema),
    defaultValues: {
      bankName: "",
      file: null,
    },
  });

  const { handleSubmit, control, watch, formState: { errors } } = form;
  const selectedBank = watch("bankName");

  useEffect(() => {
    const bank = paymentGateways.find((e) => e.bankName === selectedBank);
    setBankDetails(bank ? bank.details : null);
  }, [selectedBank]);

  const onSubmit = async (values: any) => {
    const file = values.file;

    if (!file) {
      return toast({
        title: "Error",
        description: "Please upload a screenshot of your transaction.",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/u/initiate-transaction", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: data.success ? "Success" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });

      if (data.success) {
        router.replace("/my-wallet/success");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit deposit request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

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
                                  <img
                                    src={e.icon}
                                    alt={e.bankName}
                                    className="w-7 h-7 object-cover rounded-full"
                                  />
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
                    <p><strong>Account Holder Name:</strong> {bankDetails.name}</p>
                    <p><strong>Account Number:</strong> {bankDetails.number}</p>
                    <p><strong>Bank Name:</strong> {selectedBank}</p>
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
                          accept="image/*"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            field.onChange(selectedFile);
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

                <ButtonLoader isLoading={isLoading} name="Request Deposit" />
              </form>
            </Form>
          </div>
          <DepositProcess />
        </div>
      </div>
    </div>
  );
}
