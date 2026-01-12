import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: any;
  setSearch: (patch: Partial<Record<string, any>>) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  limit: number;
  searchFields: Array<{ label: string; value: string }>;
  searchOperators: Array<{ label: string; value: string }>;
  filterFields: Array<{ label: string; value: string }>;
  sortByFields: Array<{ label: string; value: string }>;
}

export function FiltersDialog({
  open,
  onOpenChange,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  limit,
  searchFields,
  searchOperators,
  filterFields,
  sortByFields,
}: FiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit max-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            Refine your user list by applying search, filters, and sorting options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Search</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Select
                value={search.searchField ?? ""}
                onValueChange={(v) => setSearch({ searchField: v || undefined, offset: 0 })}>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchFields.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={search.searchOperator ?? ""}
                  onValueChange={(v) => setSearch({ searchOperator: v || undefined, offset: 0 })}
                  disabled={!search.searchField}>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchOperators.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Search value…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={!search.searchField}
              />
            </div>
          </div>

          {/* Page Size */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Page Size</h3>
            <Select
              value={String(limit)}
              onValueChange={(v) => setSearch({ limit: Number(v), offset: 0 })}>
              <SelectTrigger className="min-w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Filter by Field</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Select
                  value={(search.filterField as string | undefined) ?? ""}
                  onValueChange={(v) =>
                    setSearch({
                      filterField: v || undefined,
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
                  value={(search.filterOperator as string | undefined) ?? ""}
                  onValueChange={(v) => setSearch({ filterOperator: v || undefined, offset: 0 })}
                  disabled={!search.filterField}>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["eq", "contains", "ne", "lt", "lte", "gt", "gte"] as const).map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Filter value…"
                value={String(search.filterValue ?? "")}
                onChange={(e) => setSearch({ filterValue: e.target.value, offset: 0 })}
                disabled={!search.filterField}
              />
            </div>
          </div>

          {/* Sort Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Sort by</h3>
            <div className="flex gap-2">
              <Select
                value={(search.sortBy as string | undefined) ?? ""}
                onValueChange={(v) => setSearch({ sortBy: v || undefined, offset: 0 })}>
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
                onValueChange={(v) =>
                  setSearch({ sortDirection: v === "asc" ? "asc" : "desc", offset: 0 })
                }>
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
