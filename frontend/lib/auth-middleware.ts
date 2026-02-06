import { authUtils } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Middleware-style client component to protect routes
 * Redirects unauthenticated users to signin page
 */
export function requireAuth() {
  const user = authUtils.getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}

/**
 * Server-side auth check that can be used in layouts
 */
export async function getAuthUser() {
  try {
    const user = authUtils.getCurrentUser();
    return user;
  } catch {
    return null;
  }
}
