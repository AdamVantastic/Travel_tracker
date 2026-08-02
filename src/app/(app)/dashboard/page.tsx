import { getTravelStats } from "@/lib/actions/countries";
import { ProgressHero } from "@/components/progress-hero";
import { StatsGrid } from "@/components/stats-grid";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getTravelStats();

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500">Your lifetime travel progress at a glance.</p>
      </div>

      <ProgressHero
        visitedCount={stats.visitedCount}
        percentTo100={stats.percentTo100}
      />

      <StatsGrid stats={stats} />
    </div>
  );
}
