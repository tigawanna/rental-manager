import { SidebarLinks } from "@/components/sidebar/SidebarLinks";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { dashboard_routes } from "./dashboard_routes";

interface DashboardSidebarLinksProps {}

export function DashboardSidebarLinks({}: DashboardSidebarLinksProps) {
  return (
    <SidebarGroup className="h-full bg-base-300">
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
        House keeping
      </SidebarGroupLabel>
      <SidebarLinks links={dashboard_routes} />{" "}
    </SidebarGroup>
  );
}
