"use client";

import { ProtectedRoute } from "@/components/route-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredAuth="unauthenticated" redirectTo="/">
      <div className="min-h-screen w-full bg-background">{children}</div>
    </ProtectedRoute>
  );
}
