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
import { useEffect, useState } from "react";
import ButtonLoder from "@/components/ButtonLoder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function page() {
  const { data, status } = useSession();
  const { replace } = useRouter();

  if (status === "unauthenticated") {
    replace("/sign-in");
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState({
    file: null,
    numberOfCallerIds: 0,
  });

  const form = useForm();

  async function onSubmit(values: any) {
    const file: any = values.file[0]!;

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file",
        duration: 5000,
      });
      return;
    }

    // Set loading to true before starting the file processing
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to JSON
        const callerIds: Array<any> = json.slice(1); // Skip header row

        // Validate caller IDs
        for (let i = 0; i < callerIds.length; i++) {
          const callerId = callerIds[i][0]; // Assuming caller IDs are in the first column
          if (!/^\d{10}$/.test(callerId)) {
            toast({
              title: "Invalid Caller ID",
              description: `Invalid caller ID at row no ${
                i + 2
              }.Make sure there are no empty rows`, // +2 accounts for 0-index and header row
              duration: 5000,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        }

        const numberOfCallerIds = callerIds.length;
        setFileData({ file, numberOfCallerIds }); // Set file data
        setIsOpen(true);
      }
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex p-14 justify-center h-fit min-h-screen items-center">
      <DialogBox isOpen={isOpen} setIsOpen={setIsOpen} fileData={fileData} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-[60%] border-zinc-400 rounded p-6 flex flex-col justify-center gap-4"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select file </FormLabel>
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
