import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/better-auth/client";

type InferGetSession = NonNullable<Awaited<ReturnType<typeof authClient.getSession<any>>>>;
type ViewerPayloadData = Extract<InferGetSession, { data: any; error: null }>["data"];
type ViewerPayloadError = Extract<InferGetSession, { data: null; error: any }>["error"];
type ViewerUser = NonNullable<ViewerPayloadData>["user"];
type ViewerSession = NonNullable<ViewerPayloadData>["session"];


export type TRoles = "tenant" | "staff" | "admin" | "manager";
export type TViewer = {
  user?: ViewerUser;
  session?: ViewerSession;
};
export const viewerqueryOptions = queryOptions({
  queryKey: ["viewer"],
  queryFn: async () => {
    const { data, error } = await authClient.getSession();
    if (error) {
      return {
        data: null,
        error,
      };
    }
    return { data, error: null };
  },
});

export function useViewer() {
  const qc = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      qc.invalidateQueries(viewerqueryOptions);
      throw redirect({ to: "/auth", search: { returnTo: "/" } });
    },
  });
  const viewerQuery = useSuspenseQuery(viewerqueryOptions);

  return {
    viewerQuery,
    viewer: {
      user: viewerQuery.data.data?.user,
      session: viewerQuery.data.data?.session,
    },
    logoutMutation,
  } as const;
}
