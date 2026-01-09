"use client";
import { BadgeCheck, Bell, ChevronsUpDown, ShieldCheck } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";


import { MutationButton } from "@/lib/tanstack/query/MutationButton";

import { Link, useNavigate } from "@tanstack/react-router";
import { useViewer } from "@/data-access-layer/users/viewer";
export function DashboardSidebarUser() {
  const tsrNavigate = useNavigate();
  const { isMobile } = useSidebar();
  const { viewer, logoutMutation } = useViewer();

  if (!viewer) {
    return null;
  }
  const avatarUrl = viewer.user?.image??"/blank-user.png";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="">
              <Avatar className="h-8 w-8 rounded-full bg-base-content hover:bg-base-300">
                <AvatarImage src={avatarUrl} alt={viewer.user?.name} />
                <AvatarFallback className="rounded-lg">
                  {viewer.user?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {viewer.user?.name}
                </span>
                <span className="truncate text-xs">{viewer.user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-2 text-base-content"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={viewer.user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="flex items-center gap-1 truncate font-semibold">
                    {viewer.user?.name}{" "}
                    {viewer.user?.role === "tenant" && (
                      <ShieldCheck className="size-3 text-accent" />
                    )}
                  </span>
                  <span className="truncate text-xs">{viewer.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/profile" className="w-full">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <MutationButton
              className="btn-error max-w-[98%]"
              onClick={() => {
                logoutMutation.mutate();
                tsrNavigate({ to: "/auth", search: { returnTo: "/" } });
              }}
              label="Logout"
              mutation={logoutMutation}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
