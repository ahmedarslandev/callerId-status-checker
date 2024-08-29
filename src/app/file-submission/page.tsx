"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx"; // Import the XLSX library
import DialogBox from "@/components/DialogBox";
import { useEffect, useState, useCallback } from "react";
import ButtonLoder from "@/components/ButtonLoder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

interface FileData {
  file: File | null;
  numberOfCallerIds: number;
}

export default function Page() {
  const { replace } = useRouter();

  const router = useRouter();
  const { status } = useSession();
  const isUser = isAuthenticated(status);
  if (!isUser) {
    router.replace("/sign-in");
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState<FileData>({
    file: null,
    numberOfCallerIds: 0,
  });

  const form = useForm();

  const onSubmit = useCallback(async (values: any) => {
    const file: File | null = values.file?.[0] || null;

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        toast({
          title: "Error",
          description: "Failed to read file",
          duration: 5000,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const callerIds: any = json.slice(1);

      for (let i = 0; i < callerIds.length; i++) {
        const callerId = callerIds[i][0];
        if (!/^\d{10}$/.test(callerId)) {
          toast({
            title: "Invalid Caller ID",
            description: `Invalid caller ID at row ${
              i + 2
            }. Ensure all IDs are 10 digits and there are no empty rows.`,
            duration: 5000,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      setFileData({ file, numberOfCallerIds: callerIds.length });
      setIsOpen(true);
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  return (
    <div className="flex p-4 md:p-14 justify-center h-fit min-h-screen items-center">
      <DialogBox isOpen={isOpen} setIsOpen={setIsOpen} fileData={fileData} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full md:w-[60%] border-zinc-400 rounded p-4 md:p-6 flex flex-col justify-center gap-4"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select file</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx, .xlsm, .csv"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Select an Excel file of your callerId that you want to check.
                </FormDescription>
              </FormItem>
            )}
          />
          <ButtonLoder name={"Upload"} isLoading={isLoading} />
        </form>
      </Form>
    </div>
  );
}
