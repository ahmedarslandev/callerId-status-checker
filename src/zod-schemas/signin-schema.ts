import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ message: "Enter valid email" })
    .email({ message: "Enter valid email" }),
  password: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
});
