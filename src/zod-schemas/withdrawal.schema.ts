import { z } from "zod";

export const withdrawalSchema = z.object({
  amount: z.string({ message: "Enter valid amount" }).min(1).max(10000),
  bankAccount: z
    .string({ message: "Enter valid bank account" })
    .min(10)
    .max(15),
  accountHolderName: z.string().min(3).max(50),
  bank: z.string({ message: "Enter valid bank" }),
});
