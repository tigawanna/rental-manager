"use client"

import { ChevronsUpDown, Home, Plus } from "lucide-react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

export function OrgSwitcher({
  organizations,
}: {
  organizations: {
    id: string
    name: string
    logo?: React.ElementType
    plan?: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeOrg, setActiveOrg] = React.useState(organizations[0])

  if (!activeOrg) {
    return null
  }

  const Logo = activeOrg.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {Logo ? (
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Logo className="size-4" />
                </div>
              ) : (
                <div className="bg-primary/20 flex aspect-square size-8 items-center justify-center rounded-lg font-semibold text-primary">
                  {activeOrg.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrg.name}</span>
                {activeOrg.plan && (
                  <span className="truncate text-xs">{activeOrg.plan}</span>
                )}
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
              <Link to="/" className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <Home className="size-4" />
                Go to Home
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org, index) => {
              const OrgLogo = org.logo
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => setActiveOrg(org)}
                  className="gap-2 p-2"
                >
                  {OrgLogo ? (
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <OrgLogo className="size-3.5 shrink-0" />
                    </div>
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded-md border font-semibold text-xs">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
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
  )
}
