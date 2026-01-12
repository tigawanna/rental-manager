import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { fullOrganizationQueryOptions } from "@/data-access-layer/users/user-orgs";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2 } from "lucide-react";
import { EditOrg } from "./OrgDialogs";

interface OrgDetailsProps {
  orgId: string;
}

export function OrgDetails({ orgId }: OrgDetailsProps) {
  const navigate = useNavigate();
  
  const query = useQuery(
    fullOrganizationQueryOptions({
      query: {
        organizationId: orgId,
      },
    })
  );

  if (query.error) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>Error Loading Organization</EmptyTitle>
            <EmptyDescription>
              {query.error instanceof Error ? query.error.message : "An error occurred"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: "/dashboard/admin/organizations" })}>
                Back to List
              </Button>
              <Button onClick={() => query.refetch()}>Try Again</Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading organization details…</div>
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="h-full mx-auto p-6 w-full flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>Organization Not Found</EmptyTitle>
            <EmptyDescription>
              The organization you&apos;re looking for doesn&apos;t exist or you don&apos;t have
              access to it.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => navigate({ to: "/dashboard/admin/organizations" })}>
              Back to Organizations
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const org = query.data;

  return (
    <div className="h-full w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/dashboard/admin/organizations" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{org.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organization details and settings
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <EditOrg
            org={{
              organizationId: org.id,
              body: {
                name: org.name,
                slug: org.slug,
                logo: org.logo ?? undefined,
                metadata: org.metadata,
              },
            }}
            triggerLabel="Edit Organization"
          />
        </div>
      </div>

      {/* Organization Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
              <p className="text-base">{org.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Slug</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">{org.slug}</code>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Organization ID</p>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">{org.id}</code>
            </div>
            {org.logo && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Logo</p>
                <img src={org.logo} alt={org.name} className="h-12 w-12 rounded" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Organization metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
              <p className="text-2xl font-bold">{org.members?.length ?? 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
              <p className="text-base" title={String(org.createdAt ?? "")}>
                {org.createdAt ? getRelativeTimeString(new Date(org.createdAt)) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      {org.metadata && Object.keys(org.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Additional organization information</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(org.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Recent Members */}
      {org.members && org.members.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>Latest members in this organization</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: `/dashboard/admin/organizations/${orgId}/members` })}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {org.members.slice(0, 5).map((member) => (
                <div
                  key={member?.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{member?.userId ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {member?.createdAt
                        ? `Joined ${getRelativeTimeString(new Date(member.createdAt))}`
                        : ""}
                    </p>
                  </div>
                  <Badge variant="outline">{member?.role ?? "member"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
