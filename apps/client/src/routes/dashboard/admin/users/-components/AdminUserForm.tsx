import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddUserToOrgMutation,
  useCreateUserMutation,
  useSetRoleMutation,
  useUpdateUserMutation,
} from "@/data-access-layer/users/admin-user-management";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import type { UserWithRole } from "better-auth/plugins";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";



type Mode = "create" | "edit";

type Props = {
  mode?: Mode;
  user?: UserWithRole | null;
  onSuccess?: (user?: UserWithRole | null) => void;
};

const formOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    role: "tenant",
  },
});

export function AdminUserForm({
  mode = "create",
  user,
  onSuccess,
}: Props) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const setRoleMutation = useSetRoleMutation();
  const addUserToOrgMutation = useAddUserToOrgMutation();

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
        const result = await createMutation.mutateAsync(value);
        if (selectedOrgId && value?.email) {
          await addUserToOrgMutation.mutateAsync({
            email: value.email,
            organizationId: selectedOrgId,
          });
        }
        if (onSuccess) onSuccess(result.user);
      } else {
        if (!user?.id) {
          toast.error("User ID is missing");
          return;
        }
        const result = await updateMutation.mutateAsync({ userId: user.id, data: value });
        if (onSuccess) onSuccess(result);
      }
    },
  });

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
                      onValueChange={(v: BetterAuthUserRoles) =>
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
          </div>
        </form>
      </div>
    </div>
  );
}
