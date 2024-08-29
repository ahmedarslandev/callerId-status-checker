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
import { FileTypeIcon, FilterIcon, ListOrderedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";
import { useSession } from "next-auth/react";

const fetchFiles = async (setFiles: any, toast: any) => {
  try {
    const { data } = await axios.get("/api/u/file");
    if (!data.success) {
      toast({ title: "Error", description: data.message, duration: 5000 });
      return;
    }
    setFiles(data.files);
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
  const toast = useToast();
  const router = useRouter();

  const { status } = useSession();
  const isUser = isAuthenticated(status);
  if (!isUser) {
    router.replace("/sign-in");
  }

  useEffect(() => {
    fetchFiles(setFiles, toast);
  }, []);

  if (!files) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center p-4 md:p-16">
      <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
        <header className="bg-background border-b px-4 sm:px-6 flex items-center h-14">
          <h1 className="text-lg md:text-xl font-semibold">Files</h1>
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
                <Link
                  key={index}
                  href={
                    file.status === "completed"
                      ? `/uploads/${file.owner}/${file.filename}_Completed.${file.extentionName}`
                      : "#"
                  }
                  passHref
                  legacyBehavior
                >
                  <a download>
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
                </Link>
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
