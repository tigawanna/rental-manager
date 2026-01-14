"use client";

import { Building2, ChevronsUpDown, Home, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  createOrganizationMutationOptions,
  setActiveOrganizationMutationOptions,
} from "@/data-access-layer/users/user-orgs";
import { authClient } from "@/lib/better-auth/client";
import { CreateOrg } from "@/routes/dashboard/admin/organizations/-components/OrgDialogs";
import { OrgForm } from "@/routes/dashboard/admin/organizations/-components/OrgForm";
import { useLiveQuery } from "@tanstack/react-db";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function OrgSwitcher() {
  const { isMobile, state, open } = useSidebar();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role || "user";
  const isAdmin = userRole === "admin";
  const [createOrgOpen, setCreateOrgOpen] = useState(false);

  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();
  const switchOrgMutation = useMutation(setActiveOrganizationMutationOptions);

  const createOrgMutation = useMutation({
    mutationFn: createOrganizationMutationOptions.mutationFn,
    onSuccess(data) {
      toast.success("Organization created");
      setCreateOrgOpen(false);
    },
    onError(err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to create organization", {
          description: err.message,
        });
      } else {
        toast.error("Failed to create organization", {
          description: String(err),
        });
      }
    },
    meta: {
      invalidates: [["organizations"]],
    },
  });

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
    // If not admin and no orgs, show home button
    if (!isAdmin) {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate({ to: "/" })}
              className="justify-center group-data-[collapsible=icon]:justify-center"
            >
              <div className="bg-sidebar-primary/10 flex aspect-square size-8 items-center justify-center rounded-lg">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <Building2 className="text-muted-foreground/50 mb-2 h-8 w-8" />
                </Link>
              </div>
              <div className="flex flex-1 flex-col text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">Home</span>
                <span className="truncate text-xs">Go to dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="border-muted-foreground/30 flex flex-col items-center justify-center rounded-lg border border-dashed p-4 group-data-[collapsible=icon]:p-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-1.5 text-sm"
            >
              <Building2 className="text-muted-foreground/50 mb-2 h-8 w-8" />
            </Link>

            <CreateOrg
              trigger={
                <div className="flex flex-col cursor-pointer items-center gap-2 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:gap-0">
                  <p className="text-muted-foreground text-center text-xs font-medium group-data-[collapsible=icon]:hidden">
                    No organizations yet
                  </p>
                  <div className="flex w-full justify-center gap-2">
                    <div className="text-center text-xs font-medium">
                      Create organization
                    </div>
                    <Plus className="size-4" />
                  </div>
                </div>
              }
            />
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
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{displayOrg.name}</span>
                <span className="truncate text-xs">{displayOrg.slug}</span>
              </div>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
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
                <Building2 className="text-muted-foreground/50 mb-2 h-8 w-8" />
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
                onClick={() =>
                  switchOrgMutation.mutate({ organizationId: org.id })
                }
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
            {isAdmin ? (
              <DropdownMenuItem
                onClick={() => setCreateOrgOpen(true)}
                className="gap-2 p-2"
              >
                <div className="flex w-full justify-center gap-2">
                  <CreateOrg
                    trigger={
                      <div className="flex cursor-pointer flex-col items-center gap-2 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:gap-0">
                        <div className="flex w-full justify-center gap-2">
                          <div className="text-center text-xs font-medium">
                            Create organization
                          </div>
                          <Plus className="size-4" />
                        </div>
                      </div>
                    }
                  />
                </div>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => navigate({ to: "/" })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Building2 className="text-muted-foreground/50 mb-2 h-8 w-8" />
                </div>
                <div className="font-medium">Go to Home</div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
