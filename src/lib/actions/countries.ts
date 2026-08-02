"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  db,
  countries,
  userCountries,
  favorites,
  type CountryStatus,
} from "@/db";
import { getUserId } from "@/lib/auth";
import { computeStats } from "@/lib/stats";
import { isLocalDevMode } from "@/lib/dev-mode";

export async function getAllCountries() {
  return db.select().from(countries).orderBy(countries.name);
}

export async function getUserCountryMap() {
  const userId = await getUserId();
  const rows = await db
    .select({
      countryCode: userCountries.countryCode,
      status: userCountries.status,
    })
    .from(userCountries)
    .where(eq(userCountries.userId, userId));

  return Object.fromEntries(
    rows.map((r: { countryCode: string; status: CountryStatus }) => [
      r.countryCode,
      r.status,
    ]),
  );
}

export async function setCountryStatus(
  countryCode: string,
  status: CountryStatus | null,
) {
  const userId = await getUserId();
  const now = isLocalDevMode() ? new Date().toISOString() : new Date();

  if (status === null) {
    await db
      .delete(userCountries)
      .where(
        and(
          eq(userCountries.userId, userId),
          eq(userCountries.countryCode, countryCode),
        ),
      );
  } else {
    await db
      .insert(userCountries)
      .values({ userId, countryCode, status, updatedAt: now })
      .onConflictDoUpdate({
        target: [userCountries.userId, userCountries.countryCode],
        set: { status, updatedAt: now },
      });
  }

  revalidatePath("/dashboard");
  revalidatePath("/map");
  revalidatePath("/countries");
}

export async function getTravelStats() {
  const userId = await getUserId();

  const userCountryRows = await db
    .select({
      status: userCountries.status,
      continent: countries.continent,
    })
    .from(userCountries)
    .innerJoin(countries, eq(userCountries.countryCode, countries.code))
    .where(eq(userCountries.userId, userId));

  const favoriteRows = await db
    .select({ type: favorites.type })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  return computeStats({
    userCountries: userCountryRows,
    favorites: favoriteRows,
  });
}
