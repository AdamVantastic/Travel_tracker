"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, countries, favorites, type FavoriteType } from "@/db";
import { getUserId } from "@/lib/auth";
import { isLocalDevMode } from "@/lib/dev-mode";

export async function getFavorites() {
  const userId = await getUserId();

  return db
    .select({
      id: favorites.id,
      type: favorites.type,
      name: favorites.name,
      countryCode: favorites.countryCode,
      countryName: countries.name,
      city: favorites.city,
      notes: favorites.notes,
      createdAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(countries, eq(favorites.countryCode, countries.code))
    .where(eq(favorites.userId, userId))
    .orderBy(countries.name, favorites.name);
}

export async function createFavorite(data: {
  type: FavoriteType;
  name: string;
  countryCode: string;
  city?: string;
  notes?: string;
}) {
  const userId = await getUserId();
  const now = isLocalDevMode() ? new Date().toISOString() : new Date();

  const values = isLocalDevMode()
    ? {
        id: crypto.randomUUID(),
        userId,
        type: data.type,
        name: data.name.trim(),
        countryCode: data.countryCode,
        city: data.city?.trim() || null,
        notes: data.notes?.trim() || null,
        createdAt: now,
      }
    : {
        userId,
        type: data.type,
        name: data.name.trim(),
        countryCode: data.countryCode,
        city: data.city?.trim() || null,
        notes: data.notes?.trim() || null,
      };

  await db.insert(favorites).values(values);

  revalidatePath("/favorites");
  revalidatePath("/dashboard");
}

export async function deleteFavorite(id: string) {
  const userId = await getUserId();

  await db
    .delete(favorites)
    .where(and(eq(favorites.id, id), eq(favorites.userId, userId)));

  revalidatePath("/favorites");
  revalidatePath("/dashboard");
}

export async function updateFavorite(
  id: string,
  data: {
    type: FavoriteType;
    name: string;
    countryCode: string;
    city?: string;
    notes?: string;
  },
) {
  const userId = await getUserId();

  await db
    .update(favorites)
    .set({
      type: data.type,
      name: data.name.trim(),
      countryCode: data.countryCode,
      city: data.city?.trim() || null,
      notes: data.notes?.trim() || null,
    })
    .where(and(eq(favorites.id, id), eq(favorites.userId, userId)));

  revalidatePath("/favorites");
  revalidatePath("/dashboard");
}
