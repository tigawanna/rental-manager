import { edenApi } from "@/integrations/eden/client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/integrations/tanstack-query/client";

export const filmCategoriesCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["list", "film-categories"] as const,
    queryFn: async () => {
      const response = await edenApi.filmCategories.list({ limit: 100 });
      if (response.error) throw new Error("Failed to fetch film-categories");
      return response.data?.data;
    },
    queryClient,
    getKey: (item) => `${item.filmId}-${item.categoryId}`,
  }),
);
