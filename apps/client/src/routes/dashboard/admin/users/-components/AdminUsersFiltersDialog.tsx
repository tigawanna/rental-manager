import { FiltersDialog } from "@/components/admin/shared/FiltersDialog";
import { type NavigateOptions } from "@tanstack/react-router";

interface AdminUsersFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: Record<string, any>;
  navigate: (opts: NavigateOptions<any>) => void;
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
  navigate,
  searchFields,
  searchOperators,
}: AdminUsersFiltersDialogProps) {
  return (
    <FiltersDialog
      open={open}
      onOpenChange={onOpenChange}
      search={search}
      navigate={navigate}
      searchFields={searchFields}
      searchOperators={searchOperators}
      filterFields={filterFields}
      sortByFields={sortByFields}
    />
  );
}
