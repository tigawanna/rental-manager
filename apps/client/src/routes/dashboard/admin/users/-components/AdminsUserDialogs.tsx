import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useBanUserMutation,
  useRemoveUserMutation,
  useUnbanUserMutation,
} from "@/data-access-layer/users/admin-user-management";
import type { UserWithRole } from "better-auth/plugins";
import { useState } from "react";
import { AdminUserForm } from "./AdminUserForm";

type AdminsUserCreateDialogProps = {
  triggerLabel?: string;
  className?: string;
  onCreated?: (user?: UserWithRole | null) => void;
};

export function AdminsUserCreateDialog({
  triggerLabel = "Create user",
  className,
  onCreated,
}: AdminsUserCreateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <AdminUserForm
          mode="create"
          onSuccess={(user) => {
            setOpen(false);
            onCreated?.(user);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type AdminsUpdateUserDialogProps = {
  triggerLabel?: string;
  user?: UserWithRole | null;
  className?: string;
  onUpdated?: (user?: UserWithRole | null) => void;
};

export function AdminsUpdateUserDialog({
  triggerLabel = "Edit user",
  user,
  className,
  onUpdated,
}: AdminsUpdateUserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} disabled={!user}>
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <AdminUserForm
          mode="edit"
          user={user}
          onSuccess={(u) => {
            setOpen(false);
            onUpdated?.(u as UserWithRole | null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type AdminsBanUserDialogProps = {
  triggerLabel?: string;
  user?: UserWithRole | null;
  className?: string;
  onBanned?: (user?: UserWithRole | null) => void;
};

export function AdminsBanUserDialog({
  triggerLabel = "Ban user",
  user,
  className,
  onBanned,
}: AdminsBanUserDialogProps) {
  const [open, setOpen] = useState(false);
  const banMutation = useBanUserMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className={className} disabled={!user}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm ban</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to ban {user?.name ?? user?.email}? They will
          not be able to access their account.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!user?.id || banMutation.isPending}
            onClick={async () => {
              if (user?.id) {
                await banMutation.mutateAsync({ userId: user.id });
                setOpen(false);
                onBanned?.(undefined);
              }
            }}
          >
            {banMutation.isPending ? "Banning..." : "Confirm ban"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AdminsUnbanUserDialogProps = {
  triggerLabel?: string;
  user?: UserWithRole | null;
  className?: string;
  onUnbanned?: (user?: UserWithRole | null) => void;
};

export function AdminsUnbanUserDialog({
  triggerLabel = "Unban user",
  user,
  className,
  onUnbanned,
}: AdminsUnbanUserDialogProps) {
  const [open, setOpen] = useState(false);
  const unbanMutation = useUnbanUserMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className={className} disabled={!user}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm unban</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to unban {user?.name ?? user?.email}? They will
          regain access to their account.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={!user?.id || unbanMutation.isPending}
            onClick={async () => {
              if (user?.id) {
                await unbanMutation.mutateAsync({ userId: user.id });
                setOpen(false);
                onUnbanned?.(undefined);
              }
            }}
          >
            {unbanMutation.isPending ? "Unbanning..." : "Confirm unban"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AdminsRemoveUserDialogProps = {
  triggerLabel?: string;
  user?: UserWithRole | null;
  className?: string;
  onRemoved?: (user?: UserWithRole | null) => void;
};

export function AdminsRemoveUserDialog({
  triggerLabel = "Remove user",
  user,
  className,
  onRemoved,
}: AdminsRemoveUserDialogProps) {
  const [open, setOpen] = useState(false);
  const removeMutation = useRemoveUserMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className={className} disabled={!user}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm remove</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to remove {user?.name ?? user?.email}? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!user?.id || removeMutation.isPending}
            onClick={async () => {
              if (user?.id) {
                await removeMutation.mutateAsync({ userId: user.id });
                setOpen(false);
                onRemoved?.(undefined);
              }
            }}
          >
            {removeMutation.isPending ? "Removing..." : "Confirm remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
