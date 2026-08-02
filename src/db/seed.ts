import { config } from "dotenv";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { countries } from "./schema";
import { COUNTRIES_DATA } from "./countries-data";

config({ path: ".env.local" });

async function seed() {
  const db = drizzle(sql);

  console.log("Seeding countries...");
  await db.insert(countries).values([...COUNTRIES_DATA]).onConflictDoNothing();
  console.log(`Seeded ${COUNTRIES_DATA.length} countries.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
