import { edenApi } from "@/integrations/eden/client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/integrations/tanstack-query/client";

export const filmsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["movies", "list"] as const,
    queryFn: async () => {
      const response = await edenApi.films.list({ limit: 100 });
      if (response.error) throw new Error("Failed to fetch films");
      return response.data?.data;
    },
    queryClient,
    getKey: (item) => item.filmId,
  }),
);
