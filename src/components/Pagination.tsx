import React from "react";
import {
  Button,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui";

export function PaginationContent({
  totalPages,
  currentPage,
  onPageChange,
}: any) {
  return (
    <div className="flex justify-center gap-1 items-center w-full">
      {Array.from({ length: totalPages }).map((_, i) => {
        if (i === 0) {
          if (i + 1 == currentPage) {
            return (
              <PaginationItem className="list-none" key={i}>
                <Button variant={i + 1 == currentPage ? "default" : "outline"}>
                  {i + 1}
                </Button>
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem className="list-none" key={i}>
                <PaginationPrevious
                  href="#"
                  onClick={() => onPageChange(currentPage - 1)}
                />
              </PaginationItem>
            );
          }
        } else if (i <= 2 || i === totalPages - 1) {
          if (currentPage > i + 2) {
            return null;
          } else {
            return (
              <PaginationItem className="list-none" key={i}>
                <Button
                  variant={i + 1 == currentPage ? "default" : "outline"}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            );
          }
        } else if (i >= 3) {
          if (i + 1 == currentPage) {
            return (
              <PaginationItem className="list-none" key={i}>
                <Button variant={i + 1 == currentPage ? "default" : "outline"}>
                  {i + 1}
                </Button>
              </PaginationItem>
            );
          }
          if (i === 3) {
            return (
              <PaginationItem className="list-none" key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        }
        return null;
      })}
      {currentPage < totalPages ? (
        <PaginationItem className="list-none">
          <PaginationNext
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      ) : null}
    </div>
  );
}
