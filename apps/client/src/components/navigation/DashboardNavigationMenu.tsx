import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import React from "react";
import { cn } from "@/lib/utils";
import { routes } from "./routes";
interface DashboardNavigationMenuProps {}

export function DashboardNavigationMenu({}: DashboardNavigationMenuProps) {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        {routes.map((route) => {
          if(route.title==="Home"){
            return
          }
          if (!route.sublinks) {
            return (
              <NavigationMenuItem key={route.title}>
                <NavigationMenuLink asChild>
                  <Link to={route.href}>{route.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
          return (
            <NavigationMenuItem
              key={route.title}
            >
              <NavigationMenuTrigger className="hover:bg-primary">
                {route.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 bg-primary/20 p-1 rounded-md sm:w-62.5 md:w-100 sm:grid-cols-2 lg:grid-cols-[.75fr_1fr]">
                  {route.sublinks.map((child) => (
                    <NavigationMenuLink
                      asChild
                      key={child.title}
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-base-300 to-base-100 p-2 no-underline outline-none hover:via-primary/30 focus:shadow-md"
                    >
                      <Link to={child.href} className="">
                        <div className="flex w-full justify-evenly gap-2 p-2">
                          {child.title}
                          <child.icon/>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export interface NavItemProps {
  to: string;
  label: string;
  Icon?: React.ReactNode;
}

export function NavItem({ label, to, Icon }: NavItemProps) {
  return (
    <NavigationMenuItem className="m-0!">
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className={cn(
            "box-border flex flex-1 flex-row items-center gap-2.5 rounded-lg p-4 underline-offset-2 hover:bg-accent",
          )}
          activeProps={{
            className: "bg-base-100 font-semibold underline hover:bg-base-100/70",
          }}
        >
          {Icon}
          {label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
