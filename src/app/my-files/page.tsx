"use client";

import { Input, Button, useToast } from "@/components/ui/index";
import { useEffect, useReducer, useCallback, useMemo } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setFiles as setStoreFiles } from "@/store/reducers/user.reducer";
import { FilterDropdown, SortDropdown } from "@/components/icons/others";
import { fetchFiles } from "@/api-calls/api-calls";
import { PaginationContent } from "@/components/Pagination";
import FileListMapper from "@/components/layout/my-files/FilesCardMapper";
import { reducer, initialState } from "@/store/useReducer/store/store";
import { actionTypes } from "@/types/myfiles.reducer.types";
import Link from "next/link";

export default function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    files,
    copiedFiles,
    isRefreshing,
    selectedSort,
    search,
    filterSelected,
    currentPage,
    filesAtOnePage,
    totalPages,
  } = state;

  const router = useRouter();
  const reduxDispatch = useDispatch();
  const { toast } = useToast();
  const { user, files: storedFiles } = useSelector((state: any) => ({
    user: state.user,
    files: state.userInfo.files,
  }));

  // Handle user redirect if not logged in
  useEffect(() => {
    if (!user) router.replace("/sign-in");
  }, [user]);

  // Memoize pagination logic to prevent unnecessary recalculations
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * filesAtOnePage;
    const end = currentPage * filesAtOnePage;
    return copiedFiles?.slice(start, end) || [];
  }, [copiedFiles, currentPage, filesAtOnePage]);

  // Dispatch paginated files
  useEffect(() => {
    dispatch({ type: actionTypes.SET_FILES, payload: paginatedFiles });
  }, [paginatedFiles]);

  // Handle page change and recalculate files
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page });
      }
    },
    [totalPages]
  );

  // Refresh file list
  const refreshFiles = useCallback(async () => {
    dispatch({ type: actionTypes.SET_REFRESHING, payload: true });
    const newFiles = await fetchFiles(toast);

    reduxDispatch(setStoreFiles({ files: newFiles }));
    dispatch({ type: actionTypes.SET_COPIED_FILES, payload: newFiles });
    dispatch({
      type: actionTypes.SET_TOTAL_PAGES,
      payload: Math.ceil(newFiles.length / filesAtOnePage),
    });

    handlePageChange(1);
    dispatch({ type: actionTypes.SET_REFRESHING, payload: false });
  }, [reduxDispatch, toast, handlePageChange, filesAtOnePage]);

  // Handle search input
  const onSearchChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      dispatch({ type: actionTypes.SET_SEARCH, payload: value });

      if (value.length === 0) {
        handlePageChange(1); // Reset search
      } else {
        const filteredFiles = copiedFiles?.filter((file: any) =>
          (file?.[filterSelected] || "").toString().includes(value)
        );
        dispatch({ type: actionTypes.SET_FILES, payload: filteredFiles });
      }
    },
    [filterSelected, copiedFiles, handlePageChange]
  );

  // Handle sorting
  const onSelectedChange = useCallback(
    (sortKey: any) => {
      dispatch({ type: actionTypes.SET_SORT, payload: sortKey });

      const sortedFiles = [...files]?.sort((a: any, b: any) => {
        const aValue = a?.[sortKey];
        const bValue = b?.[sortKey];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }
        return bValue - aValue;
      });
      dispatch({ type: actionTypes.SET_FILES, payload: sortedFiles });
    },
    [files]
  );

  // Handle filter change
  const onFilterSelectedChange = (filter: any) => {
    dispatch({ type: actionTypes.SET_FILTER, payload: filter });
  };

  // Initial file load or refresh
  useEffect(() => {
    if (storedFiles.length > 0) {
      dispatch({ type: actionTypes.SET_COPIED_FILES, payload: storedFiles });
      dispatch({
        type: actionTypes.SET_TOTAL_PAGES,
        payload: Math.ceil(storedFiles.length / filesAtOnePage),
      });
    } else {
      refreshFiles();
    }
  }, [storedFiles, filesAtOnePage, refreshFiles]);

  return (
    <div className="flex justify-center items-center p-4 md:p-16">
      <div className="flex flex-col w-full min-h-screen border border-zinc-300 rounded-lg">
        <header className="bg-background border-b px-4 sm:px-6 flex justify-between items-center h-14">
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold">Files</h1>
          </div>
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
                onChange={onSearchChange}
                type="search"
                placeholder="Search files..."
                className="flex h-10  px-6 py-2 text-sm w-full shadow-none outline-none border-none"
              />
              <div
                onClick={() => onSearchChange({ target: { value: search } })}
                className="flex px-4 w-fit justify-center items-center bg-zinc-200 active:scale-90 cursor-pointer h-full"
              >
                <Search className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-center items-center w-fit gap-1 h-full">
              <FilterDropdown
                selected={filterSelected}
                onChange={onFilterSelectedChange}
              />
              <SortDropdown
                selected={selectedSort}
                onChange={onSelectedChange}
              />
            </div>
          </div>
          <FileListMapper files={files} />
          {files?.length === 0 && <p className="text-center">No files found</p>}
          <PaginationContent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
