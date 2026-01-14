/**
 * Admin Users Collection using TanStack DB Query Collection
 * Fetches all users for admin management
 * Filtering and sorting done client-side via TanStack DB select/where syntax
 */

import { authClient } from "@/lib/better-auth/client";
import { queryClient } from "@/main";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

export const adminUsersCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 1000, // Fetch all for client-side filtering
        },
      });
      if (error) throw error;
      if (!data || !("users" in data)) {
        throw new Error("No users data available");
      }
      return data.users;
    },
    queryClient,
    getKey: (item) => item.id,
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            // Handle role changes
            if (m.modified.role && m.modified.role !== m.original?.role) {
              const { error } = await authClient.admin.setRole({
                userId: m.key,
                role: m.modified.role as "admin" | "tenant" | "landlord" | "manager" | "staff",
              });
              if (error) throw error;
            }
            // Handle ban status changes
            if (m.modified.banned !== m.original?.banned) {
              if (m.modified.banned) {
                const { error } = await authClient.admin.banUser({
                  userId: m.key,
                  banReason: m.modified.banReason ?? undefined,
                });
                if (error) throw error;
              } else {
                const { error } = await authClient.admin.unbanUser({
                  userId: m.key,
                });
                if (error) throw error;
              }
            }
          };
        }),
      );
      return { refetch: true };
    },
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => {
          return async () => {
            const { error } = await authClient.admin.removeUser({
              userId: m.key,
            });
            if (error) throw error;
          };
        }),
      );
      return { refetch: true };
    },
  }),
);
