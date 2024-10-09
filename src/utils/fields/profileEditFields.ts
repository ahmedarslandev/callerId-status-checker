type FieldName = "email" | "username" | "bio";

interface FormFieldData {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: string;
}

export const profileEditFields: FormFieldData[] = [
  {
    name: "username",
    placeholder: "Jhon Doe",
    type: "text",
    label: "Username",
  },
  { name: "email", label: "Email", placeholder: "exapmle@gmail.com" },
  {
    name: "bio",
    label: "Bio",
    type: "text",
    placeholder: "Some information about yourself (Bio)",
  },
];
