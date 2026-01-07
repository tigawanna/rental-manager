/**
 * Better Auth Middleware with RBAC Support
 * 
 * Usage Examples:
 * 
 * 1. Basic Authentication:
 *    app.get('/profile', ({ user }) => user, { auth: true })
 * 
 * 2. Role-Based Access Control:
 *    app.post('/properties', ({ user }) => createProperty(), { 
 *      requireRole: ['admin', 'landlord'] 
 *    })
 * 
 * 3. Permission-Based Access Control:
 *    app.put('/properties/:id', ({ user, resourceId }) => updateProperty(resourceId), {
 *      requirePermission: { user: ['update'], property: ['delete'] }
 *    })
 * 
 * Available Roles:
 * - admin: Full system access
 * - user: Regular user access
 * 
 * Available Resources:
 * - user (permissions: create, list, set-role, ban, delete)
 * - session (permissions: list, revoke)
 * 
 * Available Actions:
 * - create, list, set-role, ban, delete (user)
 * - list, revoke (session)
 */

import { auth } from "@/lib/auth";
import { Elysia } from "elysia";


// Better Auth middleware with authentication and RBAC macros
export const betterAuthMiddleware = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
    requireRole: (requireRole: string[]) => ({
      /**
       * Checks if the authenticated user has one of the required roles
       * @param requireRole - Array of role names allowed to access this route
       * @returns 401 if not authenticated, 403 if user doesn't have required role
       * @example
       * // Allow only admins
       * app.post('/admin', handler, { requireRole: ['admin'] })
       * 
       * // Allow admins or users
       * app.get('/data', handler, { requireRole: ['admin', 'user'] })
       */
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        const userRole = session.user.role || "user";
        if (!requireRole.includes(userRole)) {
          return status(403);
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    }),
    requirePermission: (permission: Record<string, string[]>) => ({
      /**
       * Checks if the authenticated user's role has specific permissions
       * @param permission - Object mapping resources to required actions
       * @returns 401 if not authenticated, 403 if user doesn't have required permissions
       * @example
       * // Require 'create' permission on 'user' resource
       * app.post('/users', handler, { requirePermission: { user: ['create'] } })
       * 
       * // Require multiple permissions
       * app.put('/users/:id', handler, { requirePermission: { user: ['update'], session: ['revoke'] } })
       * 
       * // Admin has all permissions by default
       */
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        const userRole = (session.user.role || "user") as "admin" | "user";
        const hasPermission = await auth.api.userHasPermission({
          body: {
            role: userRole,
            permissions: permission,
          },
        });

        if (!hasPermission) {
          return status(403);
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    }),
  });

