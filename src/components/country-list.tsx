"use client";

import { useMemo, useState, useTransition } from "react";
import type { Country, CountryStatus } from "@/db/schema";
import { setCountryStatus } from "@/lib/actions/countries";
import { Input } from "@/components/ui/input";
import { CountryToggle, STATUS_LABELS } from "@/components/country-toggle";
import { cn } from "@/lib/utils";

type CountryListProps = {
  countries: Country[];
  userCountryMap: Record<string, CountryStatus>;
};

export function CountryList({ countries, userCountryMap }: CountryListProps) {
  const [search, setSearch] = useState("");
  const [localMap, setLocalMap] = useState(userCountryMap);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q),
    );
  }, [countries, search]);

  function handleChange(code: string, status: CountryStatus | null) {
    setLocalMap((prev) => {
      const next = { ...prev };
      if (status === null) delete next[code];
      else next[code] = status;
      return next;
    });

    startTransition(async () => {
      await setCountryStatus(code, status);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search countries… (press / to focus)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setSearch("")}
        id="country-search"
      />

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        {filtered.map((country) => {
          const status = localMap[country.code] ?? null;
          return (
            <div
              key={country.code}
              className={cn(
                "flex flex-col gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0 dark:border-zinc-900 sm:flex-row sm:items-center sm:justify-between",
                pending && "opacity-80",
              )}
            >
              <div>
                <p className="font-medium">{country.name}</p>
                <p className="text-xs text-zinc-500">
                  {country.continent} · {country.code}
                  {status && ` · ${STATUS_LABELS[status]}`}
                </p>
              </div>
              <CountryToggle
                currentStatus={status}
                onChange={(s) => handleChange(country.code, s)}
                compact
              />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-500">No countries match your search.</p>
        )}
      </div>
    </div>
  );
}
