import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
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
  Zap
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const stats = [
    { id: 'total-users', title: 'Total Users', value: '-', icon: Users, colorClass: 'text-primary' },
    { id: 'active-sessions', title: 'Active Sessions', value: '-', icon: UserCheck, colorClass: 'text-success' },
    { id: 'banned-users', title: 'Banned Users', value: '-', icon: UserX, colorClass: 'text-error' },
    { id: 'admins', title: 'Admins', value: '-', icon: Crown, colorClass: 'text-warning' },
  ];

  const tools = [
    {
      id: 'users',
      title: 'User Management',
      desc: 'Create, edit, and manage all system users with advanced controls',
      icon: Users,
      status: 'active',
      href: '/dashboard/admin/users',
      badgeClass: 'bg-success/10 text-success border border-success/20',
      cta: 'Manage Users',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      desc: 'Configure user roles and access control policies',
      icon: Shield,
      status: 'coming',
      hintColor: 'text-warning',
      actionIcon: Key,
      cta: 'Configure Roles',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      id: 'activity',
      title: 'Activity Logs',
      desc: 'View system activity and audit logs for security monitoring',
      icon: Activity,
      status: 'coming',
      hintColor: 'text-info',
      actionIcon: BarChart3,
      cta: 'View Logs',
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
    {
      id: 'settings',
      title: 'System Settings',
      desc: 'Configure application settings and system preferences',
      icon: Settings,
      status: 'coming',
      hintColor: 'text-neutral-content',
      actionIcon: Database,
      cta: 'System Config',
      iconBg: 'bg-neutral/10',
      iconColor: 'text-neutral-content',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      desc: 'View detailed analytics and performance metrics',
      icon: TrendingUp,
      status: 'coming',
      hintColor: 'text-accent-content',
      actionIcon: TrendingUp,
      cta: 'View Analytics',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent-content',
    },
    {
      id: 'security',
      title: 'Security Center',
      desc: 'Monitor security threats and manage system security',
      icon: AlertTriangle,
      status: 'coming',
      hintColor: 'text-error',
      actionIcon: Shield,
      cta: 'Security Hub',
      iconBg: 'bg-error/10',
      iconColor: 'text-error',
    },
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        {/* Header Section */}
        <div className="text-center space-y-3 py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage users, roles, and system settings with powerful administrative controls
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.id} className="relative overflow-hidden border-0 bg-base-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-base-content">{s.title}</p>
                      <p className="text-3xl font-bold text-base-content">{s.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${s.colorClass}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Management Tools Section */}
        <div className="space-y-6 ">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Management Tools</h2>
            <p className="text-muted-foreground">Access powerful administrative features</p>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const ActionIcon = tool.actionIcon;

              return (
                <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${tool.iconBg ?? 'bg-primary/10'} rounded-lg group-hover:bg-primary/20 transition-colors`}>
                          <Icon className={`h-6 w-6 ${tool.iconColor ?? ''}`} />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>

                      {tool.status === 'active' ? (
                        <Badge variant="secondary" className={tool.badgeClass}>
                          Active
                        </Badge>
                      ) : (
                        <span className="ml-2" title="Coming soon" aria-hidden>
                          <Clock className={`h-5 w-5 ${tool.hintColor ?? 'text-muted-foreground'}`} />
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-base hidden sm:block">
                      {tool.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {tool.href ? (
                      <Link to={tool.href}>
                        <Button className="w-full py-2 sm:py-3 text-sm sm:text-base group-hover:scale-105 transition-transform">
                          <Icon className="mr-2 h-4 w-4" />
                          {tool.cta}
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full py-2 text-sm" variant="outline" disabled>
                        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                        {tool.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* System Status Section */}
        <Card className="border-0 bg-base-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">System Status</CardTitle>
            </div>
            <CardDescription className="text-base">
              All systems operational and running smoothly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-success/10 text-success px-3 py-1 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Database: Online
              </Badge>
              <Badge className="bg-success/10 text-success px-3 py-1 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                API: Healthy
              </Badge>
              <Badge className="bg-success/10 text-success px-3 py-1 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Auth: Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
