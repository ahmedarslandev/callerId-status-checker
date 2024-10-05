
type FieldName = "email" | "password";

interface FormFieldData {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: string;
}

export const signInfields: FormFieldData[] = [
  { name: "email", label: "Email", placeholder: "exapmle@gmail.com" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
];