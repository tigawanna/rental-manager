import { FiltersDialog } from "@/components/admin/shared/FiltersDialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { organizationMembersQueryOptions } from "@/data-access-layer/users/organization-members";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { useTSRSearchQuery } from "@/lib/tanstack/router/use-search-query";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { useState } from "react";

interface OrgMembersProps {
  orgId: string;
  searchFields: Array<{ label: string; value: string }>;
  searchOperators: Array<{ label: string; value: string }>;
  filterFields: Array<{ label: string; value: string }>;
  sortByFields: Array<{ label: string; value: string }>;
}

export function OrgMembers({
  orgId,
  searchFields,
  searchOperators,
  filterFields,
  sortByFields,
}: OrgMembersProps) {
  // Read current route search values - Types come from validateSearch in the route definition

  const search = useSearch({ from: "/dashboard/admin/organizations/$orgId/members" });
  const navigate = useNavigate({ from: "/dashboard/admin/organizations/$orgId/members" });
  // const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof membersList[0] | null>(null);

  // Centralized search/filter state management
  const { debouncedValue, isDebouncing, keyword, setKeyword, setSearchParams } = useTSRSearchQuery({
    search,
    navigate,
    query_param: "searchValue",
  });

  // Search section takes priority over Filter section for the filter params
  const effectiveFilterField = search.searchField ?? search.filterField;
  // Map search operators to supported filter operators (API doesn't support starts_with/ends_with)
  const searchOperatorMapped = search.searchOperator === "starts_with" || search.searchOperator === "ends_with" 
    ? "contains" as const 
    : search.searchOperator;
  const effectiveFilterOperator = searchOperatorMapped ?? search.filterOperator;
  const effectiveFilterValue = search.searchValue ?? search.filterValue;

  const query = useQuery(
    organizationMembersQueryOptions({
      query: {
        organizationId: orgId,
        filterValue: effectiveFilterValue,
        filterField: effectiveFilterField,
        filterOperator: effectiveFilterOperator,
        limit: search.limit,
        offset: search.offset,
        sortBy: search.sortBy,
        sortDirection: search.sortDirection,
      },
    })
  );

  if (query.error) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>Error Loading Members</EmptyTitle>
            <EmptyDescription>
              {query.error instanceof Error ? query.error.message : "An error occurred"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/dashboard/admin/organizations/${orgId}` })}>
                Back to Organization
              </Button>
              <Button onClick={() => query.refetch()}>Try Again</Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading members…</div>
      </div>
    );
  }

  const membersData = query.data;
  const membersList = membersData?.members ?? [];
  const total = membersData?.total ?? 0;
  const limit = search.limit ?? 10;
  const offset = search.offset ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="h-full w-full space-y-6 p-6 min-w-[90%]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: `/dashboard/admin/organizations/${orgId}` })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Organization Members</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage members and their roles</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      {/* <div className="flex items-end gap-3">
        <SearchBox {...{ debouncedValue, isDebouncing, keyword, setKeyword }} />
        <FiltersDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          search={search}
          navigate={navigate}
          searchFields={searchFields}
          searchOperators={searchOperators}
          filterFields={filterFields}
          sortByFields={sortByFields}
        />
      </div> */}

      {/* Empty/Loading state */}
      {(membersList.length === 0 || query.isPending) && (
        <div className="min-h-[70%] mx-auto max-w-2xl flex flex-col items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>
                {query.isPending
                  ? "Loading..."
                  : debouncedValue
                    ? "No members found"
                    : "No members yet"}
              </EmptyTitle>
              <EmptyDescription>
                {query.isPending
                  ? "Fetching members data..."
                  : debouncedValue
                    ? "Try adjusting your search filters"
                    : "This organization doesn't have any members yet"}
              </EmptyDescription>
            </EmptyHeader>
            {debouncedValue && !query.isPending && (
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => {
                    setKeyword("");
                    setSearchParams({
                      offset: 0,
                      filterField: undefined,
                      filterOperator: undefined,
                      filterValue: undefined,
                      sortBy: undefined,
                      sortDirection: undefined,
                      searchField: undefined,
                      searchOperator: undefined,
                      searchValue: undefined,
                    } as any);
                  }}>
                  Clear Search
                </Button>
              </EmptyContent>
            )}
          </Empty>
        </div>
      )}

      {/* Desktop Table View */}
      {membersList.length > 0 && (
        <div className="@container rounded-md border overflow-hidden">
          <div className="hidden @md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-15">Pic</TableHead>
                  <TableHead>Name</TableHead>                  
                  <TableHead>Email</TableHead>
             
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersList.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <RoleIcons role={(member.role as BetterAuthUserRoles) ?? "tenant"} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.user.name ?? "—"}</TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell title={String(member.createdAt ?? "")}>
                      {member.createdAt ? getRelativeTimeString(new Date(member.createdAt)) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setActionsOpen(true);
                        }}>
                        <Settings className="h-4 w-4 mr-1" />
                        Actions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block @md:hidden space-y-4 p-4">
            {membersList.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0">
                      <RoleIcons role={(member.role as BetterAuthUserRoles) ?? "tenant"} />
                    </div>
                    <CardTitle className="text-base truncate min-w-0">
                      {member.user.name ?? "—"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm wrap-break-word">{member.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Role</p>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm" title={String(member.createdAt ?? "")}>
                      {member.createdAt ? getRelativeTimeString(new Date(member.createdAt)) : "—"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedMember(member);
                      setActionsOpen(true);
                    }}>
                    <Settings className="h-4 w-4 mr-1" />
                    Actions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pagination and Summary */}
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
                  setSearchParams({ offset: Math.max(0, offset - limit) } as any);
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
                      setSearchParams({ offset: (p - 1) * limit } as any);
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
                  setSearchParams({ offset: offset + limit } as any);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedMember && (
        <UserActionsDialog
          open={actionsOpen}
          onOpenChange={setActionsOpen}
          user={{
            id: selectedMember.userId,
            name: selectedMember.user.name,
            email: selectedMember.user.email,
            role: selectedMember.role,
            banned: false,
          }}
          orgId={orgId}
          onSuccess={() => query.refetch()}
        />
      )}
    </div>
  );
}
