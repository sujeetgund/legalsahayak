"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Gavel,
  LayoutDashboard,
  Menu,
  Scale,
  Search,
  Users,
  UserCircle,
  HelpCircle,
  Download,
  LogOut,
  MessageSquare,
  BookOpen,
  Sparkles,
  ChevronRight,
  BookText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authUtils } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";
import { Badge } from "../ui/badge";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("header", "toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-20 items-center border-b px-6">
                  <Link
                    href="/"
                    className="flex items-center justify-center"
                    prefetch={false}
                  >
                    <Scale className="h-8 w-8 text-primary" />
                    <span className="ml-3 text-2xl font-semibold tracking-tight text-primary font-headline">
                      LegalSahayak
                    </span>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                      href="/assistant"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Gavel className="h-4 w-4" />
                      {t("header", "aiAssistant")}
                    </Link>
                    <Link
                      href="/forum"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <Users className="h-4 w-4" />
                      {t("header", "community")}
                    </Link>
                    <Link
                      href="/library"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <BookText className="h-4 w-4" />
                      {t("header", "legalLibrary")}
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t("header", "dashboard")}
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link
          href="/"
          className="items-center justify-center hidden md:flex"
          prefetch={false}
        >
          <Scale className="h-8 w-8 text-primary" />
          <span className="ml-3 text-2xl font-semibold tracking-tight text-primary font-headline">
            LegalSahayak
          </span>
        </Link>
      </div>

      <NavigationMenu className="hidden md:flex ml-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/assistant" className={navigationMenuTriggerStyle()}>
                {t("header", "aiAssistant")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/forum" className={navigationMenuTriggerStyle()}>
                {t("header", "community")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/library" className={navigationMenuTriggerStyle()}>
                {t("header", "legalLibrary")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("header", "searchPlaceholder")}
            className="pl-10"
          />
        </form>

        <LanguageToggle compact className="hidden sm:inline-flex" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:ring-2 hover:ring-primary/20 transition-all"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage
                  src="https://picsum.photos/40/40?grayscale&random=99"
                  alt={user?.fullName || t("header", "unknownUser")}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                  {user ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {/* User Profile Header */}
            <div className="flex items-start gap-3 p-3 pb-3 border-b">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src="https://picsum.photos/40/40?grayscale&random=99"
                  alt={user?.fullName || t("header", "unknownUser")}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                  {user ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user?.fullName || t("header", "unknownUser")}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-1.5 text-xs font-normal"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t("header", "freePlan")}
                </Badge>
              </div>
            </div>

            <div className="px-3 py-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t("header", "languageLabel")}
              </p>
              <LanguageToggle className="w-full justify-center" />
            </div>

            {/* Main Menu Items */}
            <div className="py-1.5">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {t("header", "dashboard")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("header", "viewOverview")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500/10">
                    <UserCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {t("header", "profileSettings")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("header", "manageAccount")}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Quick Access Section */}
            <div className="py-1.5">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
                {t("header", "quickAccess")}
              </DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link
                  href="/assistant"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t("header", "aiAssistant")}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/forum"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("header", "communityForum")}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/library"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t("header", "legalLibrary")}</span>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Support Section */}
            <div className="py-1.5">
              <DropdownMenuItem asChild>
                <Link
                  href="/help"
                  className="cursor-pointer flex items-center gap-3 px-3 py-2"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t("header", "helpSupport")}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const data = authUtils.exportUserData();
                  if (data) {
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `legalsahayak-data-${new Date().toISOString().split("T")[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                className="cursor-pointer flex items-center gap-3 px-3 py-2"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t("header", "downloadData")}</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Logout */}
            <div className="py-1.5">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-3 px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t("header", "logout")}
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );

  function handleLogout() {
    logout();
    router.push("/signin");
  }
}
