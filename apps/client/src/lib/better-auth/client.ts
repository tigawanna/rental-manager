import { ac, roles } from "@repo/isomorphic/auth-roles";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { envVariables } from "../env";
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

export type BetterAuthSession = typeof authClient.$Infer.Session
export type BetterAuthUserRoles = keyof typeof roles;
export type BetterAuthOrgRoles = "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];
