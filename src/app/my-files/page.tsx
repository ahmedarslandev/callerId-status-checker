"use client";

import {
  Input,
  Button,
  Card,
  CardContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  useToast,
} from "@/components/ui/index";
import { useEffect, useState, useCallback } from "react";
import { FileIcon } from "@/components/admin/icons";
import { FileTypeIcon, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { setFiles as setStoreFiles } from "@/store/reducers/user.reducer";
import {
  FilterDropdown,
  getStatusClass,
  SortDropdown,
} from "@/components/icons/others";
import { fetchFiles } from "@/api-calls/api-calls";
import { File } from "@/models/file.model";

export default function Component() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();

  const { user, files: storedFiles } = useSelector((state: any) => ({
    user: state.user,
    files: state.userInfo.files,
  }));

  // Redirect to home if no user is logged in
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  // Refresh file list
  const refreshFiles = useCallback(async () => {
    setIsRefreshing(true);
    const newFiles = await fetchFiles(toast);
    setFiles(newFiles);
    dispatch(setStoreFiles({ files: newFiles }));
    setIsRefreshing(false);
  }, []);

  // Load files on initial render or refresh
  useEffect(() => {
    if (storedFiles.length > 0) {
      setFiles(storedFiles);
    } else {
      refreshFiles();
    }
  }, []);

  if (!files) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center p-4 md:p-16">
      <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
        <header className="bg-background border-b px-4 sm:px-6 flex justify-between items-center h-14">
          <h1 className="text-lg md:text-xl font-semibold">Files</h1>
          <Button onClick={refreshFiles} variant="outline">
            <RefreshCcw
              className={`rotate-180 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </header>
        <main className="flex-1 py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <Input
              type="search"
              placeholder="Search files..."
              className="w-full rounded-lg bg-background pl-8"
            />
            <div className="flex items-center gap-2 md:gap-4">
              <FilterDropdown />
              <SortDropdown />
            </div>
          </div>

          {files.length === 0 ? (
            <div className="flex p-10 justify-center items-center w-full">
              <p className="text-xs">You don&apos;t have any uploaded files</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {files.map((file, index) => (
                <a
                  key={index}
                  href={
                    file.status === "completed"
                      ? `http://localhost:5000/download/${file.owner}/${file.filename}_Completed.${file.extentionName}`
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
                        {Math.round(file.size / 1000)} KB
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
          )}

          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </div>
  );
}
