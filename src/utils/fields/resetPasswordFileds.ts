type ResetPasswordFieldName = "OTP" | "newPassword" | "confirmPassword";

interface FormFieldData {
  name: ResetPasswordFieldName;
  label: string;
  placeholder: string;
  type?: string;
}

export const resetPasswordFields: FormFieldData[] = [
  { name: "OTP", label: "Verify code", placeholder: "12345" },
  {
    name: "newPassword",
    label: "New password",
    type: "password",
    placeholder: "********",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "********",
  },
];
