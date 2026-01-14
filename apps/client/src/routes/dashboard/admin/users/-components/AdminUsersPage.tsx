import { UserActionsDialog } from "@/components/admin/shared/UserActionsDialog";
import { RoleIcons } from "@/components/identity/RoleIcons";
import { SearchBox } from "@/components/search/SearchBox";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminUsersCollection } from "@/data-access-layer/collections/admin/users-collection";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { createSortableColumns } from "@/lib/tanstack/db/sortable-columns";
import { TanstackDBColumnFilters } from "@/lib/tanstack/db/TanstackDBColumnfilters";
import { useTSRSearchQuery } from "@/lib/tanstack/router/use-search-query";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { count, ilike, or } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Plus, Settings, Users } from "lucide-react";
import { useState } from "react";

export function AdminUsersPage() {
  const search = useSearch({ from: "/dashboard/admin/users/" });
  const navigate = useNavigate({ from: "/dashboard/admin/users" });
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    role: string | null | undefined;
    banned: boolean | null | undefined;
  } | null>(null);

  const { debouncedValue, isDebouncing, keyword, setKeyword } =
    useTSRSearchQuery({
      search,
      navigate,
      query_param: "sq",
    });

  // Query for paginated data with limit/offset
  const query = useLiveQuery(
    (q) =>
      q
        .from({ users: adminUsersCollection })
        .where(({ users }) =>
          or(
            ilike(users.name, `%${debouncedValue}%`),
            ilike(users.email, `%${debouncedValue}%`),
          ),
        )
        .orderBy(({ users }) => users.createdAt, "desc")
        .limit(limit)
        .offset(offset)
        .select(({ users }) => ({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          banned: users.banned,
          banReason: users.banReason,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
        })),
    [debouncedValue, limit, offset],
  );

  // Separate query for total count (without limit/offset)
  const countQuery = useLiveQuery(
    (q) =>
      q
        .from({ users: adminUsersCollection })
        .where(({ users }) =>
          or(
            ilike(users.name, `%${debouncedValue}%`),
            ilike(users.email, `%${debouncedValue}%`),
          ),
        )
        .select(({ users }) => ({
          total: count(users.id),
        })),
    [debouncedValue],
  );

  const sortableColumns = createSortableColumns(adminUsersCollection, [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "createdAt", label: "Created At" },
    { value: "role", label: "Role" },
  ]);

  const paginatedUsers = query.data ?? [];
  const total = countQuery.data?.[0]?.total ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  // Show empty state only when there's no data at all (initial load with no users)
  const hasNoUsersAtAll =
    !query.isLoading && !countQuery.isLoading && total === 0 && !debouncedValue;

  if (hasNoUsersAtAll) {
    return (
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No Users Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any users yet. Get started by creating
              your first one.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/dashboard/admin/users/new" className="flex gap-2">
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Create User
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-[90%] flex-col gap-4">
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

      <div className="flex items-end gap-3">
        <SearchBox {...{ debouncedValue, isDebouncing, keyword, setKeyword }} />
        <TanstackDBColumnFilters
          collection={adminUsersCollection}
          sortableColumns={sortableColumns}
          search={search}
          navigate={navigate}
          defaultSortBy="createdAt"
        />
      </div>

      <div className="@container overflow-hidden rounded-md border">
        {/* Mobile Card View - visible when container < 640px */}
        <div className="block @md:hidden">
          {query.isLoading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Skeleton className="mb-1 h-3 w-16" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div>
                      <Skeleton className="mb-2 h-3 w-16" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground mb-4">
                No users found
                {debouncedValue ? " matching your search" : ""}
              </p>
              {debouncedValue && (
                <Button
                  onClick={() => {
                    setKeyword("");
                    setOffset(0);
                  }}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {paginatedUsers.map((u) => (
                <Card
                  key={u.id}
                  className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => navigate({ to: `/dashboard/admin/users/${u.id}` })}
                >
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
                        setSelectedUser({
                          id: u.id,
                          name: u.name,
                          email: u.email,
                          role: u.role,
                          banned: u.banned,
                        });
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
              {query.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <div>
                      <p className="text-muted-foreground mb-4">
                        No users found
                        {debouncedValue ? " matching your search" : ""}
                      </p>
                      {debouncedValue && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setKeyword("");
                            setOffset(0);
                          }}
                        >
                          Clear Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      navigate({ to: `/dashboard/admin/users/${u.id}` })
                    }
                  >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser({
                            id: u.id,
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            banned: u.banned,
                          });
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

      {total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {total > 0 ? (
              <span>
                Showing <span className="font-medium">{offset + 1}</span>–
                <span className="font-medium">
                  {Math.min(offset + limit, total)}
                </span>{" "}
                of <span className="font-medium">{total}</span>
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
                    setOffset(Math.max(0, offset - limit));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(pageCount, 7) }).map((_, i) => {
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
                        setOffset((p - 1) * limit);
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
                    setOffset(offset + limit);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
          onSuccess={() => {
            // TanStack DB will automatically refetch
          }}
        />
      )}
    </div>
  );
}
