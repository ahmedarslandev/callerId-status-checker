import { z } from "zod";

export const resetPasswordSchema = z.object({
  OTP: z
    .string({ message: "Enter valid new verify code" })
    .min(6, { message: "Password must at least 6 characters" })
    .max(6, { message: "Password must not longer than 6 characters long." }),
  newPassword: z
    .string({ message: "Enter valid new password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
  confirmPassword: z
    .string({ message: "Confirm password should match the new password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
});
