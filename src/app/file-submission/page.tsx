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
import * as XLSX from "xlsx";
import DialogBox from "@/components/DialogBox";
import { useEffect, useState, useCallback } from "react";
import ButtonLoder from "@/components/ButtonLoder";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui";

interface FileData {
  file: File | null;
  numberOfCallerIds: number;
  externalCallerIds: string[];
}

export default function Page() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user) as any;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textArea, setTextArea] = useState("");
  const [fileData, setFileData] = useState<FileData>({
    file: null,
    numberOfCallerIds: 0,
    externalCallerIds: [],
  });

  const form = useForm();

  // Redirect to home if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setTextArea(text);

      const callerIds = text
        .split("\n")
        .map((id) => id.trim())
        .filter((id) => /^\d{10,11}$/.test(id)); // Ensure IDs are exactly 10 digits

      setFileData((prev) => ({
        ...prev,
        externalCallerIds: callerIds,
      }));
    },
    []
  );

  const onSubmit = useCallback(
    async (values: any) => {
      const file: File | null = values.file?.[0] || null;
  
      // If no file is selected, notify the user but still proceed with existing caller IDs
      if (!file) {
        toast({
          title: "Warning",
          description: "No file selected, proceeding with existing caller IDs.",
          duration: 5000,
          variant: "destructive",
        });
      }
  
      setIsLoading(true);
  
      // If a file is selected, read and process it
      if (file) {
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
  
          const callerIdsFromFile = json.slice(1).map((row: any) => row[0]); // Extract caller IDs from file
  
          // Combine externalCallerIds from text area and callerIdsFromFile
          const combinedCallerIds = [
            ...callerIdsFromFile,
            ...fileData.externalCallerIds,
          ];
  
          // Validate all IDs
          const invalidCallerId = combinedCallerIds.find(
            (id) => !/^\d{10,11}$/.test(id)
          );
          if (invalidCallerId) {
            toast({
              title: "Invalid Caller ID",
              description: `Caller ID '${invalidCallerId}' is invalid. Ensure all IDs are 10 digits.`,
              duration: 5000,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
  
          // Prepare updated data for the new sheet
          const updatedData = [
            ["Caller ID"],
            ...combinedCallerIds.map((id) => [id]),
          ]; // Include header row
          const updatedSheet = XLSX.utils.aoa_to_sheet(updatedData);
  
          // Create a new workbook with the updated sheet
          const newWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            newWorkbook,
            updatedSheet,
            "UpdatedCallerIDs"
          );
  
          // Generate a new Blob from the updated workbook
          const updatedWorkbookBlob = XLSX.write(newWorkbook, {
            bookType: "xlsx",
            type: "array",
          });
  
          // Create a new file from the Blob
          const updatedFile = new File([updatedWorkbookBlob], file.name, {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
  
          // Update the fileData with the new file
          setFileData({
            file: updatedFile,
            numberOfCallerIds: combinedCallerIds.length,
            externalCallerIds: combinedCallerIds,
          });
  
          setIsOpen(true);
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        // If no file is selected, process only the externalCallerIds
        const combinedCallerIds = [...fileData.externalCallerIds];
  
        // Validate all IDs
        const invalidCallerId = combinedCallerIds.find(
          (id) => !/^\d{10,11}$/.test(id)
        );
        if (invalidCallerId) {
          toast({
            title: "Invalid Caller ID",
            description: `Caller ID '${invalidCallerId}' is invalid. Ensure all IDs are 10 digits.`,
            duration: 5000,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
  
        // Prepare updated data for the new sheet
        const updatedData = [
          ["Caller ID"],
          ...combinedCallerIds.map((id) => [id]),
        ]; // Include header row
        const updatedSheet = XLSX.utils.aoa_to_sheet(updatedData);
  
        // Create a new workbook with the updated sheet
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          newWorkbook,
          updatedSheet,
          "UpdatedCallerIDs"
        );
  
        // Generate a new Blob from the updated workbook
        const updatedWorkbookBlob = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        });
  
        // Create a new file from the Blob
        const updatedFile = new File([updatedWorkbookBlob], `${new Date().toISOString().split("T").slice(0,8)}.xlsx`, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        // Update the fileData with the new file
        setFileData({
          file: updatedFile,
          numberOfCallerIds: combinedCallerIds.length,
          externalCallerIds: combinedCallerIds,
        });
  
        setIsOpen(true);
        setIsLoading(false);
      }
    },
    [fileData.externalCallerIds]
  );
  

  return (
    <div className="flex p-4 md:p-14 justify-center h-fit min-h-screen items-center">
      <DialogBox isOpen={isOpen} setIsOpen={setIsOpen} fileData={fileData} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1px] w-full md:w-[60%] border-zinc-400 rounded p-4 md:p-6 flex flex-col justify-center"
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
                <FormDescription className="text-sm">
                  Select an Excel file
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="w-full h-fit flex justify-center gap-3 py-3 items-center">
            <div className="w-full h-[1px] bg-zinc-300"></div>
            <p className="text-xs font-bold">OR</p>
            <div className="w-full h-[1px] bg-zinc-300"></div>
          </div>
          <FormField
            control={form.control}
            name="textArea"
            render={() => (
              <FormItem>
                <FormLabel>Paste DIDs</FormLabel>
                <FormControl>
                  <Textarea value={textArea} onChange={handleTextAreaChange} />
                </FormControl>
                <FormDescription>
                  One per line
                </FormDescription>
              </FormItem>
            )}
          />
          <ButtonLoder name="Upload" isLoading={isLoading} className={"mt-6"} />
        </form>
      </Form>
    </div>
  );
}
