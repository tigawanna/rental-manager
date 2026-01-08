import { Droplet, Home, NotepadText, ShieldCheck, Store, User, Users, Wallet, Zap } from "lucide-react";

export const dashboard_routes = [
  { name: "units", href: "/dashboard/units", icon: <Store /> },
  {
    name: "utilities",
    href: "/dashboard/utilities",
    icon: (
      <div className="flex">
        <Droplet className="fill-info text-info" />
        <Zap className="fill-warning text-warning" />
      </div>
    ),
  },
  { name: "tenants", href: "/dashboard/tenants", icon: <Users /> },
  { name: "payments", href: "/dashboard/payments", icon: <Wallet /> },
  { name: "staff", href: "/dashboard/staff", icon: <div className="flex">
    <Users />
    <ShieldCheck />

  </div> },
  { name: "todos", href: "/dashboard/todos", icon: <NotepadText />},
] as const;



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


