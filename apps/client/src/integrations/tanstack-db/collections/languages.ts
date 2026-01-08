import { edenApi } from "@/integrations/eden/client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/integrations/tanstack-query/client";

export const languagesCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["list", "languages"] as const,
    queryFn: async () => {
      const response = await edenApi.languages.list({ limit: 100 });
      if (response.error) throw new Error("Failed to fetch languages");
      return response.data?.data;
    },
    queryClient,
    getKey: (item) => item.languageId,
  }),
);
