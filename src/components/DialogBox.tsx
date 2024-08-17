import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "./ui/use-toast";
import axios from "axios";

export default function DialogBox({
  isOpen,
  setIsOpen,
  fileData,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  fileData: any;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={async () => {
        setIsOpen(false);
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("callerIds", fileData.numberOfCallerIds);
        try {
          const response = await axios.post(
            "/api/u/file",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          if (response.data.success == false) {
            return toast({
              title: "Error",
              description: response.data.message,
              duration: 5000,
            });
          }
          return toast({
            title: "Success",
            description: "File uploaded successfully",
            duration: 5000,
          });
        } catch (error) {
          console.error("Error:", error);
          return toast({
            title: "Error",
            description: "An error occurred while uploading the file.",
            duration: 5000,
          });
        }
      }}
    >
      {/* Conditionally render the DialogTrigger button only when isOpen is false */}
      {!isOpen && <DialogTrigger asChild></DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>CallerIds: {fileData.numberOfCallerIds}</DialogTitle>
          <DialogDescription>
            You will have to pay ${Math.round(fileData.numberOfCallerIds * 0.1)}{" "}
            for these callerIds
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Proceed
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
