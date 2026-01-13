import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OrgMembers } from "../-components/OrgMembers";

export const Route = createFileRoute(
  "/dashboard/admin/organizations/$orgId/members",
)({
  validateSearch: z.object({
    searchValue: z.string().optional().catch(undefined),
    limit: z.coerce.number().int().min(1).max(200).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    sortBy: z.string().optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
    filterField: z.string().optional().catch(undefined),
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
    <div className="flex h-full w-full flex-col">
      <OrgMembers orgId={orgId} />
    </div>
  );
}
