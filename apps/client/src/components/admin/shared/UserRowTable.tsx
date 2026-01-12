import { RoleIcons } from "@/components/identity/RoleIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { getRelativeTimeString } from "@/utils/date-helpers";
import { UserMinus } from "lucide-react";
import { ReactNode } from "react";

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
  onRemove?: (userId: string) => void;
  isRemoving?: boolean;
  showRemoveButton?: boolean;
  extraBadges?: ReactNode;
}

export function UserRowTable({
  user,
  onRemove,
  isRemoving,
  showRemoveButton = false,
  extraBadges,
}: UserRowTableProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center justify-center">
          <RoleIcons role={(user.role as BetterAuthUserRoles) ?? "tenant"} />
        </div>
      </TableCell>
      <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
      <TableCell>{user.email}</TableCell>
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
      {showRemoveButton && (
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove?.(user.id)}
            disabled={isRemoving}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
