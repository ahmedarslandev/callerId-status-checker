import { z } from "zod";

export const depositeSchema = z.object({
  bankName: z.string(),
  file: z.any(),
});
