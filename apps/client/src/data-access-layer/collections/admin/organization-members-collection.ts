/**
 * Organization Members Collection using TanStack DB Query Collection
 * Fetches all members for a specific organization
 * Filtering and sorting done client-side via TanStack DB select/where syntax
 */

import { authClient } from "@/lib/better-auth/client";
import { queryClient } from "@/main";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

export const organizationMembersCollection = createCollection(
  queryCollectionOptions({
    syncMode: "on-demand", // ← New!
    queryKey: ["organizations", "members"],
    queryFn: async (ctx) => {
      const organizationId = ctx?.meta?.organizationId as string | undefined;

      // if (!organizationId) {
      //   console.warn("No organizationId provided to organization members collection");
      //   return [];
      // }

      const { data, error } = await authClient.organization.listMembers({
        query: {
          organizationId: "WSAUjr456bf7NE0Laam3D2dVXKcQO95i",
          limit: 1000,
          offset: 0,
        },
      });
      if (error) throw error;
      return data?.members ?? [];
    },
    queryClient,
    getKey: (item) => item.userId,
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            const { data, error } = await authClient.organization.updateMemberRole({
              organizationId: m.modified.organizationId,
              role: m.modified.role,
              memberId: m.key,
            });
            if (error) throw error;
            return data;
          };
        })
      );
      return { refetch: true };
    },
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            const { error } = await authClient.organization.removeMember({
              organizationId: m.original.organizationId,
              memberIdOrEmail: m.key,
            });
            if (error) throw error;
          };
        })
      );
      return { refetch: true };
    },
  })
);
