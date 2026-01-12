import { createFileRoute } from "@tanstack/react-router";
import { OrgDetails } from "../-components/OrgDetails";

export const Route = createFileRoute("/dashboard/admin/organizations/$orgId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orgId } = Route.useParams();
  return (
    <div className="w-full h-full flex flex-col">
      <OrgDetails orgId={orgId} />
    </div>
  );
}
