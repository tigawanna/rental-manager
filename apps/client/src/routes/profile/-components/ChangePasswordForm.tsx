import { authClient } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

interface ChangePasswordFormProps {}

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const formOpts = formOptions({
  defaultValues: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  } satisfies ChangePasswordData,
});

export function ChangePasswordForm({}: ChangePasswordFormProps) {
  const mutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });
    },
    onSuccess() {
      toast.success("Password changed successfully");
      form.reset();
    },
    onError(error) {
      toast.error("Failed to change password", {
        description: error.message,
      });
    },
  });

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      if (value.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      await mutation.mutate({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
    },
  });

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Change Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField
            name="currentPassword"
            validators={{
              onChange: z.string().min(1, "Current password is required"),
            }}
          >
            {(field) => (
              <field.PasswordField
                label="Current Password"
                showPassword={false}
              />
            )}
          </form.AppField>

          <form.AppField
            name="newPassword"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters"),
            }}
          >
            {(field) => (
              <field.PasswordField label="New Password" showPassword={false} />
            )}
          </form.AppField>

          <form.AppField
            name="confirmPassword"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters"),
              onChangeListenTo: ["newPassword"],
            }}
          >
            {(field) => (
              <field.PasswordField
                label="Confirm New Password"
                showPassword={false}
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              label={mutation.isPending ? "Changing..." : "Change Password"}
              className="w-full"
            />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
