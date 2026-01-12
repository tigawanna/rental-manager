import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { OrgList } from "./-components/OrgList";

export const Route = createFileRoute("/dashboard/admin/organizations/")({
  component: RouteComponent,
  validateSearch: z.object({
    sq: z.string().optional().catch(undefined),
    sortBy: z.string().optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
  }),
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <OrgList />
    </div>
  );
}
