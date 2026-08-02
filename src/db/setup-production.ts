/**
 * One-time setup: create tables + seed countries against POSTGRES_URL.
 * Usage: npm run db:setup
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { countries } from "./schema";
import { COUNTRIES_DATA } from "./countries-data";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url || url.includes("...")) {
    console.error(
      "ERROR: Set a real POSTGRES_URL in .env first.\n" +
        "Copy it from Vercel → Storage → your Postgres database → Connection string.",
    );
    process.exit(1);
  }

  console.log("1/2 Creating tables...");
  const migrationPath = path.join(
    process.cwd(),
    "src/db/migrations/0000_init.sql",
  );
  const migrationSql = readFileSync(migrationPath, "utf8");

  // Run statements one by one (postgres driver is happier that way)
  const statements = migrationSql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("   Tables ready.");

  console.log("2/2 Seeding countries...");
  const db = drizzle(sql);
  await db.insert(countries).values([...COUNTRIES_DATA]).onConflictDoNothing();
  console.log(`   Seeded ${COUNTRIES_DATA.length} countries.`);

  console.log("\nDone. Refresh https://vantastic-travel-tracker.vercel.app/dashboard");
  process.exit(0);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
