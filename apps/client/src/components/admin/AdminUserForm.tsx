import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRoles } from "@/data-access-layer/users/viewer";
import { authClient, InferUserRoles } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { CreateOrg } from "@/routes/dashboard/admin/organizations/-components/OrgDialogs";
import { unwrapUnknownError } from "@/utils/errors";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserWithRole } from "better-auth/plugins";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type Org = { id: string; name?: string; slug?: string };

type Mode = "create" | "edit";

type Props = {
  mode?: Mode;
  user?: UserWithRole | null;
  onSuccess?: (user?: UserWithRole | null) => void;
};

type FormValues = {
  name: string;
  email: string;
  password?: string;
  role?: string;
  orgId?: string | undefined;
};

const formOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    role: "tenant",
  },
});

export function AdminUserForm({ mode = "create", user, onSuccess }: Props) {
  const qc = useQueryClient();
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  const orgsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list({});
      if (error) throw error;
      return data;
    },
  });

  const orgOptions = orgsQuery.data;

  const createMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const { data, error } = await authClient.admin.createUser({
        name: payload.name,
        email: payload.email,
        password: payload.password!,
        role: payload.role as TRoles,
      });
      if (error) throw error;
      return data;
    },
    onSuccess(data, variables) {
      if (selectedOrgId && variables?.email) {
        (async () => {
          try {
            const { data: inviteData, error } = await authClient.organization.inviteMember({
              email: variables.email,
              role: "member",
              organizationId: selectedOrgId,
            });
            if (error) toast.error("User created but failed to add to organization");
          } catch (err: unknown) {
            toast.error("User created but adding to org failed");
          }
        })();
      }
      toast.success("User created");
      qc.invalidateQueries({ queryKey: ["users"] });
      if (onSuccess) onSuccess(data.user);
    },
    onError(err: unknown) {
      toast.error("Failed to create user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { userId: string; data: Partial<FormValues> }) => {
      // try using admin.updateUser if available
      const result = await authClient.admin.updateUser({
        userId: payload.userId,
        data: payload.data,
      });
      const { data, error } = result;
      if (error) throw error;
      return data;
    },
    onSuccess(data) {
      toast.success("User updated");
      if (onSuccess) onSuccess(data);
    },
    onError(err: unknown) {
      toast.error("Failed to update user", {
        description: unwrapUnknownError(err).message,
      });
    },
    meta: {
      invalidates: [["users"]],
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: InferUserRoles }) => {
      const result = await authClient.admin.setRole({ userId, role });
      const { data, error } = result;
      if (error) throw error;
      return data;
    },
    onSuccess(data) {
      toast.success("Role updated");
      if (onSuccess) onSuccess(data.user);
    },
    onError(err: unknown) {
      toast.error("Failed to change role", {
        description: err instanceof Error ? err.message : String(err),
      });
    },
    meta: {
      invalidates: [["users"]],
    },
  });

  const banMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      if (typeof authClient.admin.banUser === "function") {
        const result = await authClient.admin.banUser({ userId });
        const { data, error } = result;
        if (error) throw error;
        return data;
      }
      throw new Error("banUser not available");
    },
    onSuccess() {
      toast.success("User banned");
      if (onSuccess) onSuccess(undefined);
    },
    onError(err: unknown) {
      toast.error("Failed to ban user", {
        description: unwrapUnknownError(err).message,
      });
    },
    meta: {
      invalidates: [["users"]],
    },
  });

  const unbanMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      if (typeof authClient.admin.unbanUser === "function") {
        const result = await authClient.admin.unbanUser({ userId });
        const { data, error } = result;
        if (error) throw error;
        return data;
      }
      throw new Error("unbanUser not available");
    },
    onSuccess() {
      toast.success("User unbanned");
      if (onSuccess) onSuccess(undefined);
    },
    onError(err: unknown) {
      toast.error("Failed to unban user", {
        description: unwrapUnknownError(err).message,
      });
    },
    meta: {
      invalidates: [["users"]],
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      if (typeof authClient.admin.removeUser === "function") {
        const result = await authClient.admin.removeUser({ userId });
        const { data, error } = result;
        if (error) throw error;
        return data;
      }
      throw new Error("removeUser not available");
    },
    onSuccess() {
      toast.success("User removed");
      if (onSuccess) onSuccess(undefined);
    },
    onError(err: unknown) {
      toast.error("Failed to remove user", {
        description: unwrapUnknownError(err).message,
      });
    },
    meta: {
      invalidates: [["users"]],
    },
  });

  const form = useAppForm({
    ...formOpts,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "tenant",
    },
    onSubmit: async ({ value }) => {
      // basic validation
      const schema = z.object({
        name: z.string().min(1, "Name required"),
        email: z.email("Invalid email"),
        password:
          mode === "create"
            ? z.string().min(8, "Password must be at least 8 characters")
            : z.string().optional(),
        role: z.string().optional(),
      });

      const result = schema.safeParse(value);
      if (!result.success) {
        toast.error("Validation error", {
          description: result.error.issues.map((i) => i.message).join(", "),
        });
        return;
      }

      if (mode === "create") {
        await createMutation.mutateAsync(value);
      } else {
        if (!user?.id) {
          toast.error("User ID is missing");
          return;
        }
        await updateMutation.mutateAsync({ userId: user.id, data: value });
      }
    },
  });

  // ban/unban/remove dialogs state
  const [banOpen, setBanOpen] = useState(false);
  const [unbanOpen, setUnbanOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{mode === "create" ? "Create User" : "Edit User"}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4">
          <form.AppField
            name="name"
            validators={{ onChange: z.string().min(1, "Name is required") }}>
            {(f) => <f.TextField label="Name" />}
          </form.AppField>

          <form.AppField name="email" validators={{ onChange: z.string().email("Invalid email") }}>
            {(f) => <f.EmailField />}
          </form.AppField>

          {mode === "create" && (
            <form.AppField
              name="password"
              validators={{ onChange: z.string().min(8, "Password at least 8 chars") }}>
              {(f) => <f.PasswordField label="Password" />}
            </form.AppField>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <form.AppField name="role">
                {(f) => (
                  <f.SelectField
                    label="Role"
                    items={[
                      { label: "admin", value: "admin" },
                      { label: "landlord", value: "landlord" },
                      { label: "manager", value: "manager" },
                      { label: "staff", value: "staff" },
                      { label: "tenant", value: "tenant" },
                    ]}
                  />
                )}
              </form.AppField>

              {mode === "edit" && user?.id ? (
                <div className="mt-2">
                  <label className="text-sm">Change role immediately</label>
                  <div className="flex gap-2 items-center mt-2">
                    <Select
                      value={user?.role ?? "tenant"}
                      onValueChange={(v: InferUserRoles) =>
                        setRoleMutation.mutateAsync({ userId: user.id, role: v })
                      }>
                      <SelectTrigger className="min-w-56">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="landlord">landlord</SelectItem>
                        <SelectItem value="manager">manager</SelectItem>
                        <SelectItem value="staff">staff</SelectItem>
                        <SelectItem value="tenant">tenant</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      Role will change immediately
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex-1">
              <label className="text-sm">Add to Organization (optional)</label>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedOrgId ?? "__none"}
                  onValueChange={(v) => setSelectedOrgId(v === "__none" ? undefined : v)}>
                  <SelectTrigger className="min-w-56">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {(orgOptions ?? []).map((o: Org) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name ?? o.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <CreateOrg
                  triggerLabel="Create org"
                  className="h-10"
                  onCreated={(org) => {
                    setSelectedOrgId(org.id);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {mode === "edit" && (
              <>
                <Dialog open={banOpen} onOpenChange={setBanOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Ban user</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm ban</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setBanOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!user?.id}
                        onClick={() => {
                          if (user?.id) banMutation.mutateAsync({ userId: user.id });
                        }}>
                        Confirm ban
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={unbanOpen} onOpenChange={setUnbanOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Unban user</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm unban</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setUnbanOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!user?.id}
                        onClick={() => {
                          if (user?.id) unbanMutation.mutateAsync({ userId: user.id });
                        }}>
                        Confirm unban
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Remove user</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm remove</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setRemoveOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!user?.id}
                        onClick={() => {
                          if (user?.id) removeMutation.mutateAsync({ userId: user.id });
                        }}>
                        Remove
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            <form.AppForm>
              <form.SubmitButton
                label={
                  mode === "create"
                    ? createMutation.isPending
                      ? "Creating..."
                      : "Create user"
                    : updateMutation.isPending
                      ? "Saving..."
                      : "Save"
                }
                className="w-full"
              />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  );
}
