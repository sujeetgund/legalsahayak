"use client";

import { ProtectedRoute } from "@/components/route-guard";

export default function ForumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredAuth="authenticated" redirectTo="/signin">
      {children}
    </ProtectedRoute>
  );
}
