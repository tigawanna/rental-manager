import { SidebarItem } from "@/components/sidebar/types";
import {
  Droplet,
  LockIcon,
  LucideIcon,
  NotepadText,
  ShieldCheck,
  Store,
  User,
  Users,
  Users2Icon,
  Wallet,
  Zap,
} from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const dashboard_routes = [
  { title: "units", href: "/dashboard/units", icon: Store },
  {
    title: "utilities",
    href: "/dashboard/utilities",
    icon: Zap,
  },
  { title: "tenants", href: "/dashboard/tenants", icon: Users },
  { title: "payments", href: "/dashboard/payments", icon: Wallet },
  {
    title: "staff",
    href: "/dashboard/staff",
    icon: Users2Icon,
  },
  { title: "todos", href: "/dashboard/todos", icon: NotepadText },
  {
    title: "admin",
    href: "/dashboard/admin",
    icon: LockIcon,
    sublinks: [
      {
        title: "users",
        href: "/dashboard/admin/users",
        icon: User,
      },
    ],
  },
] satisfies SidebarItem[];

interface CompoundIconProps extends ComponentProps<LucideIcon> {}

function UtilsIcon({ size, className, ...props }: CompoundIconProps) {
  return (
    <div className="flex gap-1">
      <Droplet className={twMerge("fill-info text-info size-3", className)} size={size} {...props} />
      <Zap className={twMerge("fill-warning text-warning size-3", className)} size={size} {...props} />
    </div>
  );
}


