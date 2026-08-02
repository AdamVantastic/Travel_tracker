"use client";

import { useMemo, useState, useTransition } from "react";
import type { FavoriteType } from "@/db/schema";
import { deleteFavorite } from "@/lib/actions/favorites";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

type FavoriteRow = {
  id: string;
  type: FavoriteType;
  name: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  notes: string | null;
};

type FavoritesListProps = {
  favorites: FavoriteRow[];
};

const TYPE_LABELS: Record<FavoriteType, string> = {
  restaurant: "Restaurant",
  hotel: "Hotel",
  attraction: "Attraction",
  neighborhood: "Neighborhood",
};

export function FavoritesList({ favorites }: FavoritesListProps) {
  const [filterType, setFilterType] = useState<FavoriteType | "all">("all");
  const [filterCountry, setFilterCountry] = useState("");
  const [pending, startTransition] = useTransition();

  const countries = useMemo(() => {
    const set = new Map<string, string>();
    for (const f of favorites) set.set(f.countryCode, f.countryName);
    return [...set.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [favorites]);

  const filtered = useMemo(() => {
    return favorites.filter((f) => {
      if (filterType !== "all" && f.type !== filterType) return false;
      if (filterCountry && f.countryCode !== filterCountry) return false;
      return true;
    });
  }, [favorites, filterType, filterCountry]);

  const grouped = useMemo(() => {
    const map = new Map<string, FavoriteRow[]>();
    for (const f of filtered) {
      const list = map.get(f.countryName) ?? [];
      list.push(f);
      map.set(f.countryName, list);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteFavorite(id);
    });
  }

  if (favorites.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
        No favorites yet. Save restaurants, hotels, and spots you love.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FavoriteType | "all")}
          className="w-auto min-w-40"
        >
          <option value="all">All types</option>
          {(Object.keys(TYPE_LABELS) as FavoriteType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
        <Select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="w-auto min-w-40"
        >
          <option value="">All countries</option>
          {countries.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </Select>
      </div>

      {grouped.map(([countryName, items]) => (
        <section key={countryName}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {countryName}
          </h3>
          <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {items.map((fav) => (
              <li
                key={fav.id}
                className="flex items-start justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{fav.name}</p>
                  <p className="text-sm text-zinc-500">
                    {TYPE_LABELS[fav.type]}
                    {fav.city && ` · ${fav.city}`}
                  </p>
                  {fav.notes && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {fav.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(fav.id)}
                  disabled={pending}
                  aria-label="Delete favorite"
                >
                  <Trash2 className="h-4 w-4 text-zinc-400" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-sm text-zinc-500">No favorites match your filters.</p>
      )}
    </div>
  );
}
