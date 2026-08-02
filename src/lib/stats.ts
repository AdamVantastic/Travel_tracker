import type { CountryStatus, FavoriteType } from "@/db/schema";

export type TravelStats = {
  visitedCount: number;
  livedCount: number;
  wantCount: number;
  percentTo100: number;
  continentsVisited: number;
  favoritesTotal: number;
  favoritesByType: Record<FavoriteType, number>;
};

export function computeStats(input: {
  userCountries: { status: CountryStatus; continent: string }[];
  favorites: { type: FavoriteType }[];
}): TravelStats {
  const visitedCount = input.userCountries.filter((c) => c.status === "visited").length;
  const livedCount = input.userCountries.filter((c) => c.status === "lived").length;
  const wantCount = input.userCountries.filter((c) => c.status === "want").length;

  const visitedOrLived = input.userCountries.filter(
    (c) => c.status === "visited" || c.status === "lived",
  );
  const continentsVisited = new Set(visitedOrLived.map((c) => c.continent)).size;

  const favoritesByType: Record<FavoriteType, number> = {
    restaurant: 0,
    hotel: 0,
    attraction: 0,
    neighborhood: 0,
  };

  for (const fav of input.favorites) {
    favoritesByType[fav.type] += 1;
  }

  return {
    visitedCount,
    livedCount,
    wantCount,
    percentTo100: visitedCount,
    continentsVisited,
    favoritesTotal: input.favorites.length,
    favoritesByType,
  };
}

export function getMilestoneMessage(percent: number): string | null {
  if (percent >= 100) return "You've reached 100 countries!";
  if (percent >= 75) return "Three-quarters of the way there!";
  if (percent >= 50) return "Halfway to 100!";
  if (percent >= 25) return "A quarter of the world — keep going!";
  return null;
}
