import { AdminUsersPage } from "@/components/admin/AdminUsersPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/dashboard/admin/users/")({
  validateSearch: z.object({
    searchValue: z.string().optional().catch(undefined),
    searchField: z.enum(["email", "name"]).optional().catch(undefined),
    searchOperator: z.enum(["contains", "starts_with", "ends_with"]).optional().catch(undefined),
    limit: z.coerce.number().int().min(1).max(200).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    sortBy: z
      .enum(["createdAt", "updatedAt", "name", "email", "id"]) // common fields
      .default("createdAt"),
    sortDirection: z.enum(["asc", "desc"]).default("desc"),
    filterField: z
      .enum(["role", "emailVerified", "banned", "banReason", "email", "name"]) // allow a few useful filters
      .optional()
      .catch(undefined),
    filterOperator: z
      .enum(["eq", "contains", "ne", "lt", "lte", "gt", "gte"]) // better-auth supported
      .optional()
      .catch(undefined),
    // Allow boolean/number/string as string via coerce and serialize back
    filterValue: z
      .union([z.string(), z.coerce.number(), z.coerce.boolean()])
      .optional()
      .catch(undefined),
  }),
  component: AdminUsersPage,
});





