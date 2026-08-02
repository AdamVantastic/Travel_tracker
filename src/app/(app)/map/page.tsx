import { getAllCountries, getUserCountryMap } from "@/lib/actions/countries";
import { WorldMap } from "@/components/world-map";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [countries, userCountryMap] = await Promise.all([
    getAllCountries(),
    getUserCountryMap(),
  ]);

  return (
    <div className="flex h-[calc(100vh)] flex-col p-6">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold">World map</h1>
        <p className="text-zinc-500">
          Click a country to mark it visited, lived, or want-to-visit.
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <WorldMap countries={countries} userCountryMap={userCountryMap} />
      </div>
    </div>
  );
}
