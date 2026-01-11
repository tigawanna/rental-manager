import { SiteIcon } from "@/components/icon/SiteIcon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/organizations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <SiteIcon size={100} />
    </div>
  );
}
