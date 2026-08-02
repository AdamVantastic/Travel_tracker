export function DevModeBanner() {
  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      Local dev mode — using SQLite on disk. Add real Clerk + Postgres keys in{" "}
      <code className="rounded bg-amber-100 px-1">.env</code> for production setup.
    </div>
  );
}
