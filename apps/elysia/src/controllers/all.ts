import { Elysia } from "elysia";
import { auth } from "@/lib/auth.js";
import { indexRoute } from ".";

export const allRoutes = new Elysia()
.mount("/auth", auth.handler)
.use(indexRoute);

