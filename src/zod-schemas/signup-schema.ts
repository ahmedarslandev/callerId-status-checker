import { z } from "zod";

export const SignUpSchema = z.object({
  username: z
  .string({ message: "Enter valid username" })
  .min(3, { message: "Username must at least 3 characters" })
  .max(30, { message: "Username must not longer than 30 characters long." }),
  email: z
    .string({ message: "Enter valid email" })
    .email({ message: "Enter valid email" }),
  phoneNo: z
    .string({ message: "Enter valid phone number" })
    .min(9, { message: "Phone number must at least 9 characters long." }),
  password: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
  confirmPassword: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
});
