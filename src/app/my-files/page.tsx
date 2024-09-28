"use client";

import {
  Input,
  Button,
  Card,
  CardContent,
  Pagination,
  useToast,
} from "@/components/ui/index";
import { useEffect, useState, useCallback } from "react";
import { FileIcon } from "@/components/admin/icons";
import { FileTypeIcon, RefreshCcw, Search } from "lucide-react";
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
import { PaginationContent } from "@/components/Pagination";

export default function Component() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [copiedFiles, setCopiedFiles] = useState<File[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState("asc");
  const [search, setSearch] = useState("");
  const [filterSelected, setFilterSelected] = useState("realname");
  const [currentPage, setCurrentPage] = useState(1);
  const [filesAtOnePage, setFilesAtOnePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();
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
    const totalNoOfPages = newFiles.length / filesAtOnePage;
    // setTotalPages(Math.ceil(totalNoOfPages));
    setTotalPages(Math.ceil(totalNoOfPages));
    setCopiedFiles(newFiles);
    setFiles(newFiles);
    dispatch(setStoreFiles({ files: newFiles }));
    handlePageChange(currentPage);
    setIsRefreshing(false);
  }, []);

  const onSelectedChange = (e: any) => {
    setSelected(e);

    setFiles((prev): any => {
      if (!prev) return [];

      return [...prev].sort((a: any, b: any) => {
        const aValue = a?.[e];
        const bValue = b?.[e];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }

        return aValue - bValue; // If numeric comparison is needed
      });
    });
  };

  const onFilterSelectedChange = (e: any) => {
    setFilterSelected(e);
  };

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
    if (!files || !copiedFiles) return;
    if (e.target.value != "" && e.target.value.length > 0) {
      const filteredFiles = copiedFiles.filter((file: any) => {
        const fieldValue = file?.[filterSelected as any] || "";
        return fieldValue.toString().includes(e.target.value);
      });
      setFiles(filteredFiles);
    } else {
      handlePageChange(1)
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return; // Prevent invalid page changes
      setCurrentPage(page);

      // Calculate the start and end index for slicing the array
      const startIndex = (page - 1) * filesAtOnePage;
      const endIndex = page * filesAtOnePage;

      // Slice the copiedFiles array to get the files for the current page
      const paginatedFiles = copiedFiles?.slice(startIndex, endIndex) || [];

      setFiles(paginatedFiles); // Set the paginated files
    },
    [filesAtOnePage, copiedFiles, totalPages]
  );

  useEffect(() => {
    if (storedFiles.length > 0) {
      setCopiedFiles(storedFiles);
      const totalNoOfPages = Math.ceil(storedFiles.length / filesAtOnePage);
      setTotalPages(totalNoOfPages);

      // Immediately set paginated files for the first page
      const paginatedFiles = storedFiles.slice(0, filesAtOnePage);
      setFiles(paginatedFiles);
    } else {
      refreshFiles();
    }
  }, [storedFiles, filesAtOnePage, refreshFiles]);

  // Ensure pagination runs correctly even when refreshing files
  useEffect(() => {
    if (copiedFiles && copiedFiles.length > 0) {
      handlePageChange(currentPage); // Handle pagination on file change
    }
  }, [copiedFiles, currentPage, handlePageChange]);

  const onSubmit = ({ search, searchBy }: any) => {
    if (!files) return;

    const filteredFiles = files.filter((file: any) => {
      const fieldValue = file?.[searchBy] || "";
      return fieldValue.toString().includes(search);
    });
    setFiles(filteredFiles);
  };

  // Load files on initial render or refresh

  if (!files) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center p-4 md:p-16">
      <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
        <header className="bg-background border-b px-4 sm:px-6 flex justify-between items-center h-14">
          <h1 className="text-lg md:text-xl font-semibold">Files</h1>
          <Button
            disabled={isRefreshing}
            onClick={refreshFiles}
            variant="outline"
          >
            <RefreshCcw
              className={`rotate-180 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </header>
        <main className="flex-1 py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between mb-6">
            <div className="w-full h-10 flex justify-center items-center border-zinc-300 border-[1px] overflow-hidden rounded-sm">
              <Input
                value={search}
                onChange={(e) => {
                  onSearchChange(e);
                }}
                type="search"
                placeholder="Search files..."
                className="w-full rounded-lg bg-background pl-8 input-outline-none shadow-none outline-none border-none"
              />
              <div
                onClick={() => onSubmit({ search, searchBy: filterSelected })}
                className="py-3 px-3 cursor-pointer active:scale-90 bg-zinc-100 w-fit h-fit"
              >
                <Search className="w-5 " />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FilterDropdown
                selected={filterSelected}
                onChange={onFilterSelectedChange}
              />
              <SortDropdown selected={selected} onChange={onSelectedChange} />
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
              <PaginationContent
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </Pagination>
          </div>
        </main>
      </div>
    </div>
  );
}
