import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { UserMinus } from "lucide-react";
import { ReactNode } from "react";

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
  onRemove?: (userId: string) => void;
  isRemoving?: boolean;
  showRemoveButton?: boolean;
  extraBadges?: ReactNode;
}

export function UserRowCard({
  user,
  onRemove,
  isRemoving,
  showRemoveButton = false,
  extraBadges,
}: UserRowCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{user.name ?? "—"}</CardTitle>
          <RoleIcons role={(user.role as BetterAuthUserRoles) ?? "tenant"} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <p className="text-sm">{user.email}</p>
        </div>
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
        {showRemoveButton && onRemove && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onRemove(user.id)}
            disabled={isRemoving}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Remove Member
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
