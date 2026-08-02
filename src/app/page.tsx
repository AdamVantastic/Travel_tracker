import Link from "next/link";
import { redirect } from "next/navigation";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSignedIn } from "@/lib/auth";
import { isLocalDevMode } from "@/lib/dev-mode";

export default async function HomePage() {
  if (await isSignedIn()) redirect("/dashboard");

  const devMode = isLocalDevMode();
  const startHref = devMode ? "/dashboard" : "/sign-up";
  const signInHref = devMode ? "/dashboard" : "/sign-in";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Globe2 className="h-7 w-7 text-teal-600" />
          <span className="text-xl font-bold">Travel Tracker</span>
        </div>
        <div className="flex gap-3">
          <Link href={signInHref}>
            <Button variant="ghost">{devMode ? "Open app" : "Sign in"}</Button>
          </Link>
          <Link href={startHref}>
            <Button>{devMode ? "Try demo" : "Get started"}</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex flex-1 w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-600">
          Lifetime travel tracker
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          Count every country. Scratch your world map. Reach 100.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Built for country counters. Sign in, tap the countries you&apos;ve visited,
          and see your progress in seconds.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={startHref}>
            <Button size="lg">{devMode ? "Open demo" : "Start tracking free"}</Button>
          </Link>
          <Link href="/map">
            <Button size="lg" variant="outline">
              View map
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Progress to 100",
              body: "See exactly how many countries you've visited and your % toward the century mark.",
            },
            {
              title: "Scratch map",
              body: "An interactive world map colors in as you go — visited, lived, and wishlist.",
            },
            {
              title: "Save favorites",
              body: "Restaurants, hotels, neighborhoods — tagged by country for every trip.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
