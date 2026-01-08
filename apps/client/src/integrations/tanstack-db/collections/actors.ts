import { edenApi } from "@/integrations/eden/client";
import { queryClient } from "@/integrations/tanstack-query/client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

// Create collections with query-driven sync using Eden Treaty
export const actorsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["actors", "list"] as const,
    queryFn: async () => {
      const response = await edenApi.actors.list({ limit: 100 });
      if (response.error) throw new Error("Failed to fetch actors");
      return response.data?.data;
    },
    queryClient,
    getKey: (item) => item.actorId,
  }),
);
