type FieldName = "email" | "password" | "username" | "confirmPassword";

interface FormFieldData {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: string;
}

export const SignUpfields: FormFieldData[] = [
  { name: "username", label: "Username", placeholder: "Jhon Doe" },
  { name: "email", label: "Email", placeholder: "exapmle@gmail.com" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    placeholder: "********",
  },
];