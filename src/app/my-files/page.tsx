"use client";

import {
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FileIcon } from "@/components/admin/icons";
import {
  FileTypeIcon,
  FilterIcon,
  ListOrderedIcon,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/auth.store";
import { setFiles as setStoreFiles } from "@/store/reducers/user.reducer";

const fetchFiles = async (toast: any) => {
  try {
    const { data } = await axios.get("/api/u/file");
    if (!data.success) {
      toast({ title: "Error", description: data.message, duration: 5000 });
      return;
    }
    return data.files;
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong",
      duration: 5000,
    });
  }
};

export default function Component() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();

  const { user } = useSelector((state: any) => state.user) as any;
  const { files: Files } = useSelector((state: any) => state.userInfo) as any;

  if (!user) {
    router.replace("/");
  }

  const refreshFiles = async () => {
    setIsRefreshing(true);
    const newFiles = await fetchFiles(toast);
    setFiles(newFiles);
    dispatch(setStoreFiles({ files: newFiles }));
    setIsRefreshing(false);
    return;
  };

  useEffect(() => {
    if (Files.length > 0) {
      setFiles(Files);
    } else {
      fetchFiles(toast).then((files) => {
        setFiles(files);
        dispatch(setStoreFiles({ files: files }));
      });
    }
  }, []);

  if (!files) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center p-4 md:p-16">
      <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
        <header className="bg-background border-b px-4 sm:px-6 flex justify-between items-center h-14">
          <h1 className="text-lg md:text-xl font-semibold">Files</h1>
          <Button onClick={refreshFiles} variant={"outline"}>
            <RefreshCcw
              className={`rotate-180 ${isRefreshing ? "animate-spin" : null}`}
            />
          </Button>
        </header>
        <main className="flex-1 py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md mb-4 md:mb-0">
              <Input
                type="search"
                placeholder="Search files..."
                className="w-full rounded-lg bg-background pl-8"
              />
            </div>
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
              {files.map((file: any, index) => (
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
                        <FileIcon className="w-4 h-4 mr-1 inline" />
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

function FilterDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4" />
          <span>Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="name">
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ListOrderedIcon className="w-4 h-4" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="asc">
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getStatusClass(status: any) {
  return status === "completed"
    ? "text-green-500"
    : status === "processing"
    ? "text-blue-500"
    : status === "failed"
    ? "text-red-500"
    : "text-black";
}
