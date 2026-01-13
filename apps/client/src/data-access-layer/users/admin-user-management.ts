import { authClient, BetterAuthUserRoles } from "@/lib/better-auth/client";
import { unwrapUnknownError } from "@/utils/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Org = { id: string; name?: string; slug?: string };

type FormValues = {
  name: string;
  email: string;
  password?: string;
  role?: string;
  orgId?: string | undefined;
};

/**
 * Query hook for fetching organizations
 */
export function useOrganizationsQuery() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list({});
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Mutation hook for creating a user
 */
export function useCreateUserMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FormValues) => {
      const { data, error } = await authClient.admin.createUser({
        name: payload.name,
        email: payload.email,
        password: payload.password!,
        role: payload.role as BetterAuthUserRoles,
      });
      if (error) throw error;
      return data;
    },
    onSuccess(data, variables) {
      toast.success("User created");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to create user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });
}

/**
 * Mutation hook for adding a user to an organization
 */
export function useAddUserToOrgMutation() {
  return useMutation({
    mutationFn: async (payload: { email: string; organizationId: string }) => {
      const { data, error } = await authClient.organization.inviteMember({
        email: payload.email,
        role: "member",
        organizationId: payload.organizationId,
      });
      if (error) throw error;
      return data;
    },
    onError() {
      toast.error("Failed to add user to organization");
    },
  });
}

/**
 * Mutation hook for updating a user
 */
export function useUpdateUserMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      data: Partial<FormValues>;
    }) => {
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to update user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });
}

/**
 * Mutation hook for setting a user's role
 */
export function useSetRoleMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: BetterAuthUserRoles;
    }) => {
      const result = await authClient.admin.setRole({ userId, role });
      const { data, error } = result;
      if (error) throw error;
      return data;
    },
    onSuccess(data) {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to change role", {
        description: err instanceof Error ? err.message : String(err),
      });
    },
  });
}

/**
 * Mutation hook for banning a user
 */
export function useBanUserMutation() {
  const qc = useQueryClient();

  return useMutation({
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to ban user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });
}

/**
 * Mutation hook for unbanning a user
 */
export function useUnbanUserMutation() {
  const qc = useQueryClient();

  return useMutation({
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to unban user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });
}

/**
 * Mutation hook for removing a user
 */
export function useRemoveUserMutation() {
  const qc = useQueryClient();

  return useMutation({
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError(err: unknown) {
      toast.error("Failed to remove user", {
        description: unwrapUnknownError(err).message,
      });
    },
  });
}
