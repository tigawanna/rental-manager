import {
  Droplet,
  Home,
  LockIcon,
  NotepadText,
  ShieldCheck,
  Store,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

type DashboardRoute = {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: DashboardRoute;
};
type DashboardRouteProps = {
  iconSize?: number;
};
export const dashboard_routes = ({ iconSize }: DashboardRouteProps) =>
  [
    { name: "units", href: "/dashboard/units", icon: <Store size={iconSize} /> },
    {
      name: "utilities",
      href: "/dashboard/utilities",
      icon: (
        <div className="flex">
          <Droplet className="fill-info text-info" size={iconSize} />
          <Zap className="fill-warning text-warning" size={iconSize} />
        </div>
      ),
    },
    { name: "tenants", href: "/dashboard/tenants", icon: <Users size={iconSize} /> },
    { name: "payments", href: "/dashboard/payments", icon: <Wallet size={iconSize} /> },
    {
      name: "staff",
      href: "/dashboard/staff",
      icon: (
        <div className="flex">
          <Users size={iconSize} />
          <ShieldCheck size={iconSize} />
        </div>
      ),
    },
    { name: "todos", href: "/dashboard/todos", icon: <NotepadText size={iconSize} /> },
    {
      name: "admin",
      href: "/dashboard/admin",
      icon: <LockIcon size={iconSize} />,
      children: {
        name: "users",
        href: "/dashboard/admin/users",
        icon: <User size={iconSize} />,
      },
    },
  ] satisfies readonly DashboardRoute[];

export const routes = [
  {
    name: "Home",
    href: "/",
    icon: <Home />,
    children: undefined,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Store />,
    children: dashboard_routes,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: <User />,
    children: undefined,
  },
] as const;
