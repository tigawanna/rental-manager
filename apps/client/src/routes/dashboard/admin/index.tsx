import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Crown,
  Database,
  Key,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const stats = [
    {
      id: "total-users",
      title: "Total Users",
      value: "-",
      icon: Users,
      colorClass: "text-primary",
    },
    {
      id: "active-sessions",
      title: "Active Sessions",
      value: "-",
      icon: UserCheck,
      colorClass: "text-success",
    },
    {
      id: "banned-users",
      title: "Banned Users",
      value: "-",
      icon: UserX,
      colorClass: "text-error",
    },
    {
      id: "admins",
      title: "Admins",
      value: "-",
      icon: Crown,
      colorClass: "text-warning",
    },
  ];

  const tools = [
    {
      id: "users",
      title: "User Management",
      desc: "Create, edit, and manage all system users with advanced controls",
      icon: Users,
      status: "active",
      href: "/dashboard/admin/users",
      badgeClass: "bg-success/10 text-success border border-success/20",
      cta: "Manage Users",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      desc: "Configure user roles and access control policies",
      icon: Shield,
      status: "coming",
      hintColor: "text-warning",
      actionIcon: Key,
      cta: "Configure Roles",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      id: "activity",
      title: "Activity Logs",
      desc: "View system activity and audit logs for security monitoring",
      icon: Activity,
      status: "coming",
      hintColor: "text-info",
      actionIcon: BarChart3,
      cta: "View Logs",
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      id: "settings",
      title: "System Settings",
      desc: "Configure application settings and system preferences",
      icon: Settings,
      status: "coming",
      hintColor: "text-neutral-content",
      actionIcon: Database,
      cta: "System Config",
      iconBg: "bg-neutral/10",
      iconColor: "text-neutral-content",
    },
    {
      id: "analytics",
      title: "Analytics",
      desc: "View detailed analytics and performance metrics",
      icon: TrendingUp,
      status: "coming",
      hintColor: "text-accent-content",
      actionIcon: TrendingUp,
      cta: "View Analytics",
      iconBg: "bg-accent/10",
      iconColor: "text-accent-content",
    },
    {
      id: "security",
      title: "Security Center",
      desc: "Monitor security threats and manage system security",
      icon: AlertTriangle,
      status: "coming",
      hintColor: "text-error",
      actionIcon: Shield,
      cta: "Security Hub",
      iconBg: "bg-error/10",
      iconColor: "text-error",
    },
  ];

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto max-w-screen-2xl space-y-6 p-4 px-4 sm:p-6 sm:px-6 lg:px-12">
        {/* Header Section */}
        <div className="space-y-3 py-6 text-center sm:py-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Shield className="text-primary h-8 w-8" />
            </div>
            <h1 className="text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Manage users, roles, and system settings with powerful
            administrative controls
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.id}
                className="bg-base-200 relative overflow-hidden border-0"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base-content text-sm font-medium">
                        {s.title}
                      </p>
                      <p className="text-base-content text-3xl font-bold">
                        {s.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${s.colorClass}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Tools Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-semibold">Management Tools</h2>
            <p className="text-muted-foreground">
              Access powerful administrative features
            </p>
          </div>

          <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const ActionIcon = tool.actionIcon;

              return (
                <Card
                  key={tool.id}
                  className="group bg-card flex h-full flex-col border-0 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 ${tool.iconBg ?? "bg-primary/10"} group-hover:bg-primary/20 rounded-lg transition-colors`}
                        >
                          <Icon className={`h-6 w-6 ${tool.iconColor ?? ""}`} />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>

                      {tool.status === "active" ? (
                        <Badge variant="secondary" className={tool.badgeClass}>
                          Active
                        </Badge>
                      ) : (
                        <span className="ml-2" title="Coming soon" aria-hidden>
                          <Clock
                            className={`h-5 w-5 ${tool.hintColor ?? "text-muted-foreground"}`}
                          />
                        </span>
                      )}
                    </div>
                    <CardDescription className="hidden text-base sm:block">
                      {tool.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {tool.href ? (
                      <Link to={tool.href}>
                        <Button className="w-full py-2 text-sm transition-transform group-hover:scale-105 sm:py-3 sm:text-base">
                          <Icon className="mr-2 h-4 w-4" />
                          {tool.cta}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full py-2 text-sm"
                        variant="outline"
                        disabled
                      >
                        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                        {tool.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Status Section */}
        <Card className="bg-base-200 border-0">
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Zap className="text-primary h-5 w-5" />
              <CardTitle className="text-2xl">System Status</CardTitle>
            </div>
            <CardDescription className="text-base">
              All systems operational and running smoothly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-success/10 text-success border-success/20 border px-3 py-1">
                <div className="bg-success mr-2 h-2 w-2 rounded-full"></div>
                Database: Online
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20 border px-3 py-1">
                <div className="bg-success mr-2 h-2 w-2 rounded-full"></div>
                API: Healthy
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20 border px-3 py-1">
                <div className="bg-success mr-2 h-2 w-2 rounded-full"></div>
                Auth: Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
