"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "@/components/ui";
import ButtonLoder from "@/components/ButtonLoder";
import { useRouter } from "next/navigation";
import { updateTransactions } from "@/store/reducers/admin.reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { paymentGateways } from "@/lib/banks";
import { getUsers } from "@/api-calls/api-calls";
import { User } from "@/models/user.model";

const FormField = ({ label, id, ...props }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...props} />
  </div>
);

const SelectField = ({ label, id, options, onValueChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
const SelectBankField = ({ label, id, options, onValueChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: any) => (
          <SelectItem
            className="flex gap-2"
            key={option.bankName}
            value={option.bankName}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 overflow-hidden rounded-full">
                <img
                  src={option.icon}
                  data-src={option.icon}
                  className="lazyload object-cover"
                  alt={option.bankName}
                />
              </div>
              <p>{option.bankName}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const getCurrentLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export default function Component() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    comment: "",
    userId: "",
    amount: "",
    transactionType: "",
    status: "completed",
    sender: "admin",
    recipient: "",
    timestamp: getCurrentLocalDateTime(),
    bankAccountNumber: "",
    bankAccountHolder: "",
    bankName: "",
    image: File,
  });
  const [usersOptions, setUsersOptions] = useState([]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleValueChange = (field: any) => (value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataObject = new FormData();
    formDataObject.append("userId", formData.userId);
    formDataObject.append("comment", formData.comment);
    formDataObject.append("amount", formData.amount);
    formDataObject.append("transactionType", formData.transactionType);
    formDataObject.append("status", formData.status);
    formDataObject.append("sender", formData.sender);
    formDataObject.append("recipient", formData.recipient);
    formDataObject.append("timestamp", formData.timestamp);
    formDataObject.append("bankAccountNumber", formData.bankAccountNumber);
    formDataObject.append("bankAccountHolder", formData.bankAccountHolder);
    formDataObject.append("bankName", formData.bankName);

    if (formData.image) {
      formDataObject.append("image", formData.image as any);
    }

    try {
      const res = await axios.post(
        "/api/admin/new-transaction",
        formDataObject,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success === false) {
        toast({
          title: "Error",
          description: res.data.message,
          duration: 5000,
          variant: "destructive",
        });
        return;
      }

      dispatch(
        updateTransactions({
          transaction: res.data.transaction,
          transactionId: res.data.transaction._id,
        })
      );
      router.replace("/admin");

      toast({
        title: "Success",
        description: res.data.message,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUsers().then((users) => {
      const options = users.map((user: User) => ({
        label: user.username,
        value: user._id,
      }));
      setUsersOptions(options);
    });
  }, []);

  return (
    <div className="flex justify-center items-center w-full ">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle>Create New Transaction</CardTitle>
          <CardDescription>
            Fill out the form to add a new transaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label={"User"}
                id={"userId"}
                options={usersOptions}
                onValueChange={handleValueChange("userId")}
              />
              <FormField
                label="Amount"
                id="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Transaction Type"
                id="transactionType"
                options={[
                  { value: "deposit", label: "Deposit" },
                  { value: "withdrawal", label: "Withdrawal" },
                ]}
                onValueChange={handleValueChange("transactionType")}
              />
              <FormField
                label="Status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Sender"
                id="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="Enter sender"
                disabled
              />
              <FormField
                label="Recipient"
                id="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="Enter recipient"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Timestamp"
                id="timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={handleChange}
              />
              <FormField
                label="Bank Account Number"
                id="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Account Holder"
                id="bankAccountHolder"
                value={formData.bankAccountHolder}
                onChange={handleChange}
                placeholder="Enter account holder"
              />
              <SelectBankField
                label="Select Bank"
                id="bankName"
                options={paymentGateways}
                onValueChange={handleValueChange("bankName")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-3 flex-col w-full">
                <FormField
                  label="Comment"
                  id="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Enter comment"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="space-y-2">
                  <Label className="space-y-2" htmlFor="file">
                    Select Image (Optional)
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        image: e.target?.files?.[0] as any,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <ButtonLoder
                type="submit"
                name="Create Transaction"
                isLoading={isLoading}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
