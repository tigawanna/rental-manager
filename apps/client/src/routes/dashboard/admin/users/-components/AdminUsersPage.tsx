import { UserRowCard } from "@/components/admin/shared/UserRowCard";
import { UserRowTable } from "@/components/admin/shared/UserRowTable";
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


function useUsersSearch() {
  // Read current route search values
  // Types come from validateSearch in the route definition
    const search = useSearch({ from:"/dashboard/admin/users/" })
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


  // Apply debounced search to URL
  // Keep operator/field stable from current search

  const query = useQuery(adminUsersQueryOptions(search));

  if (query.error || query.data?.error) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
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
    <div className="min-h-screen mx-auto p-6 space-y-6 min-w-[90%]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and filter users in your application
          </p>
        </div>

        <div className="mt-3 md:mt-0">
          <Button onClick={() => navigate({ to: "/dashboard/admin/users/new" })}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        {/* Search Section */}
        <div className="flex gap-2 items-end">
          <Input
            className="min-w-64"
            placeholder="Search value…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <AdminUsersFiltersDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
            search={search}
            setSearch={setSearch}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            limit={limit}
            searchFields={searchFields}
            searchOperators={searchOperators}
          />
        </div>
      </div>

      <div className="@container rounded-md border overflow-hidden">
        {/* Mobile Card View - visible when container < 640px */}
        <div className="block @md:hidden">
          {query.isPending ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading users…
            </div>
          ) : (usersList ?? []).length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {usersList.map((u) => (
                <UserRowCard
                  key={u.id}
                  user={{
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    emailVerified: u.emailVerified,
                    banned: u.banned ?? undefined,
                    createdAt: u.createdAt,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View - visible when container >= 640px */}
        <div className="hidden @md:block">
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
                  <UserRowTable
                    key={u.id}
                    user={{
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      role: u.role,
                      emailVerified: u.emailVerified,
                      banned: u.banned ?? undefined,
                      createdAt: u.createdAt,
                    }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
