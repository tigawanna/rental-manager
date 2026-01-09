import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminUsers, AdminUsersQueryOptionsParams } from "@/data-access-layer/users/admin-suers";
import { UserWithRole } from "better-auth/plugins";
import { useDebouncedValue } from "@/hooks/use-debouncer";
import { getRelativeTimeString } from "@/utils/date-helpers";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RoleIcons } from "@/components/identity/RoleIcons";

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
	const search = useSearch({ strict: false }) as unknown as Required<
		Omit<AdminUsersQueryOptionsParams, "filterValue"> & { filterValue?: string | number | boolean }
	>;
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
	const [searchInput, setSearchInput] = useState(search.searchValue ?? "");
	const { debouncedValue } = useDebouncedValue(searchInput, 400);

	// Apply debounced search to URL
	// Keep operator/field stable from current search
	const effectiveParams: AdminUsersQueryOptionsParams = useMemo(
		() => ({
			...search,
			searchValue: debouncedValue || undefined,
		}),
		[search, debouncedValue],
	);

	const query = useQuery(adminUsers(effectiveParams));

	const total = query.data?.total ?? 0;
	const limit = (search.limit as number) ?? 10;
	const offset = (search.offset as number) ?? 0;
	const page = Math.floor(offset / limit) + 1;
	const pageCount = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-end gap-3 flex-wrap">
				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted-foreground">Search</label>
					<div className="flex gap-2">
						<Select
							value={search.searchField ?? undefined}
							onValueChange={(v) => setSearch({ searchField: v, offset: 0 })}
						>
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
							onValueChange={(v) => setSearch({ searchOperator: v, offset: 0 })}
						>
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

				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted-foreground">Filter</label>
					<div className="flex gap-2 items-center">
						<Select
							value={(search.filterField as string | undefined) ?? undefined}
							onValueChange={(v) =>
								setSearch({ filterField: v, filterOperator: undefined, filterValue: undefined, offset: 0 })
							}
						>
							<SelectTrigger className="min-w-40">
								<SelectValue placeholder="Filter field" />
							</SelectTrigger>
							<SelectContent>
								{filterFields.map((f) => (
									<SelectItem key={String(f.value)} value={f.value}>
										{f.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={(search.filterOperator as string | undefined) ?? undefined}
							onValueChange={(v) => setSearch({ filterOperator: v, offset: 0 })}
							disabled={!search.filterField}
						>
							<SelectTrigger className="min-w-36">
								<SelectValue placeholder="Operator" />
							</SelectTrigger>
							<SelectContent>
								{(["eq", "contains", "ne", "lt", "lte", "gt", "gte"] as const).map((o) => (
									<SelectItem key={o} value={o}>
										{o}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Filter value input varies by field; keep simple text for now */}
						<Input
							className="min-w-48"
							placeholder="Filter value…"
							value={String(search.filterValue ?? "")}
							onChange={(e) => setSearch({ filterValue: e.target.value, offset: 0 })}
							disabled={!search.filterField}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm text-muted-foreground">Sort</label>
					<div className="flex gap-2">
						<Select
							value={(search.sortBy as string | undefined) ?? undefined}
							onValueChange={(v) => setSearch({ sortBy: v, offset: 0 })}
						>
							<SelectTrigger className="min-w-36">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{sortByFields.map((f) => (
									<SelectItem key={f.value} value={f.value}>
										{f.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={(search.sortDirection as "asc" | "desc") ?? "desc"}
							onValueChange={(v) => setSearch({ sortDirection: v as any, offset: 0 })}
						>
							<SelectTrigger className="min-w-28">
								<SelectValue placeholder="Direction" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="asc">Asc</SelectItem>
								<SelectItem value="desc">Desc</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex-1" />

				<div className="flex flex-col gap-2 items-end">
					<label className="text-sm text-muted-foreground">Page size</label>
					<div className="flex gap-2 items-center">
						<Select
							value={String(limit)}
							onValueChange={(v) => setSearch({ limit: Number(v), offset: 0 })}
						>
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
						<Button
							variant="outline"
							onClick={() =>
								setSearch({
									searchValue: undefined,
									searchField: undefined,
									searchOperator: undefined,
									filterField: undefined,
									filterOperator: undefined,
									filterValue: undefined,
									sortBy: "createdAt",
									sortDirection: "desc",
									offset: 0,
								})
							}
						>
							Reset
						</Button>
					</div>
				</div>
			</div>

			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[60px]">Role</TableHead>
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
						) : (query.data?.users ?? []).length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
									No users found
								</TableCell>
							</TableRow>
						) : (
							(query.data?.users as UserWithRole[]).map((u) => (
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
