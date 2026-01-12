import { authClient } from "@/lib/better-auth/client";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryKeyPrefixes } from "../query-keys";

// ============================================================================
// Organization Members - queries & mutations
// ============================================================================

type TOrganizationMembersInput = NonNullable<
  Parameters<typeof authClient.organization.listMembers>[0]
>;
export const organizationMembersQueryOptions = ({ query }: TOrganizationMembersInput) =>
  queryOptions({
    queryKey: [
      queryKeyPrefixes.organizations,
      "members",
      query?.organizationId,
      query?.limit,
      query?.offset,
      query?.sortBy,
      query?.sortDirection,
      query?.filterField,
      query?.filterOperator,
      query?.filterValue,
    ] as const,
    placeholderData:(prev)=>prev,
    queryFn: async () => {
      console.log("qurying members with:", query);
      const { data, error } = await authClient.organization.listMembers({
        query: {
          organizationId: query?.organizationId,
          limit: query?.limit,
          offset: query?.offset,
          sortBy: query?.sortBy,
          sortDirection: query?.sortDirection,
          filterField: query?.filterField,
          filterOperator: query?.filterOperator,
          filterValue: query?.filterValue,
        },
      });
      if (error) throw error;
      return data;
    },
    
  });

// Member Mutations

type TRemoveMemberInput = NonNullable<Parameters<typeof authClient.organization.removeMember>[0]>;
export const removeMemberMutationOptions = mutationOptions({
  mutationFn: async (payload: TRemoveMemberInput) => {
    const { data, error } = await authClient.organization.removeMember(payload);
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [
      [queryKeyPrefixes.organizations, "members"],
      [queryKeyPrefixes.organizations, "full"],
    ] as const,
  }
});

type TUpdateMemberRoleInput = NonNullable<
  Parameters<typeof authClient.organization.updateMemberRole>[0]
>;
export const updateMemberRoleMutationOptions = mutationOptions({
  mutationFn: async (payload: TUpdateMemberRoleInput) => {
    const { data, error } = await authClient.organization.updateMemberRole(payload);
    if (error) throw error;
    return data;
  },
  meta: {
    invalidates: [
      [queryKeyPrefixes.organizations, "members"],
      [queryKeyPrefixes.organizations, "full"],
    ] as const,
  },
});
