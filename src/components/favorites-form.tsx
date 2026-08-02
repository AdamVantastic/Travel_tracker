"use client";

import { useState, useTransition } from "react";
import type { Country, FavoriteType } from "@/db/schema";
import { createFavorite } from "@/lib/actions/favorites";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

type FavoritesFormProps = {
  countries: Country[];
};

const TYPE_OPTIONS: { value: FavoriteType; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "attraction", label: "Attraction" },
  { value: "neighborhood", label: "Neighborhood" },
];

export function FavoritesForm({ countries }: FavoritesFormProps) {
  const [type, setType] = useState<FavoriteType>("restaurant");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState(countries[0]?.code ?? "");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!countryCode) {
      setError("Country is required.");
      return;
    }

    startTransition(async () => {
      try {
        await createFavorite({ type, name, countryCode, city, notes });
        setName("");
        setCity("");
        setNotes("");
      } catch {
        setError("Could not save favorite. Try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Add a favorite</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <Select value={type} onChange={(e) => setType(e.target.value as FavoriteType)}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Country</label>
          <Select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Café de Flore"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">City (optional)</label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Paris"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why you loved it…"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save favorite"}
      </Button>
    </form>
  );
}
