import { FiltersDialog } from "@/components/admin/shared/FiltersDialog";
import { UserRowCard } from "@/components/admin/shared/UserRowCard";
import { UserRowTable } from "@/components/admin/shared/UserRowTable";
import { SearchBox } from "@/components/search/SearchBox";
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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { organizationMembersQueryOptions } from "@/data-access-layer/users/organization-members";
import { useDebouncedValue } from "@/hooks/use-debouncer";
import { useTSRSearchQuery } from "@/lib/tanstack/router/use-search-query";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Users } from "lucide-react";
import { useMemo, useState } from "react";

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
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const searchInput =search.searchValue ?? ""; 
  // const { debouncedValue } = useDebouncedValue(searchInput, 400);

  function setSearchInput(value: string) {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, searchValue: value, offset: 0 }),
      replace: true,
      viewTransition:false,

    });
  } 

  function setSearch(patch: Partial<Record<keyof typeof search, any>>) {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });
  }

    const { debouncedValue, isDebouncing, keyword, setKeyword } = useTSRSearchQuery({
      from: "/dashboard/admin/organizations/$orgId/members",
      query_param: "searchValue",
    });


  const query = useQuery(
    organizationMembersQueryOptions({
      query: {
        organizationId: orgId,
        filterValue: search.searchValue,
        filterField: search.filterField,
        filterOperator: search.filterOperator,
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
      <div className="flex items-end gap-3">
        <SearchBox {...{ debouncedValue, isDebouncing, keyword, setKeyword }} />
        <FiltersDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
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
      </div>

      {/* Empty/Loading state */}
      {(membersList.length === 0 || query.isPending) && (
        <div className="h-full mx-auto max-w-2xl flex flex-col items-center justify-center">
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
                    setSearchInput("");
                    setSearch({ offset: 0 });
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
                  <TableHead className="w-15">Role</TableHead>
                  <TableHead>Name (User ID)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersList.map((member) => (
                  <UserRowTable
                    key={member.id}
                    user={{
                      id: member.userId,
                      name: member.userId,
                      email: member.userId, // member data doesn't have email separately
                      role: member.role,
                      emailVerified: false,
                      banned: false,
                      createdAt: member.createdAt,
                    }}
                    orgId={orgId}
                    showActions={true}
                    showEmail={false}
                    onSuccess={() => query.refetch()}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block @md:hidden space-y-4 p-4">
            {membersList.map((member) => (
              <UserRowCard
                key={member.id}
                user={{
                  id: member.userId,
                  name: member.userId,
                  email: member.userId,
                  role: member.role,
                  emailVerified: false,
                  banned: false,
                  createdAt: member.createdAt,
                }}
                orgId={orgId}
                showActions={true}
                showEmail={false}
                onSuccess={() => query.refetch()}
              />
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
                  setSearch({ offset: Math.max(0, offset - limit) });
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
function useSearchQuery(arg0: { from: string; query_param: string; }): { debouncedValue: any; isDebouncing: any; keyword: any; setKeyword: any; } {
  throw new Error("Function not implemented.");
}

