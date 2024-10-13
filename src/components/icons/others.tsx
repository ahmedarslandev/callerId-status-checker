import { FilterIcon, ListOrderedIcon, Search } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";

interface SortDropdownProps {
  selected: string;
  onChange: (value: string) => void;
}

export function getStatusClass(status: any) {
  return status === "completed"
    ? "text-green-500"
    : status === "processing"
    ? "text-blue-500"
    : status === "failed"
    ? "text-red-500"
    : "text-black";
}

// SortDropdown.tsx

export function SortDropdown({ selected, onChange }: SortDropdownProps | any) {
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
        <DropdownMenuRadioGroup value={selected} onValueChange={onChange}>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="realname">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="lastModefied">Date</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="noOfCallerIds">
            Caller ids
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="status">Staus</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FilterDropdownProps {
  selected: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({
  selected,
  onChange,
}: FilterDropdownProps | any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Search by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selected} onValueChange={onChange}>
          <DropdownMenuRadioItem value="_id">Id</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="realname">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="noOfCallerIds">
            Caller ids
          </DropdownMenuRadioItem>{" "}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
