import { UserActionsDialog } from "@/components/admin/shared/UserActionsDialog";
import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { adminUsersQueryOptions } from "@/data-access-layer/users/admin-users";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { useTSRSearchQuery } from "@/lib/tanstack/router/use-search-query";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { FolderCode, Plus, Settings } from "lucide-react";
import { useState } from "react";
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

export function AdminUsersPage({}: AdminUsersPageProps) {
  const search = useSearch({ from: "/dashboard/admin/users/" });
  const navigate = useNavigate({ from: "/dashboard/admin/users" });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Centralized search/filter state management
  const { debouncedValue, isDebouncing, keyword, setKeyword, setSearchParams } =
    useTSRSearchQuery({
      search,
      navigate,
      query_param: "searchValue",
    });

  const query = useQuery(adminUsersQueryOptions(search));

  if (query.error || query.data?.error) {
    return (
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>No users Yet</EmptyTitle>
            <EmptyDescription>
              Error:{" "}
              {String(query.error?.message ?? query.data?.error?.message)}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/dashboard/admin/users/new" className="flex gap-2">
              <Plus className="h-4 w-4" />
              <Button>Create User</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
  if (!query.data?.data) {
    return (
      <div className="mx-auto min-h-screen p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>No users Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any users yet. Get started by creating
              your first user.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/dashboard/admin/users/new" className="flex gap-2">
              <Plus className="h-4 w-4" />
              <Button>Create User</Button>
            </Link>
          </EmptyContent>
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
    <div className="mx-auto min-h-screen min-w-[90%] space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage and filter users in your application
          </p>
        </div>

        <Link to="/dashboard/admin/users/new" className="mt-3 md:mt-0">
          <Button>
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {/* Search Section */}
        <div className="flex items-end gap-2">
          <Input
            className="min-w-[60%]"
            placeholder="Search value…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <AdminUsersFiltersDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
            search={search}
            navigate={navigate}
            searchFields={searchFields}
            searchOperators={searchOperators}
          />
        </div>
      </div>

      <div className="@container overflow-hidden rounded-md border">
        {/* Mobile Card View - visible when container < 640px */}
        <div className="block @md:hidden">
          {query.isPending ? (
            <div className="text-muted-foreground py-10 text-center">
              Loading users…
            </div>
          ) : (usersList ?? []).length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No users found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {usersList.map((u) => (
                <Card key={u.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="shrink-0">
                        <RoleIcons
                          role={(u.role as BetterAuthUserRoles) ?? "tenant"}
                        />
                      </div>
                      <CardTitle className="min-w-0 truncate text-base">
                        {u.name ?? "—"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">
                        Email
                      </p>
                      <p className="text-sm wrap-break-word">{u.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs">
                        Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {u.emailVerified ? (
                          <Badge variant="outline">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                        {u.banned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : null}
                        {u.role ? (
                          <Badge variant="outline">{u.role}</Badge>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Created</p>
                      <p className="text-sm" title={String(u.createdAt ?? "")}>
                        {u.createdAt
                          ? getRelativeTimeString(new Date(u.createdAt))
                          : "—"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedUser(u);
                        setActionsOpen(true);
                      }}
                    >
                      <Settings className="mr-1 h-4 w-4" />
                      Actions
                    </Button>
                  </CardContent>
                </Card>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isPending ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-10 text-center"
                  >
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : (usersList ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-10 text-center"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                usersList.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <RoleIcons
                          role={(u.role as BetterAuthUserRoles) ?? "tenant"}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {u.name ?? "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="space-x-2">
                      {u.emailVerified ? (
                        <Badge variant="outline">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                      {u.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : null}
                      {u.role ? (
                        <Badge variant="outline">{u.role}</Badge>
                      ) : null}
                    </TableCell>
                    <TableCell title={String(u.createdAt ?? "")}>
                      {u.createdAt
                        ? getRelativeTimeString(new Date(u.createdAt))
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u);
                          setActionsOpen(true);
                        }}
                      >
                        <Settings className="mr-1 h-4 w-4" />
                        Actions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {total > 0 ? (
            <span>
              Showing <span className="font-medium">{offset + 1}</span>–
              <span className="font-medium">
                {Math.min(offset + limit, total)}
              </span>{" "}
              of {total}
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
                  setSearchParams({
                    offset: Math.max(0, offset - limit),
                  } as any);
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
                      setSearchParams({ offset: (p - 1) * limit } as any);
                    }}
                  >
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
                  setSearchParams({ offset: offset + limit } as any);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedUser && (
        <UserActionsDialog
          open={actionsOpen}
          onOpenChange={setActionsOpen}
          user={{
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            banned: selectedUser.banned ?? undefined,
          }}
          onSuccess={() => query.refetch()}
        />
      )}
    </div>
  );
}
