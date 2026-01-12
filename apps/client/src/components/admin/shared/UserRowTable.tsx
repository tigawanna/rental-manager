import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { Settings } from "lucide-react";
import { ReactNode, useState } from "react";
import { UserActionsDialog } from "./UserActionsDialog";

interface UserRowTableProps {
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

export function UserRowTable({
  user,
  orgId,
  showActions = false,
  showEmail = true,
  extraBadges,
  onSuccess,
}: UserRowTableProps) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center justify-center">
            <RoleIcons role={(user.role as BetterAuthUserRoles) ?? "tenant"} />
          </div>
        </TableCell>
        <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
        {showEmail !== false && <TableCell>{user.email}</TableCell>}
        <TableCell className="space-x-2">
          {user.emailVerified ? (
            <Badge variant="outline">Verified</Badge>
          ) : (
            <Badge variant="secondary">Unverified</Badge>
          )}
          {user.banned ? <Badge variant="destructive">Banned</Badge> : null}
          {user.role ? <Badge variant="outline">{user.role}</Badge> : null}
          {extraBadges}
        </TableCell>
        <TableCell title={String(user.createdAt ?? "")}>
          {user.createdAt ? getRelativeTimeString(new Date(user.createdAt)) : "—"}
        </TableCell>
        {showActions && (
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActionsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Actions
            </Button>
          </TableCell>
        )}
      </TableRow>

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
