import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const countries = schema.countries;
export const userCountries = schema.userCountries;
export const favorites = schema.favorites;
