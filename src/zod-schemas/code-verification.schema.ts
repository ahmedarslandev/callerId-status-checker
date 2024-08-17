import { z } from "zod";

export const CodeVerificationSchema = z.object({
  verifyCode: z
    .string({ message: "Enter valid verify code" })
    .min(6,{message:"Enter valid verify code"}).max(6 ,{message:"Enter valid verify code"})
});
