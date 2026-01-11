import { SiteIcon } from "@/components/icon/SiteIcon";
import { ListOrgs } from "@/components/orgs/ListOrgs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/organizations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
      <SiteIcon size={100} />
      <ListOrgs />
    </div>
  );
}
