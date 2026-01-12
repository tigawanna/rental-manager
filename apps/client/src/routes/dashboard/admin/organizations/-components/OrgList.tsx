import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { userOrgsQueryOptions } from "@/data-access-layer/users/user-orgs";
import { useDebouncedValue } from "@/hooks/use-debouncer";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRightIcon, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateOrg, EditOrg } from "./OrgDialogs";

interface OrgListProps {}

export function OrgList({}: OrgListProps) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { debouncedValue: debouncedSearchInput } = useDebouncedValue(searchInput, 400);

  const query = useQuery(userOrgsQueryOptions({}));

  const filteredOrgs = useMemo(() => {
    if (!query.data) return [];
    
    const searchTerm = debouncedSearchInput.toLowerCase();
    if (!searchTerm) return query.data;
    
    return query.data.filter(
      (org) =>
        org.name?.toLowerCase().includes(searchTerm) ||
        org.slug?.toLowerCase().includes(searchTerm)
    );
  }, [query.data, debouncedSearchInput]);

  const total = filteredOrgs.length;
  const paginatedOrgs = filteredOrgs.slice(offset, offset + limit);
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  if (query.error) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>Error Loading Organizations</EmptyTitle>
            <EmptyDescription>
              {query.error instanceof Error ? query.error.message : "An error occurred"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => query.refetch()}>Try Again</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading organizations…</div>
      </div>
    );
  }

  if (!query.data || query.data.length === 0) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>No Organizations Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any organizations yet. Get started by creating your first
              one.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateOrg triggerLabel="Create Organization" />
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

  return (
    <div className="h-full w-full min-w-[90%]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all organizations
          </p>
        </div>

        <div className="mt-3 md:mt-0">
          <CreateOrg
            triggerLabel="Create Organization"
            className=""
          />
        </div>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <Input
          className="min-w-64"
          placeholder="Search by name or slug…"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setOffset(0); // Reset to first page on search
          }}
        />
      </div>

      <div className="@container rounded-md border overflow-hidden">
        {/* Mobile Card View */}
        <div className="block @md:hidden">
          {paginatedOrgs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No organizations found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {paginatedOrgs.map((org) => (
                <Card
                  key={org.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate({ to: `/dashboard/admin/organizations/${org.id}` })}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{org.name ?? "—"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Slug</p>
                      <p className="text-sm font-mono">{org.slug}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Status</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{org.id.slice(0, 8)}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm" title={String(org.createdAt ?? "")}>
                        {org.createdAt ? getRelativeTimeString(new Date(org.createdAt)) : "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden @md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrgs.map((org) => (
                  <TableRow
                    key={org.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate({ to: `/dashboard/admin/organizations/${org.id}` })}
                  >
                    <TableCell className="font-medium">{org.name ?? "—"}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{org.slug}</code>
                    </TableCell>
                    <TableCell title={String(org.createdAt ?? "")}>
                      {org.createdAt ? getRelativeTimeString(new Date(org.createdAt)) : "—"}
                    </TableCell>
                    <TableCell>
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditOrg
                          org={{
                            organizationId: org.id,
                            body: {
                              name: org.name,
                              slug: org.slug,
                              logo: org.logo ?? undefined,
                              metadata: org.metadata,
                            },
                          }}
                          triggerLabel="Edit"
                        />
                      </div>
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
          <div className="text-sm text-muted-foreground">
            {total > 0 ? (
              <span>
                Showing <span className="font-medium">{offset + 1}</span>–
                <span className="font-medium">{Math.min(offset + limit, total)}</span> of{" "}
                <span className="font-medium">{total}</span>
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
    </div>
  );
}
