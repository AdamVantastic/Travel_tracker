export const DEV_USER_ID = "dev-local-user";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes("...") || value.endsWith("_...");
}

export function isLocalDevMode(): boolean {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const postgresUrl = process.env.POSTGRES_URL;
  return isPlaceholder(clerkKey) || isPlaceholder(postgresUrl);
}
