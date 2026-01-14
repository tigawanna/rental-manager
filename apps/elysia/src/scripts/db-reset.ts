import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { reset } from "drizzle-seed";

//  ths will delete the db use with extreme caution
async function main() {
  await reset(db, schema);
}

main();
