"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ProtectedRoute } from "@/components/route-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredAuth="unauthenticated" redirectTo="/">
      <div className="min-h-screen w-full bg-background relative">
        <div className="absolute right-4 top-4 z-20">
          <LanguageToggle compact />
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
