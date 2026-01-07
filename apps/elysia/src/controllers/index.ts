import { Elysia } from "elysia";


export const indexRoute = new Elysia()
  .get("/", () => ({ message: "hello world", status: "ok" }), {
    detail: {
      summary: "Health Check",
      description: "Check if the API is running",
      tags: ["General"],
      responses: {
        200: {
          description: "API is healthy and running",
        },
      },
    },
  })

