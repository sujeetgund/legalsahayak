"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageToggle({
  className,
  compact = false,
}: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/10 p-1 shadow-sm",
        compact ? "h-9" : "h-10",
        className,
      )}
      role="group"
      aria-label={t("common", "language")}
    >
      <span
        className={cn(
          "absolute top-1 bottom-1 rounded-full bg-primary shadow-md transition-all duration-300 ease-out",
          compact ? "w-[calc(50%-4px)]" : "w-[calc(50%-4px)]",
          language === "en" ? "left-1" : "left-[calc(50%+2px)]",
        )}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "relative z-10 rounded-full px-3 text-xs font-semibold tracking-wide transition-colors duration-200",
          compact ? "h-7 min-w-[52px]" : "h-8 min-w-[64px]",
          language === "en"
            ? "text-primary-foreground"
            : "text-foreground/70 hover:text-foreground",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={cn(
          "relative z-10 rounded-full px-3 text-xs font-semibold tracking-wide transition-colors duration-200",
          compact ? "h-7 min-w-[52px]" : "h-8 min-w-[64px]",
          language === "hi"
            ? "text-primary-foreground"
            : "text-foreground/70 hover:text-foreground",
        )}
      >
        हिं
      </button>
    </div>
  );
}
