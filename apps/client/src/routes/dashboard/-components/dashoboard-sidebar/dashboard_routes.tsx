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
import { SlOrganization } from "react-icons/sl";
import { GrUserAdmin } from "react-icons/gr";
import { FaUsersGear } from "react-icons/fa6";
import { PiWarehouseLight } from "react-icons/pi";

export const dashboard_routes = [
  { title: "units", href: "/dashboard/units", icon: PiWarehouseLight },
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
    icon: FaUsersGear,
  },
  { title: "todos", href: "/dashboard/todos", icon: NotepadText },
  {
    title: "admin",
    href: "/dashboard/admin",
    icon: GrUserAdmin,
    sublinks: [
      {
        title: "users",
        href: "/dashboard/admin/users",
        icon: User,
      },
      {
        title: "organizations",
        href: "/dashboard/admin/organizations",
        icon: SlOrganization,
      },
    ],
  },
] satisfies SidebarItem[];

interface CompoundIconProps extends ComponentProps<LucideIcon> {}

function UtilsIcon({ size, className, ...props }: CompoundIconProps) {
  return (
    <div className="flex gap-1">
      <Droplet
        className={twMerge("fill-info text-info size-3", className)}
        size={size}
        {...props}
      />
      <Zap
        className={twMerge("fill-warning text-warning size-3", className)}
        size={size}
        {...props}
      />
    </div>
  );
}
