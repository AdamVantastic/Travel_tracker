import type { TravelStats } from "@/lib/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsGridProps = {
  stats: TravelStats;
};

const FAVORITE_LABELS = {
  restaurant: "Restaurants",
  hotel: "Hotels",
  attraction: "Attractions",
  neighborhood: "Neighborhoods",
} as const;

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    { label: "Lived in", value: stats.livedCount },
    { label: "Want to visit", value: stats.wantCount },
    { label: "Continents", value: stats.continentsVisited },
    { label: "Favorites saved", value: stats.favoritesTotal },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-500">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}

      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-500">
            Favorites breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(Object.keys(FAVORITE_LABELS) as Array<keyof typeof FAVORITE_LABELS>).map(
              (key) => (
                <div key={key}>
                  <p className="text-2xl font-bold">{stats.favoritesByType[key]}</p>
                  <p className="text-sm text-zinc-500">{FAVORITE_LABELS[key]}</p>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
