import Link from "next/link";
import { getMilestoneMessage } from "@/lib/stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProgressHeroProps = {
  visitedCount: number;
  percentTo100: number;
};

export function ProgressHero({ visitedCount, percentTo100 }: ProgressHeroProps) {
  const milestone = getMilestoneMessage(percentTo100);

  return (
    <Card className="overflow-hidden border-teal-200 bg-gradient-to-br from-teal-50 to-white dark:border-teal-900 dark:from-teal-950 dark:to-zinc-950">
      <CardContent className="p-8">
        {visitedCount === 0 ? (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-600">
              Welcome
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Tap your first country to start counting
            </h1>
            <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
              Track every country you&apos;ve visited and watch your progress toward 100.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-600">
              Your progress
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              You&apos;ve visited {visitedCount} {visitedCount === 1 ? "country" : "countries"}.
            </h1>
            <p className="mt-2 text-2xl font-semibold text-teal-700 dark:text-teal-400">
              You&apos;re {percentTo100}% to 100.
            </p>
            {milestone && (
              <p className="mt-3 text-sm font-medium text-teal-600">{milestone}</p>
            )}
          </>
        )}

        <div className="mt-6">
          <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-500"
              style={{ width: `${Math.min(percentTo100, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-6">
          <Link href="/map">
            <Button>View map</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
