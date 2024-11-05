
type FieldName = "email" | "password";

interface FormFieldData {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: string;
}

export const signInfields: FormFieldData[] = [
  { name: "email", label: "Email", placeholder: "Enter email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
];