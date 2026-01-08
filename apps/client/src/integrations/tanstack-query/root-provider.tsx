import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client";
import { TanStackDBProvider } from "../tanstack-db/provider";

export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackDBProvider>{children}</TanStackDBProvider>
    </QueryClientProvider>
  );
}
