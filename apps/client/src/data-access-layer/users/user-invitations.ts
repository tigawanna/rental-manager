import { authClient, BetterAuthOrgRoles, BetterAuthUserRoles } from "@/lib/better-auth/client";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

// Query Options
export const organizationInvitationsQueryOptions = (
  organizationId?: string
) =>
  queryOptions({
    queryKey: ["invitations", organizationId],
    queryFn: async () => {
      const { data, error } =
        await authClient.organization.listInvitations({
          query: {
            organizationId,
          },
        });
      if (error) throw error;
      return data;
    },
  });

export const userInvitationsQueryOptions = queryOptions({
  queryKey: ["invitations","user"],
  queryFn: async () => {
    const { data, error } = await authClient.organization.listUserInvitations();
    if (error) throw error;
    return data;
  },
});

export const invitationQueryOptions = (invitationId: string) =>
  queryOptions({
    queryKey: ["invitations", invitationId],
    queryFn: async () => {
      const { data, error } = await authClient.organization.getInvitation({
        query: {
          id: invitationId,
        },
      });
      if (error) throw error;
      return data;
    },
  });

// Mutation Options


export type TInviteMemberPayload = NonNullable<Parameters<typeof authClient.organization.inviteMember>[0]>;

export const inviteMemberMutationOptions = mutationOptions({
  mutationFn: async (payload: TInviteMemberPayload) => {
    const { data, error } = await authClient.organization.inviteMember({
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
      resend: payload.resend,
    });
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [["invitations","organization"], ["invitations","user"]],
  },
});

// Accept Invitation Mutation
type TAcceptInvitationPayload = {
  invitationId: string;
};

export const acceptInvitationMutationOptions = mutationOptions({
  mutationFn: async (payload: TAcceptInvitationPayload) => {
    const { data, error } = await authClient.organization.acceptInvitation({
      invitationId: payload.invitationId
    });
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [
      ["invitations","user"],
      ["organizations"],
      ["organizations","members"],
    ],
  },
});

// Reject Invitation Mutation
type TRejectInvitationPayload = {
  invitationId: string;
};

export const rejectInvitationMutationOptions = mutationOptions({
  mutationFn: async (payload: TRejectInvitationPayload) => {
    const { data, error } = await authClient.organization.rejectInvitation({
      invitationId: payload.invitationId,
    });
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [["invitations","user"]],
  },
});

// Cancel Invitation Mutation
type TCancelInvitationPayload = {
  invitationId: string;
};

export const cancelInvitationMutationOptions = mutationOptions({
  mutationFn: async (payload: TCancelInvitationPayload) => {
    const { data, error } = await authClient.organization.cancelInvitation({
      invitationId: payload.invitationId,
    });
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [
      ["invitations","organization"],
      ["invitations","user"],
      ["invitations"],
    ],
  },
});
