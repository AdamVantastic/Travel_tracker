import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import path from "path";
import { COUNTRIES_DATA } from "./countries-data";

export const countries = sqliteTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  continent: text("continent").notNull(),
});

export const userCountries = sqliteTable(
  "user_countries",
  {
    userId: text("user_id").notNull(),
    countryCode: text("country_code")
      .notNull()
      .references(() => countries.code),
    status: text("status", { enum: ["visited", "lived", "want"] }).notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.countryCode] })],
);

export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type", {
    enum: ["restaurant", "hotel", "attraction", "neighborhood"],
  }).notNull(),
  name: text("name").notNull(),
  countryCode: text("country_code")
    .notNull()
    .references(() => countries.code),
  city: text("city"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

const dbPath = path.join(process.cwd(), "local.db");
const sqlite = new Database(dbPath);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    continent TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS user_countries (
    user_id TEXT NOT NULL,
    country_code TEXT NOT NULL REFERENCES countries(code),
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, country_code)
  );
  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    country_code TEXT NOT NULL REFERENCES countries(code),
    city TEXT,
    notes TEXT,
    created_at TEXT NOT NULL
  );
`);

const countryCount = sqlite
  .prepare("SELECT COUNT(*) as count FROM countries")
  .get() as { count: number };

if (countryCount.count === 0) {
  const insert = sqlite.prepare(
    "INSERT INTO countries (code, name, continent) VALUES (?, ?, ?)",
  );
  const insertMany = sqlite.transaction((rows: typeof COUNTRIES_DATA) => {
    for (const row of rows) {
      insert.run(row.code, row.name, row.continent);
    }
  });
  insertMany(COUNTRIES_DATA);
}

export const db = drizzle(sqlite);
