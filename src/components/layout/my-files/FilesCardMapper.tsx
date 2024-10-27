import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Adjust this import based on your UI library
import { FileIcon } from "@/components/admin/icons";
import { FileTypeIcon,} from "lucide-react";

const isProduction = process.env.NODE_ENV === "production";

const FileListMapper = ({ files }:any) => {
  const getStatusClass = (status:any) => {
    // Define your logic for status classes here
    switch (status) {
      case "completed":
        return "text-green-500"; // Example class for completed
      case "pending":
        return "text-yellow-500"; // Example class for pending
      case "failed":
        return "text-red-500"; // Example class for failed
      default:
        return "text-gray-500"; // Default class for unknown status
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-5">
      {files?.map((file:any, index:any) => (
        <a
          key={index}
          href={
            file.status === "completed"
              ? isProduction ? `https://login.bulkdid.net/download/${file.owner}/${file.filename}_Completed.${file.extentionName}` : `http://localhost:5000/download/${file.owner}/${file.filename}_Completed.${file.extentionName}`
              : "#"
          }
        >
          <Card>
            <CardContent className="grid py-5 gap-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  <FileIcon className="w-4 h-4 mr-2 inline" />
                  {file.realname}
                </div>
                <div className="text-muted-foreground text-sm">
                  <FileTypeIcon className="w-4 h-4 mr-1 inline" />
                  {file.extentionName}
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                Date: {new Date(file.lastModefied).toDateString()}
              </div>
              <div className="text-muted-foreground text-sm">
                Dids: {file.noOfCallerIds}
              </div>
              <div className="text-muted-foreground text-sm">
                Size: {Math.round(file.size / 1000)} KB
              </div>
              <div className="text-muted-foreground text-sm">
                Status:
                <span className={getStatusClass(file.status)}>
                  {" "}
                  {file.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

export default FileListMapper;
