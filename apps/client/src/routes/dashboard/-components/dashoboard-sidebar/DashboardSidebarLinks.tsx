import { dashboard_routes } from "@/components/navigation/routes";
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

interface DashboardSidebarLinksProps {}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem;
}

export function DashboardSidebarLinks({}: DashboardSidebarLinksProps) {
  const { state, setOpen, setOpenMobile, isMobile } = useSidebar();
  const { pathname } = useLocation();
  const { viewer } = useViewer();
  const role = viewer?.user?.role;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (name: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => {
    return isActive(item.href) || (item.children && isActive(item.children.href));
  };

  return (
    <SidebarGroup className="h-full bg-base-300">
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide">House keeping</SidebarGroupLabel>
      <SidebarMenu className="gap-1 px-2">
        {dashboard_routes({ iconSize: 15 }).map((item) => {
          if (!(role === "staff") && (item.name === "staff" || item.name === "utilities")) {
            return null;
          }

          const hasChildren = item.children !== undefined;
          const itemIsActive = isParentActive(item);

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.name}>
                <TooltipProvider>
                  <Tooltip defaultOpen={false} delayDuration={200}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-200 ${
                          itemIsActive
                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                            : "text-base-content hover:bg-base-200/60"
                        }`}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-2"
                          onClick={() => {
                            if (isMobile) {
                              setOpen(false);
                              setOpenMobile(false);
                            }
                          }}>
                          <div className="flex items-center justify-center size-5">{item.icon}</div>
                          {(state === "expanded" || isMobile) && (
                            <span className="text-sm font-medium capitalize">{item.name}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {state === "collapsed" && !isMobile && (
                      <TooltipContent side="right" className="capitalize">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item.name}>
              <Collapsible
                open={openItems[item.name] || itemIsActive}
                onOpenChange={() => toggleItem(item.name)}>
                <CollapsibleTrigger asChild>
                  <TooltipProvider>
                    <Tooltip defaultOpen={false} delayDuration={200}>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          className={`transition-all duration-200 ${
                            itemIsActive
                              ? "bg-primary/10 text-primary font-medium shadow-sm"
                              : "text-base-content hover:bg-base-200/60"
                          }`}>
                          <div className="flex items-center justify-center size-5">{item.icon}</div>
                          {(state === "expanded" || isMobile) && (
                            <>
                              <span className="text-sm font-medium capitalize flex-1">{item.name}</span>
                              <ChevronRight className="size-4 transition-transform duration-200" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {state === "collapsed" && !isMobile && (
                        <TooltipContent side="right" className="capitalize">
                          {item.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </CollapsibleTrigger>

                {(state === "expanded" || isMobile) && (
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:collapse-out data-[state=open]:collapse-in">
                    <SidebarMenuSub className="ml-2 border-l border-base-200 gap-1 py-2">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={`transition-all duration-200 ${
                            isActive(item.children!.href)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-base-content hover:bg-base-200/60"
                          }`}>
                          <Link
                            to={item.children!.href}
                            className="flex items-center gap-2 text-sm"
                            onClick={() => {
                              if (isMobile) {
                                setOpen(false);
                                setOpenMobile(false);
                              }
                            }}>
                            <div className="flex items-center justify-center size-4">{item.children!.icon}</div>
                            <span className="capitalize">{item.children!.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
