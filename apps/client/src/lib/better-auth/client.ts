import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { envVariables } from "../env";
import { ac, roles } from "@repo/isomorphic/auth-roles";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: envVariables.VITE_API_URL,
  plugins: [
    adminClient({
      ac,
      roles,
    }),
    organizationClient(),
  ],
});

export type InferUser = typeof authClient.$Infer.Session.user
export type InferUserRoles = keyof typeof roles;

