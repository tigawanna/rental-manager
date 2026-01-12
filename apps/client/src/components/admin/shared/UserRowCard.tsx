import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { Settings } from "lucide-react";
import { ReactNode, useState } from "react";
import { UserActionsDialog } from "./UserActionsDialog";

interface UserRowCardProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    role?: string | null;
    emailVerified?: boolean;
    banned?: boolean;
    createdAt?: Date | string | null;
  };
  orgId?: string; // When provided, shows org-specific actions
  showActions?: boolean;
  showEmail?: boolean;
  extraBadges?: ReactNode;
  onSuccess?: () => void;
}

export function UserRowCard({
  user,
  orgId,
  showActions = false,
  showEmail = true,
  extraBadges,
  onSuccess,
}: UserRowCardProps) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0">
                <RoleIcons role={(user.role as BetterAuthUserRoles) ?? "tenant"} />
              </div>
              <CardTitle className="text-base truncate">{user.name ?? "—"}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 overflow-hidden">
          {showEmail !== false && (
            <div className="max-w-full overflow-hidden">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm wrap-break-word truncate">{user.email}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {user.emailVerified ? (
                <Badge variant="outline">Verified</Badge>
              ) : (
                <Badge variant="secondary">Unverified</Badge>
              )}
              {user.banned ? <Badge variant="destructive">Banned</Badge> : null}
              {user.role ? <Badge variant="outline">{user.role}</Badge> : null}
              {extraBadges}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm" title={String(user.createdAt ?? "")}>
              {user.createdAt ? getRelativeTimeString(new Date(user.createdAt)) : "—"}
            </p>
          </div>
          {showActions && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setActionsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Manage User
            </Button>
          )}
        </CardContent>
      </Card>

      <UserActionsDialog
        open={actionsOpen}
        onOpenChange={setActionsOpen}
        user={user}
        orgId={orgId}
        onSuccess={onSuccess}
      />
    </>
  );
}
