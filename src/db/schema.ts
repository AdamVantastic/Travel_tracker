import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const countryStatusEnum = pgEnum("country_status", [
  "visited",
  "lived",
  "want",
]);

export const favoriteTypeEnum = pgEnum("favorite_type", [
  "restaurant",
  "hotel",
  "attraction",
  "neighborhood",
]);

export const countries = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  continent: text("continent").notNull(),
});

export const userCountries = pgTable(
  "user_countries",
  {
    userId: text("user_id").notNull(),
    countryCode: text("country_code")
      .notNull()
      .references(() => countries.code),
    status: countryStatusEnum("status").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.countryCode] })],
);

export const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  type: favoriteTypeEnum("type").notNull(),
  name: text("name").notNull(),
  countryCode: text("country_code")
    .notNull()
    .references(() => countries.code),
  city: text("city"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Country = typeof countries.$inferSelect;
export type UserCountry = typeof userCountries.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type CountryStatus = (typeof countryStatusEnum.enumValues)[number];
export type FavoriteType = (typeof favoriteTypeEnum.enumValues)[number];
