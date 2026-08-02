import { auth } from "@clerk/nextjs/server";
import { DEV_USER_ID, isLocalDevMode } from "@/lib/dev-mode";

export async function getUserId(): Promise<string> {
  if (isLocalDevMode()) return DEV_USER_ID;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function isSignedIn(): Promise<boolean> {
  if (isLocalDevMode()) return true;
  const { userId } = await auth();
  return Boolean(userId);
}
