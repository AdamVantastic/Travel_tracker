import { getAllCountries } from "@/lib/actions/countries";
import { getFavorites } from "@/lib/actions/favorites";
import { FavoritesForm } from "@/components/favorites-form";
import { FavoritesList } from "@/components/favorites-list";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const [countries, favorites] = await Promise.all([
    getAllCountries(),
    getFavorites(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-zinc-500">
          Save restaurants, hotels, attractions, and neighborhoods by location.
        </p>
      </div>

      <FavoritesForm countries={countries} />
      <FavoritesList favorites={favorites} />
    </div>
  );
}
