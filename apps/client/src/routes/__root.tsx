import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import ReactQueryDevtoolsPanel from "@/lib/tanstack/query/devtools";
import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { TViewer } from "@/data-access-layer/users/viewer";
import { Toaster } from "@/components/ui/sonner";


const searchparams = z.object({
  globalPage: z.number().optional(),
  globalSearch: z.string().optional(),
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  viewer?: TViewer;
}>()({
  component: RootComponent,
  validateSearch: (search) => searchparams.parse(search),
});

export function RootComponent() {
  return (
    <div className="content min-h-screen w-full">
      <Outlet />
      <Toaster />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          ReactQueryDevtoolsPanel,
        ]}
      />
    </div>
  );
}
