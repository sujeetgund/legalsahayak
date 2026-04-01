"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, BookOpen, Send, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const openChat = (draft?: string) => {
    const question = draft?.trim();
    if (question) {
      sessionStorage.setItem("assistant_draft", question);
    }
    router.push("/assistant/chat");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    openChat(input);
  };

  return (
    <div className="space-y-16">
      <section className="mx-auto w-full max-w-5xl px-4 pt-12 text-center sm:px-6 md:pt-20">
        <div className="mx-auto max-w-3xl space-y-5">
          <h1 className="text-5xl font-extrabold tracking-tight text-amber-500 sm:text-6xl md:text-7xl">
            {t("assistant", "title")}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t("assistant", "subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 w-full max-w-3xl"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)] transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-amber-300/70 focus-within:shadow-[0_18px_40px_-20px_rgba(251,191,36,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(251,191,36,0.12)_0%,rgba(255,255,255,0)_36%)] opacity-70" />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("assistant", "inputPlaceholder")}
              className="min-h-[78px] resize-none border-0 bg-transparent py-6 pl-5 pr-20 text-sm leading-relaxed shadow-none focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-amber-300/60 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 shadow-[0_8px_18px_-10px_rgba(251,191,36,0.9)] transition-all duration-200 hover:scale-105 hover:from-amber-200 hover:to-amber-400 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </section>

      <section className="mx-auto w-full max-w-7xl rounded-2xl border border-border/50 bg-card/60 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {t("assistant", "resourcesTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("assistant", "resourcesSubtitle")}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="gap-4 border-border/70 bg-background p-6 shadow-sm">
            <div className="w-fit rounded-full bg-amber-100 p-3">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">
              {t("assistant", "communityStories")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("assistant", "communityStoriesDesc")}
            </CardDescription>
            <Button
              asChild
              className="mt-auto w-full justify-between rounded-md text-primary-foreground text-white"
            >
              <Link href="/forum">
                {t("assistant", "browseStories")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>

          <Card className="gap-4 border-border/70 bg-background p-6 shadow-sm">
            <div className="w-fit rounded-full bg-amber-100 p-3">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">
              {t("assistant", "exploreTopics")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("assistant", "exploreTopicsDesc")}
            </CardDescription>
            <Button
              asChild
              className="mt-auto w-full justify-between rounded-md text-primary-foreground text-white"
            >
              <Link href="/library">
                {t("assistant", "goToLibrary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
