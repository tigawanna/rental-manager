import { envVariables } from "@/env";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(envVariables.DATABASE_URL, { schema });
