import { FiltersDialog } from "@/components/admin/shared/FiltersDialog";

interface AdminUsersFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: any;
  setSearch: (patch: Partial<Record<string, any>>) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  limit: number;
  searchFields: Array<{ label: string; value: string }>;
  searchOperators: Array<{ label: string; value: string }>;
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

export function AdminUsersFiltersDialog({
  open,
  onOpenChange,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  limit,
  searchFields,
  searchOperators,
}: AdminUsersFiltersDialogProps) {
  return (
    <FiltersDialog
      open={open}
      onOpenChange={onOpenChange}
      search={search}
      setSearch={setSearch}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      limit={limit}
      searchFields={searchFields}
      searchOperators={searchOperators}
      filterFields={filterFields}
      sortByFields={sortByFields}
    />
  );
}
