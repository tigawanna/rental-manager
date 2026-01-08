import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { RouterPendingComponent } from "./lib/tanstack/router/RouterPendingComponent";
import { RouterNotFoundComponent } from "./lib/tanstack/router/RouterNotFoundComponent";
import { RouterErrorComponent } from "./lib/tanstack/router/routerErrorComponent";

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultPendingComponent: () => <RouterPendingComponent />,
    defaultNotFoundComponent: () => <RouterNotFoundComponent />,
    defaultErrorComponent: ({ error }) => (
      <RouterErrorComponent error={error} />
    ),
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
