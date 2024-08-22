"use client";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function Component() {
  const theme: any = useTheme();
  const [files, setFiles] = useState<File[] | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get("/api/u/file");

      if (response.data.success === false) {
        return toast({
          title: "Error",
          description: response.data.message,
          duration: 5000,
        });
      }
      setFiles(response.data.files);
      console.log(response.data, files);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 5000,
      });
    }
  }, []); // No dependencies in this case

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // Use `fetchFiles` as the dependency

  if (!files) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center items-center p-4 md:p-16">
        <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
          <header className="bg-background border-b px-4 sm:px-6 flex items-center h-14">
            <h1 className="text-lg md:text-xl font-semibold">Files</h1>
          </header>
          <main className="flex-1 py-6 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md mb-4 md:mb-0">
                <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                  <SearchIcon className="w-4 h-4" />
                </div>
                <Input
                  type="search"
                  placeholder="Search files..."
                  className="w-full rounded-lg bg-background pl-8"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FilterIcon className="w-4 h-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="name">
                      <DropdownMenuRadioItem value="name">
                        Name
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="type">
                        Type
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="size">
                        Size
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ListOrderedIcon className="w-4 h-4" />
                      <span>Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Sort order</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="asc">
                      <DropdownMenuRadioItem value="asc">
                        Ascending
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="desc">
                        Descending
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {files?.length > 0 &&
                files.map((file: any, index: any) => (
                  <Link legacyBehavior key={index} href={`/uploads/${file.owner}/${file.filename}_Completed.${file.extentionName}`}
                  passHref
                  >
                    <a
                      download
                      key={index}
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
                            <span
                              className={`${
                                file.status == "completed"
                                  ? "text-green-500"
                                  : file.status == "processing"
                                  ? "text-blue-500"
                                  : file.status == "failed"
                                  ? "text-red-500"
                                  : "text-black"
                              }`}
                            >
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
    </>
  );
}

function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FileTypeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 13v-1h6v1" />
      <path d="M12 12v6" />
      <path d="M11 18h2" />
    </svg>
  );
}

function FilterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16" />
      <path d="M6 8h12" />
      <path d="M8 12h8" />
      <path d="M10 16h4" />
      <path d="M12 20h0" />
    </svg>
  );
}

function ListOrderedIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h13" />
      <path d="M3 12h9" />
      <path d="M3 18h6" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
