export const DEV_USER_ID = "dev-local-user";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return trimmed.includes("...");
}

/** True when Clerk or Postgres credentials are missing/placeholder. */
export function isLocalDevMode(): boolean {
  return (
    isPlaceholder(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
    isPlaceholder(process.env.CLERK_SECRET_KEY) ||
    isPlaceholder(process.env.POSTGRES_URL)
  );
}

/** True only when both Clerk keys look configured (for middleware). */
export function hasClerkCredentials(): boolean {
  return (
    !isPlaceholder(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    !isPlaceholder(process.env.CLERK_SECRET_KEY)
  );
}
