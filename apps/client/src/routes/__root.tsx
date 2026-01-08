import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import ReactQueryDevtoolsPanel from "@/lib/tanstack/query/devtools";
import type { QueryClient } from "@tanstack/react-query";
import { TViewer } from "@/data-access-layer/users/viewer";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";

import "@/view-transition/angled-transition.css";
import "@/view-transition/wipe-transition.css";
import "@/view-transition/slides-transition.css";
import "@/view-transition/flip-transition.css";
import "@/view-transition/vertical-transition.css";

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
    <div className="content min-h-screen w-full bg-base-100">
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
