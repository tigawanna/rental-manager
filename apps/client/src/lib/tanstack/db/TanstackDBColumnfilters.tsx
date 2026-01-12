import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type Collection } from "@tanstack/db";
import { type NavigateOptions } from "@tanstack/react-router";
import { ArrowDownAZ, ArrowUpZA, SlidersHorizontal } from "lucide-react";
import { useCallback, useTransition } from "react";
import { CollectionColumns, ColumnConfig } from "./sortable-columns";



interface TanstackDBColumnFiltersProps<
  TCollection extends Collection<any, any>,
  TColumns extends CollectionColumns<TCollection> = CollectionColumns<TCollection>,
> {
  /** The TanStack DB collection to derive columns from */
  collection: TCollection;
  /** 
   * Optional: Specify which columns are sortable with custom labels.
   * If not provided, you must specify sortableColumns.
   */
  sortableColumns: Array<ColumnConfig<TColumns>>;
  /** Current search params from the route */
  search: {
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    [key: string]: unknown;
  };
  /** Navigate function from useNavigate */
  navigate: (opts: NavigateOptions<any>) => void;
  /** Default sort column (defaults to first sortable column) */
  defaultSortBy?: TColumns;
  /** Default sort direction (defaults to "desc") */
  defaultSortDirection?: "asc" | "desc";
}

/**
 * A generic component for TanStack DB collection column-based filtering/sorting.
 * Derives available columns from the collection schema and integrates with
 * TanStack Router search params.
 * 
 * @example
 * ```tsx
 * <TanstackDBColumnFilters
 *   collection={organizationsCollection}
 *   sortableColumns={[
 *     { value: "name", label: "Name" },
 *     { value: "createdAt", label: "Created At" },
 *     { value: "slug", label: "Slug" },
 *   ]}
 *   search={search}
 *   navigate={navigate}
 * />
 * ```
 */
export function TanstackDBColumnFilters<
  TCollection extends Collection<any, any>,
  TColumns extends CollectionColumns<TCollection> = CollectionColumns<TCollection>,
>({
  sortableColumns,
  search,
  navigate,
  defaultSortBy,
  defaultSortDirection = "desc",
}: TanstackDBColumnFiltersProps<TCollection, TColumns>) {
  const [, startTransition] = useTransition();

  const currentSortBy = (search.sortBy as TColumns) ?? defaultSortBy ?? sortableColumns[0]?.value;
  const currentSortDirection = search.sortDirection ?? defaultSortDirection;

  const setSearch = useCallback(
    (patch: Partial<Record<string, unknown>>) => {
      startTransition(() => {
        navigate({
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            ...patch,
          }),
          replace: true,
        });
      });
    },
    [navigate]
  );

  const handleSortByChange = (value: string) => {
    setSearch({ sortBy: value, offset: 0 });
  };

  const handleSortDirectionToggle = () => {
    setSearch({
      sortDirection: currentSortDirection === "asc" ? "desc" : "asc",
      offset: 0,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Sort</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort by</label>
            <Select value={currentSortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {sortableColumns.map((column) => (
                  <SelectItem key={column.value} value={column.value}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Direction</label>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSortDirectionToggle}>
              {currentSortDirection === "asc" ? (
                <>
                  <ArrowDownAZ className="h-4 w-4" />
                  Ascending
                </>
              ) : (
                <>
                  <ArrowUpZA className="h-4 w-4" />
                  Descending
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Inline sort button variant - more compact for toolbars
 */
export function TanstackDBSortSelect<
  TCollection extends Collection<any, any>,
  TColumns extends CollectionColumns<TCollection> = CollectionColumns<TCollection>,
>({
  sortableColumns,
  search,
  navigate,
  defaultSortBy,
  defaultSortDirection = "desc",
}: TanstackDBColumnFiltersProps<TCollection, TColumns>) {
  const [, startTransition] = useTransition();

  const currentSortBy = (search.sortBy as TColumns) ?? defaultSortBy ?? sortableColumns[0]?.value;
  const currentSortDirection = search.sortDirection ?? defaultSortDirection;

  const setSearch = useCallback(
    (patch: Partial<Record<string, unknown>>) => {
      startTransition(() => {
        navigate({
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            ...patch,
          }),
          replace: true,
        });
      });
    },
    [navigate]
  );

  return (
    <div className="flex items-center gap-1">
      <Select
        value={currentSortBy}
        onValueChange={(value) => setSearch({ sortBy: value, offset: 0 })}>
        <SelectTrigger className="w-35 h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortableColumns.map((column) => (
            <SelectItem key={column.value} value={column.value}>
              {column.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() =>
          setSearch({
            sortDirection: currentSortDirection === "asc" ? "desc" : "asc",
            offset: 0,
          })
        }>
        {currentSortDirection === "asc" ? (
          <ArrowDownAZ className="h-4 w-4" />
        ) : (
          <ArrowUpZA className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

