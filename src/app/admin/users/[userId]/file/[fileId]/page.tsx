import { ObjectId } from "mongoose";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

// Define the File interface
interface File extends Document {
  _id: string;
  owner: string;
  filename: string;
  filePath: string;
  size: number;
  type: string;
  lastModefied: number;
  noOfCallerIds: number;
  extentionName: string;
  status: string;
  realname: string;
}

// Mock file data
const mockFile = {
  _id: "1",
  owner: "2",
  filename: "important_document.pdf",
  filePath: "/uploads/important_document.pdf",
  size: 1024 * 1024 * 2.5, // 2.5 MB
  type: "application/pdf",
  lastModefied: Date.now() - 86400000, // 1 day ago
  noOfCallerIds: 3,
  extentionName: "pdf",
  status: "active",
  realname: "Important Document.pdf",
};

export default function FileDetailsPage() {
  const file = mockFile; // In a real app, you'd fetch this based on the route parameter

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const handleDownload = () => {
    console.log(`Downloading file: ${file.filename}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{file.realname}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Filename</p>
              <p>{file.filename}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Size</p>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{file.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Modified</p>
              <p>{new Date(file.lastModefied).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p>{file.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Number of Caller IDs
              </p>
              <p>{file.noOfCallerIds}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Extension</p>
              <p>{file.extentionName}</p>
            </div>
          </div>
          <Button className="mt-6" >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
