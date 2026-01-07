import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { envVariables } from "../env";

const db = drizzle(envVariables.DATABASE_URL);

console.log("Dropping rental tables...");

await db.execute(sql`DROP TABLE IF EXISTS documents CASCADE`);
await db.execute(sql`DROP TABLE IF EXISTS maintenance_requests CASCADE`);
await db.execute(sql`DROP TABLE IF EXISTS payments CASCADE`);
await db.execute(sql`DROP TABLE IF EXISTS leases CASCADE`);
await db.execute(sql`DROP TABLE IF EXISTS units CASCADE`);
await db.execute(sql`DROP TABLE IF EXISTS properties CASCADE`);

console.log("✓ Rental tables dropped. Run: pnpm drizzle:push");
process.exit(0);
