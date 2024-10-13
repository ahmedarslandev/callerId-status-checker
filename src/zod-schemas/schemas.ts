import { z } from "zod";


export const SignUpSchema = z.object({
  username: z
  .string({ message: "Enter valid username" })
  .min(3, { message: "Username must at least 3 characters" })
  .max(30, { message: "Username must not longer than 30 characters long." }),
  email: z
    .string({ message: "Enter valid email" })
    .email({ message: "Enter valid email" }),
  password: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
  confirmPassword: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
});


export const SignInSchema = z.object({
  email: z
    .string({ message: "Enter valid email" })
    .email({ message: "Enter valid email" }),
  password: z
    .string({ message: "Enter valid password" })
    .min(8, { message: "Password must at least 8 characters" })
    .max(20, { message: "Password must not longer than 20 characters long." }),
});

export const CodeVerificationSchema = z.object({
  verifyCode: z
    .string({ message: "Enter valid verify code" })
    .min(6,{message:"Enter valid verify code"}).max(6 ,{message:"Enter valid verify code"})
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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

export const newPasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters long."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirmation do not match.",
  path: ["confirmPassword"],
});

export const profileEditSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Name must at least 3 characters" })
    .max(20, { message: "Name must not longer than 20 characters" }),
  email: z.string().min(11,{message:"Email must at least 11 characters"}).max(50, { message: "Email must not longer than 50 characters" }),
  bio: z
    .string()
    .max(300, { message: "Bio must not longer than 300 characters" }),
});

export const withdrawalSchema = z.object({
  amount: z.string({ message: "Enter valid amount" }).min(1).max(10000),
  bankAccount: z
    .string({ message: "Enter valid bank account" })
    .min(10)
    .max(15),
  accountHolderName: z.string().min(3).max(50),
  bank: z.string({ message: "Enter valid bank" }),
});

export const depositeSchema = z.object({
  bankName: z.string(),
  file: z.any(),
});



