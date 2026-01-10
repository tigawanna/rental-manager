import { OrgSwitcher } from "@/components/identity/OrgSwitcher";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

interface DashboardSidebarHeaderProps {}

export function DashboardSidebarHeader({}: DashboardSidebarHeaderProps) {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const { pathname } = useLocation();

  // TODO: Replace with actual organizations from better-auth
  const organizations = [
    {
      id: "1",
      name: "My Organization",
      plan: "Pro",
    },
    {
      id: "2",
      name: "Secondary Org",
      plan: "Free",
    },
  ];

  return (
    <div className="flex flex-col gap-3" onClick={() => { setOpenMobile(false) }}>
      <OrgSwitcher organizations={organizations} />
      <Link
        to="/dashboard"
        className={
          pathname === "/dashboard"
            ? `flex w-full cursor-pointer items-center gap-2 rounded-lg bg-primary/10 text-primary p-1 font-medium`
            : `flex w-full cursor-pointer items-center gap-2 rounded-sm p-1 hover:bg-base-300`
        }
      >
        <LayoutDashboard className="size-5" />
        {(state === "expanded" || isMobile) && (
          <h1 className="text-sm font-semibold">Dashboard</h1>
        )}
      </Link>
    </div>
  );
}
