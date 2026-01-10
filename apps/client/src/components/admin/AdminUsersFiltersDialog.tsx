import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface AdminUsersFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: any;
  setSearch: (patch: Partial<Record<string, any>>) => void;
}

const filterFields = [
  { label: "Role", value: "role" },
  { label: "Email Verified", value: "emailVerified" },
  { label: "Banned", value: "banned" },
];

const sortByFields = [
  { label: "Created", value: "createdAt" },
  { label: "Updated", value: "updatedAt" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
];

export function AdminUsersFiltersDialog({ open, onOpenChange, search, setSearch }: AdminUsersFiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Filter by Field</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Select
                  value={(search.filterField as string | undefined) ?? undefined}
                  onValueChange={(v) =>
                    setSearch({
                      filterField: v,
                      filterOperator: undefined,
                      filterValue: undefined,
                      offset: 0,
                    })
                  }>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Filter field" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterFields.map((f) => (
                      <SelectItem key={String(f.value)} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={(search.filterOperator as string | undefined) ?? undefined}
                  onValueChange={(v) => setSearch({ filterOperator: v, offset: 0 })}
                  disabled={!search.filterField}>
                  <SelectTrigger className="min-w-36">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {( ["eq", "contains", "ne", "lt", "lte", "gt", "gte"] as const ).map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  className="min-w-48"
                  placeholder="Filter value…"
                  value={String(search.filterValue ?? "")}
                  onChange={(e) => setSearch({ filterValue: e.target.value, offset: 0 })}
                  disabled={!search.filterField}
                />
              </div>
            </div>
          </div>

          {/* Sort Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Sort by</h3>
            <div className="flex gap-2">
              <Select
                value={(search.sortBy as string | undefined) ?? undefined}
                onValueChange={(v) => setSearch({ sortBy: v, offset: 0 })}>
                <SelectTrigger className="min-w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortByFields.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={(search.sortDirection as "asc" | "desc") ?? "desc"}
                onValueChange={(v) => setSearch({ sortDirection: v as any, offset: 0 })}>
                <SelectTrigger className="min-w-28">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset & Done */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setSearch({
                  searchValue: undefined,
                  searchField: undefined,
                  searchOperator: undefined,
                  filterField: undefined,
                  filterOperator: undefined,
                  filterValue: undefined,
                  sortBy: "createdAt",
                  sortDirection: "desc",
                  offset: 0,
                });
                onOpenChange(false);
              }}>
              Reset
            </Button>

            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
