"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ProtectedRoute } from "@/components/route-guard";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredAuth="authenticated" redirectTo="/signin">
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
