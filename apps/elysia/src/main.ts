import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { root } from "@/controllers";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { AUTHORIZED_ORIGINS } from "./utils/constants";
import { betterAuthMiddleware } from "./controllers/auth";


// Export app instance for type generation
export const app = new Elysia({ adapter: node() })
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
          title: "Inventory Management API",
          version: "1.0.0",
          description:
            "A comprehensive inventory management system with user authentication and product management",
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
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "JWT Bearer token authentication",
            },
          },
        },
      },
    })
  )
  .use(root)
  .listen(4000, ({ url }) => {
    console.log(`🦊 Elysia is running at ${url}`);
  });
