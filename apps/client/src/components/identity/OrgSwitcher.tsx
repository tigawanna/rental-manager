"use client";

import { Building2, ChevronsUpDown, Home, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { organizationsCollection } from "@/data-access-layer/collections/admin/organizations-collection";
import { setActiveOrganizationMutationOptions } from "@/data-access-layer/users/user-orgs";
import { authClient } from "@/lib/better-auth/client";
import { useLiveQuery } from "@tanstack/react-db";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const { data: activeOrganization, isPending } = authClient.useActiveOrganization();
  const switchOrgMutation = useMutation(setActiveOrganizationMutationOptions);
  
  // Fetch organizations from the collection
  const query = useLiveQuery((q) =>
    q.from({ orgs: organizationsCollection }).select(({ orgs }) => ({
      id: orgs.id,
      name: orgs.name,
      slug: orgs.slug,
      logo: orgs.logo,
      metadata: orgs.metadata,
      createdAt: orgs.createdAt,
    })),
  );
  
  const organizations = query.data ?? [];

  // Show loading skeleton
  if (query.isLoading || isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show empty state if no organizations
  if (organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 p-4">
            <Building2 className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-center text-xs font-medium text-muted-foreground">
              No organizations yet
            </p>
            <p className="text-center text-xs text-muted-foreground/70">
              Create one to get started
            </p>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Use active organization from API, fallback to first org
  const displayOrg = activeOrganization || organizations[0];

  if (!displayOrg) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary/20 text-primary flex aspect-square size-8 items-center justify-center rounded-lg font-semibold">
                {displayOrg.name.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayOrg.name}</span>
                <span className="truncate text-xs">{displayOrg.slug}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel asChild className="p-0">
              <Link
                to="/"
                className="flex items-center gap-2 px-2 py-1.5 text-sm"
              >
                <Home className="size-4" />
                Go to Home
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => switchOrgMutation.mutate({ organizationId: org.id })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border text-xs font-semibold">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Create organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
