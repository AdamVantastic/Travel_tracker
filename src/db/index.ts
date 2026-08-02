import { isLocalDevMode } from "@/lib/dev-mode";

export * from "./schema";

// Load only the active database backend (SQLite locally, Postgres in production).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const backend = isLocalDevMode() ? require("./local") : require("./postgres");

export const db = backend.db;
export const countries = backend.countries;
export const userCountries = backend.userCountries;
export const favorites = backend.favorites;
