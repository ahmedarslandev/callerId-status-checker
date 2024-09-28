"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { getFile } from "@/api-calls/api-calls";
import axios from "axios";
import Link from "next/link";

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

export default function FileDetailsPage({
  params,
}: {
  params: { fileId: string };
}) {
  const [file, setFile] = useState<any>(null);
  useEffect(() => {
    getFile(params.fileId).then((file: any) => {
      setFile(file);
    });
  }, []);

  if (!file) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full h-full">
      <Card className="w-full h-full border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link
              href={`/admin/users/${file.owner}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to User
            </Link>
          </div>
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
              <p>{file.size}</p>
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
          <Link
            href={`http://localhost:5000/download/${file.owner}/${file.filename}_Completed.${file.extentionName}`}
          >
            <Button className="mt-6">
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
