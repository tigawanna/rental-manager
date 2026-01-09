import { authClient } from "@/lib/better-auth/client";
import { queryOptions } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";

export type AdminUsersQueryOptionsParams = {
    searchValue?: string | undefined;
    searchField?: "email" | "name" | undefined;
    searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
    limit?: string | number | undefined;
    offset?: string | number | undefined;
    sortBy?: string | undefined;
    sortDirection?: "asc" | "desc" | undefined;
    filterField?: string | undefined;
    filterValue?: string | number | boolean | undefined;
    filterOperator?: "eq" | "contains" | "ne" | "lt" | "lte" | "gt" | "gte" 
};
type InferListUsers = Awaited<ReturnType<typeof authClient.admin.listUsers>>;
export type AdminUsersResult = NonNullable<Extract<InferListUsers, { data: any; error: null }>["data"]> &
  (
    | { users: UserWithRole[]; total: number; limit?: number; offset?: number }
    | { users: never[]; total: number }
  );

export function adminUsers({
  searchValue,
  searchField,
  searchOperator,
  limit,
  offset,
  sortBy,
  sortDirection,
  filterField,
  filterValue,
  filterOperator,
}: AdminUsersQueryOptionsParams) {
  return queryOptions({
    queryKey: ["admin-users", searchValue, searchField, searchOperator, limit, offset, sortBy, sortDirection, filterField, filterValue, filterOperator],
    queryFn: async ()=> {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          searchValue,
          searchField,
          searchOperator,
          limit: typeof limit === "string" ? Number(limit) : limit,
          offset: typeof offset === "string" ? Number(offset) : offset,
          sortBy,
          sortDirection,
          filterField,
          filterValue,
          filterOperator,
        },
      });
      if (error) throw error;
      // Ensure a consistent return shape
      return (data ?? { users: [], total: 0 }) as AdminUsersResult;
    },
});
}
