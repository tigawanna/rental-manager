import { Elysia } from "elysia";

import { createQueryEngine } from "@/db/helpers/QueryEngine";
import { properties } from "@/db/schema";

const propertiesEngine = createQueryEngine(properties);

// List with pagination, filtering, and sorting
const result = await propertiesEngine.list({
  page: 1,
  perPage: 20,
  sort: "-created_at,name",
  filter: "(isActive=true && city='New York')",
  fields: "*,description:excerpt(200,true)",
});

export const paymentsRoute = new Elysia().get(
  "/",
  () => ({ message: "hello world", status: "ok" }),
  {
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
  },
);
