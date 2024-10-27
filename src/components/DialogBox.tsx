"use client";
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
import { AppDispatch } from "@/store/auth.store";
import { useDispatch } from "react-redux";
import { updateFiles } from "@/store/reducers/user.reducer";
import { useState } from "react";

export default function DialogBox({
  isOpen,
  setIsOpen,
  fileData,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  fileData: any;
}) {
  const dispatch: AppDispatch = useDispatch();
  const [isProceeded, setIsProceeded] = useState(false);

  const handleProceed = async () => {
    setIsProceeded(true);
    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("callerIds", fileData.numberOfCallerIds);

    try {
      const response = await axios.post("/api/u/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === false) {
        return toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
      }
      dispatch(updateFiles({ type: "add", file: response.data.file }));
      window.location.reload();
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
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => setIsOpen(false)}
    >
      {!isOpen && <DialogTrigger asChild></DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>CallerIds: {fileData.numberOfCallerIds}</DialogTitle>
          <DialogDescription>
            You will have to pay $
            {(fileData.numberOfCallerIds * 0.01).toFixed(2)} for these callerIds
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              onClick={handleProceed}
              type="button"
              variant="secondary"
            >
              Proceed
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
