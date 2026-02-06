"use client";

import { cn } from "@/lib/utils";
import {
  BookText,
  Gavel,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/assistant", label: "AI Assistant", icon: Gavel },
  { href: "/forum", label: "Communities", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/legal-library", label: "Library", icon: BookText },
];

export function AppSidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-row items-center space-x-2 space-y-0",
        className,
      )}
      {...props}
    >
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-primary",
              "py-2 px-3 rounded-lg",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className={cn("block")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
