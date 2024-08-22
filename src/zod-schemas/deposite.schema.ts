import { z } from "zod";

export const depositeSchema = z.object({
  bankName: z.string(),
  transactionId: z.string().min(10).max(30),
});
