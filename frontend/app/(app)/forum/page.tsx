"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";

export default function ForumPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          {t("forum", "title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("forum", "subtitle")}</p>
      </div>

      <Card className="border-border shadow-light">
        <CardHeader>
          <CardTitle>{t("forum", "comingSoon")}</CardTitle>
          <CardDescription>{t("forum", "comingSoonDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("forum", "protectedRoute")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
