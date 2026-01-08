import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { AUTHORIZED_ORIGINS } from "@/utils/constants";
import { auth, BetterAuthOpenAPI } from "@/lib/auth";
import { indexRoute } from ".";



export const allRoutes = new Elysia()
  .use(
    cors({
      origin: AUTHORIZED_ORIGINS,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    openapi({
      // Use production types in production, source files in development
      references: fromTypes(
        process.env.NODE_ENV === "production" ? "dist/main.d.ts" : "src/main.ts"
      ),
      // OpenAPI documentation configuration
      documentation: {
        info: {
          title: "Rental management API",
          version: "1.0.0",
          description:
            "A comprehensive rental management system with user authentication and staff management",
        },
        // Define available tags for organizing endpoints
        tags: [
          {
            name: "General",
            description: "General application endpoints",
          },
          {
            name: "Authentication",
            description: "User authentication and authorization endpoints",
          },
          {
            name: "User",
            description: "User profile and management endpoints",
          },
        ],
        // Security schemes definition
        components: await BetterAuthOpenAPI.components,
        paths: await BetterAuthOpenAPI.getPaths(),
      },
    })
  )
  .mount("/auth", auth.handler)
  .use(indexRoute);
