import { getAllCountries, getUserCountryMap } from "@/lib/actions/countries";
import { CountryList } from "@/components/country-list";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  const [countries, userCountryMap] = await Promise.all([
    getAllCountries(),
    getUserCountryMap(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Countries</h1>
        <p className="text-zinc-500">
          Search and toggle every country — visited, lived, or want-to-visit.
        </p>
      </div>
      <CountryList countries={countries} userCountryMap={userCountryMap} />
    </div>
  );
}
