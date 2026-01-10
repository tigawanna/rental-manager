import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/elysia/main";
import { envVariables } from "../env";

export const treatyClient = treaty<App>(envVariables.VITE_API_URL);
