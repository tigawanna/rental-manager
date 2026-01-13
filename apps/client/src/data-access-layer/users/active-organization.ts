import { authClient } from "@/lib/better-auth/client";
import { mutationOptions } from "@tanstack/react-query";

export const setActiveOrganizationMutationOptions = mutationOptions({
  mutationFn: async (organization: { organizationId: string }) => {
    const { data, error } =
      await authClient.organization.setActive(organization);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
});

// const { data, error } = await authClient.organization.getFullOrganization({
//   query: {
//     organizationId: "org-id",
//     organizationSlug: "org-slug",
//     membersLimit: 100,
//   },
// });
