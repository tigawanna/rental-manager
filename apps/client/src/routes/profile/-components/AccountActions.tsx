import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { authClient } from "@/lib/better-auth/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AccountActionsProps {}

export function AccountActions({}: AccountActionsProps) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authClient.signOut();
    },
    onSuccess() {
      qc.invalidateQueries(viewerqueryOptions);
      navigate({ to: "/auth", search: { returnTo: "/" } });
      toast.success("Logged out successfully");
    },
    onError(error) {
      toast.error("Failed to logout", {
        description: error.message,
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // Note: Better-auth doesn't have a built-in delete account method
      // You'll need to implement this on your backend
      throw new Error("Delete account not implemented yet");
    },
    onSuccess() {
      qc.invalidateQueries(viewerqueryOptions);
      navigate({ to: "/", replace: true });
      toast.success("Account deleted successfully");
    },
    onError(error) {
      toast.error("Failed to delete account", {
        description: error.message,
      });
    },
  });

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Account Actions</h2>
        <div className="space-y-3">
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="btn btn-outline btn-error w-full gap-2">
            <LogOut className="size-5" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>

          <div className="divider">Danger Zone</div>

          <button
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="btn btn-error w-full gap-2">
            <Trash2 className="size-5" />
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
