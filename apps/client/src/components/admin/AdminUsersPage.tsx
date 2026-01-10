import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminUsersQueryOptions,
  AdminUsersQueryOptionsParams,
} from "@/data-access-layer/users/admin-suers";
import { useDebouncedValue } from "@/hooks/use-debouncer";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowUpRightIcon, FolderCode, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminUsersFiltersDialog } from "./AdminUsersFiltersDialog";

interface AdminUsersPageProps {}

const searchFields = [
  { label: "Email", value: "email" as const },
  { label: "Name", value: "name" as const },
];

const searchOperators = [
  { label: "Contains", value: "contains" as const },
  { label: "Starts with", value: "starts_with" as const },
  { label: "Ends with", value: "ends_with" as const },
];

const sortByFields = [
  { label: "Created", value: "createdAt" },
  { label: "Updated", value: "updatedAt" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
];

const filterFields = [
  { label: "Role", value: "role" },
  { label: "Email Verified", value: "emailVerified" },
  { label: "Banned", value: "banned" },
];

function useUsersSearch() {
  // Read current route search values
  // Types come from validateSearch in the route definition
  const search = useSearch({ strict: false })
  const navigate = useNavigate();

  function setSearch(patch: Partial<Record<keyof typeof search, any>>) {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,

    });
  }

  return { search, setSearch } as const;
}

export function AdminUsersPage({}: AdminUsersPageProps) {
  const { search, setSearch } = useUsersSearch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(search.searchValue ?? "");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { debouncedValue } = useDebouncedValue(searchInput, 400);

  // Apply debounced search to URL
  // Keep operator/field stable from current search
  const effectiveParams: AdminUsersQueryOptionsParams = useMemo(
    () => ({
      ...search,
      searchValue: debouncedValue || undefined,
    }),
    [search, debouncedValue]
  );

  const query = useQuery(adminUsersQueryOptions(effectiveParams));

  if (query.error || query.data?.error) {
    return (
      <div className="min-h-screen h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>No users Yet</EmptyTitle>
            <EmptyDescription>
              Error: {String(query.error?.message ?? query.data?.error?.message)}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create User</Button>
            </div>
          </EmptyContent>
          <Button variant="link" asChild className="text-muted-foreground" size="sm">
            <a href="#">
              Learn More <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </div>
    );
  }
  if (!query.data?.data) {
    return (
      <div className="min-h-screen mx-auto p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>No users Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create Project</Button>
              <Button variant="outline">Import Project</Button>
            </div>
          </EmptyContent>
          <Button variant="link" asChild className="text-muted-foreground" size="sm">
            <a href="#">
              Learn More <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </div>
    );
  }

  const usersList = query.data?.data?.users ?? [];
  const total = query.data?.data?.total ?? 0;
  const limit = (search.limit as number) ?? 10;
  const offset = (search.offset as number) ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and filter users in your application</p>
        </div>

        <div>
          <Button onClick={() => navigate({ to: '/dashboard/admin/users/new' })}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        {/* Search Section */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Select
              value={search.searchField ?? undefined}
              onValueChange={(v) => setSearch({ searchField: v, offset: 0 })}>
              <SelectTrigger className="min-w-36">
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
              value={search.searchOperator ?? undefined}
              onValueChange={(v) => setSearch({ searchOperator: v, offset: 0 })}>
              <SelectTrigger className="min-w-36">
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

            <Input
              className="min-w-64"
              placeholder="Search value…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1" />

        <AdminUsersFiltersDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          search={search}
          setSearch={setSearch}
        />

        {/* Page Size */}
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm text-muted-foreground">Page size</label>
          <div className="flex gap-2 items-center">
            <Select
              value={String(limit)}
              onValueChange={(v) => setSearch({ limit: Number(v), offset: 0 })}>
              <SelectTrigger className="w-24">
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
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">Role</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Loading users…
                </TableCell>
              </TableRow>
            ) : (usersList ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <RoleIcons role={(u.role as any) ?? "tenant"} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{u.name ?? "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="space-x-2">
                    {u.emailVerified ? (
                      <Badge variant="outline">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                    {u.banned ? <Badge variant="destructive">Banned</Badge> : null}
                    {u.role ? <Badge variant="outline">{u.role}</Badge> : null}
                  </TableCell>
                  <TableCell title={String(u.createdAt ?? "")}>
                    {u.createdAt ? getRelativeTimeString(new Date(u.createdAt)) : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {total > 0 ? (
            <span>
              Showing <span className="font-medium">{offset + 1}</span>–
              <span className="font-medium">{Math.min(offset + limit, total)}</span> of {total}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (page <= 1) return;
                  setSearch({ offset: Math.max(0, offset - limit) });
                }}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(pageCount, 7) }).map((_, i) => {
              // Simple window around current page
              const start = Math.max(1, Math.min(page - 3, pageCount - 6));
              const p = start + i;
              if (p > pageCount) return null;
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setSearch({ offset: (p - 1) * limit });
                    }}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                aria-disabled={page >= pageCount}
                onClick={(e) => {
                  e.preventDefault();
                  if (page >= pageCount) return;
                  setSearch({ offset: offset + limit });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
