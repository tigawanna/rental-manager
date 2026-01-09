import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useViewer } from "@/data-access-layer/users/viewer";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { dashboard_routes } from "./dashboard_routes";
import { SidebarLinks } from "@/components/sidebar/SidebarLinks";

interface DashboardSidebarLinksProps {}

export function DashboardSidebarLinks({}: DashboardSidebarLinksProps) {
  const { state, setOpen, setOpenMobile, isMobile } = useSidebar();
  const { pathname } = useLocation();
  const { viewer } = useViewer();
  const role = viewer?.user?.role;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});


  const isActive = (href: string) => pathname === href;

  return (
    <SidebarGroup className="h-full bg-base-300">
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
        House keeping
      </SidebarGroupLabel>
      <SidebarLinks links={dashboard_routes} />{" "}
    </SidebarGroup>
  );
}
