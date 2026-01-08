import type { RegisteredRouter } from "@tanstack/react-router";

// Export the registered router type for use in type utilities
export type AppRouter = RegisteredRouter;

// Helper type to get all valid route paths
export type ValidRoutes =
  RegisteredRouter["routesByPath"][keyof RegisteredRouter["routesByPath"]]["fullPath"];
