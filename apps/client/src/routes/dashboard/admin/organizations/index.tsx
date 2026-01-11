import { SiteIcon } from "@/components/icon/SiteIcon";
import { ListOrgs } from "@/components/orgs/ListOrgs";
import { createFileRoute } from "@tanstack/react-router";
import { OrgList } from "./-components/OrgList";

export const Route = createFileRoute("/dashboard/admin/organizations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <OrgList />
    </div>
  );
}
