"use client";

import { useMemo, useState, useTransition } from "react";
import type { Country, CountryStatus } from "@/db/schema";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { setCountryStatus } from "@/lib/actions/countries";
import { CountryToggle } from "@/components/country-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const GEO_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

const STATUS_FILL: Record<CountryStatus, string> = {
  visited: "#0d9488",
  lived: "#134e4a",
  want: "transparent",
};

const STATUS_STROKE: Record<CountryStatus, string> = {
  visited: "#0d9488",
  lived: "#134e4a",
  want: "#0d9488",
};

const DEFAULT_FILL = "#e4e4e7";
const DEFAULT_STROKE = "#a1a1aa";

type WorldMapProps = {
  countries: Country[];
  userCountryMap: Record<string, CountryStatus>;
};

function resolveCountryCode(
  geo: { properties: Record<string, string | number | undefined> },
  nameToCode: Map<string, string>,
): string | null {
  const iso =
    (geo.properties.ISO_A2 as string) ||
    (geo.properties.iso_a2 as string) ||
    (geo.properties.WB_A2 as string);

  if (iso && iso !== "-99" && iso.length === 2) {
    return iso.toUpperCase();
  }

  const admin =
    (geo.properties.ADMIN as string) ||
    (geo.properties.admin as string) ||
    (geo.properties.name as string);

  if (admin) {
    return nameToCode.get(admin.toLowerCase()) ?? null;
  }

  return null;
}

export function WorldMap({ countries, userCountryMap }: WorldMapProps) {
  const [localMap, setLocalMap] = useState(userCountryMap);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const codeToCountry = useMemo(
    () => new Map(countries.map((c) => [c.code, c])),
    [countries],
  );

  const nameToCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of countries) {
      map.set(c.name.toLowerCase(), c.code);
    }
    map.set("united states of america", "US");
    map.set("russia", "RU");
    map.set("czech republic", "CZ");
    map.set("ivory coast", "CI");
    map.set("dem. rep. congo", "CD");
    map.set("republic of the congo", "CG");
    return map;
  }, [countries]);

  const selectedCountry = selectedCode ? codeToCountry.get(selectedCode) : null;

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return countries.slice(0, 8);
    return countries
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [countries, search]);

  function handleStatusChange(code: string, status: CountryStatus | null) {
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

  function getStyle(code: string | null) {
    if (!code) {
      return {
        default: { fill: DEFAULT_FILL, stroke: DEFAULT_STROKE, strokeWidth: 0.4, outline: "none" },
        hover: { fill: "#d4d4d8", stroke: DEFAULT_STROKE, strokeWidth: 0.5, outline: "none" },
        pressed: { fill: "#d4d4d8", outline: "none" },
      };
    }

    const status = localMap[code];
    if (!status) {
      return {
        default: { fill: DEFAULT_FILL, stroke: DEFAULT_STROKE, strokeWidth: 0.4, outline: "none" },
        hover: { fill: "#99f6e4", stroke: "#0d9488", strokeWidth: 0.6, outline: "none" },
        pressed: { fill: "#5eead4", outline: "none" },
      };
    }

    const fill = STATUS_FILL[status];
    const stroke = STATUS_STROKE[status];
    const dash = status === "want" ? "4 2" : undefined;

    return {
      default: {
        fill,
        stroke,
        strokeWidth: status === "want" ? 1.2 : 0.5,
        strokeDasharray: dash,
        outline: "none",
      },
      hover: {
        fill: status === "want" ? "#ecfdf5" : fill,
        stroke,
        strokeWidth: 1.2,
        strokeDasharray: dash,
        outline: "none",
      },
      pressed: {
        fill,
        stroke,
        outline: "none",
      },
    };
  }

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className="relative min-h-[480px] flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-md bg-zinc-900 px-2 py-1 text-xs text-white"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            {tooltip.name}
          </div>
        )}

        <ComposableMap
          projection="geoEqualEarth"
          className="h-full w-full"
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = resolveCountryCode(geo, nameToCode);
                  const country = code ? codeToCountry.get(code) : null;
                  const name = country?.name ?? (geo.properties.ADMIN as string) ?? "Unknown";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        setTooltip({
                          name,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseMove={(e) => {
                        setTooltip((prev) =>
                          prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                        );
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => {
                        if (code) setSelectedCode(code);
                      }}
                      style={getStyle(code)}
                      className={pending ? "opacity-90" : undefined}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {selectedCountry && (
          <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-950 sm:right-auto sm:max-w-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{selectedCountry.name}</p>
                <p className="text-xs text-zinc-500">
                  {selectedCountry.continent} · {selectedCountry.code}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCode(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CountryToggle
              currentStatus={localMap[selectedCountry.code] ?? null}
              onChange={(status) => handleStatusChange(selectedCountry.code, status)}
              compact
            />
          </div>
        )}
      </div>

      <aside className="w-full shrink-0 space-y-4 lg:w-72">
        <div>
          <h2 className="mb-2 text-sm font-semibold">Quick search</h2>
          <Input
            placeholder="Find a country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="mt-2 space-y-1">
            {filteredCountries.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setSelectedCode(c.code)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Legend</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-3 w-6 rounded bg-teal-600" />
              Visited
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-6 rounded bg-teal-900" />
              Lived
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-6 rounded border-2 border-dashed border-teal-600" />
              Want to visit
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
