"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth: "authenticated" | "unauthenticated";
  redirectTo?: string;
}

/**
 * Component that protects routes based on authentication status
 * - If requiredAuth='authenticated': redirects unauthenticated users to /signin
 * - If requiredAuth='unauthenticated': redirects authenticated users to the redirectTo path
 */
export function ProtectedRoute({
  children,
  requiredAuth,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure hydration
    const timer = setTimeout(() => {
      const user = authUtils.getCurrentUser();
      const isAuthenticated = user !== null;

      if (requiredAuth === "authenticated") {
        if (!isAuthenticated) {
          router.push("/signin");
        } else {
          setIsAuthorized(true);
        }
      } else if (requiredAuth === "unauthenticated") {
        if (isAuthenticated) {
          router.push(redirectTo);
        } else {
          setIsAuthorized(true);
        }
      }

      setIsChecking(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router, requiredAuth, redirectTo]);

  // Show nothing while checking to avoid content flash
  if (isChecking) {
    return null;
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
