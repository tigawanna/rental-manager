import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OrgMembers } from "../-components/OrgMembers";

const searchFields = [
  { label: "User ID", value: "userId" as const },
  { label: "Role", value: "role" as const },
];

const searchOperators = [
  { label: "Contains", value: "contains" as const },
  { label: "Starts with", value: "starts_with" as const },
  { label: "Ends with", value: "ends_with" as const },
];

const filterFields = [
  { label: "Role", value: "role" },
];

const sortByFields = [
  { label: "Created", value: "createdAt" },
  { label: "User ID", value: "userId" },
  { label: "Role", value: "role" },
];

export const Route = createFileRoute("/dashboard/admin/organizations/$orgId/members")({
  validateSearch: z.object({
    searchValue: z.string().optional().catch(undefined),
    searchField: z.enum(["userId", "role"]).optional().catch(undefined),
    searchOperator: z.enum(["contains", "starts_with", "ends_with"]).optional().catch(undefined),
    limit: z.coerce.number().int().min(1).max(200).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    sortBy: z
      .enum(["createdAt", "userId", "role"]) // member fields
      .default("createdAt"),
    sortDirection: z.enum(["asc", "desc"]).default("desc"),
    filterField: z
      // .enum(["role"]) // member filter fields
      .string()
      .optional()
      .catch(undefined),
    filterOperator: z
      .enum(["eq", "contains", "ne", "lt", "lte", "gt", "gte"])
      .optional()
      .catch(undefined),
    filterValue: z
      .union([z.string(), z.coerce.number(), z.coerce.boolean()])
      .optional()
      .catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { orgId } = Route.useParams();
  return (
    <div className="w-full h-full flex flex-col">
      <OrgMembers 
        orgId={orgId}
        searchFields={searchFields}
        searchOperators={searchOperators}
        filterFields={filterFields}
        sortByFields={sortByFields}
      />
    </div>
  );
}
