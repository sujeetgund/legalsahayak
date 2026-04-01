"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/providers/language-provider";
import { authUtils } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle, Loader2, Scale, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Demographics = {
  age: number;
  gender: string;
  location: string;
  education_level: string;
  job_title: string;
};

type ActionPlanStep = {
  title: string;
  description: string;
};

type SourcePassage = {
  source: string;
  quote: string;
  section?: string | null;
  relevance_score: number;
};

type ApiResponse = {
  answer: string;
  confidence: number;
  legal_references: string[];
  action_plan: ActionPlanStep[];
  source_passages?: SourcePassage[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ApiResponse;
};

const buildDemographics = (): Demographics => {
  const user = authUtils.getCurrentUser();
  const profile = user?.profile;

  return {
    age: profile?.age ?? 0,
    gender: profile?.gender ?? "Not specified",
    location: profile?.location ?? "India",
    education_level: profile?.education_level ?? "Not specified",
    job_title: profile?.job_title ?? "Not specified",
  };
};

const AssistantResponse = ({
  message,
  t,
}: {
  message: Message;
  t: ReturnType<typeof useLanguage>["t"];
}) => {
  const response = message.response;
  if (!response) return null;

  const confidencePercent = Math.max(
    0,
    Math.min(100, Math.round(response.confidence * 100)),
  );

  return (
    <Card className="gap-0 overflow-hidden border-border/70 bg-card/90 shadow-sm">
      <div className="border-b border-border/70 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{t("assistant", "jurisdiction")}</Badge>
            <Badge className="bg-accent text-accent-foreground">
              {t("assistant", "confidence")}: {confidencePercent}%
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {t("assistant", "aiGeneratedGuidance")}
          </span>
        </div>
      </div>

      <Tabs defaultValue="answer" className="w-full p-3">
        <TabsList className="grid w-full grid-cols-4 rounded-full bg-muted/70 p-1">
          <TabsTrigger value="answer" className="rounded-full">
            {t("assistant", "answerTab")}
          </TabsTrigger>
          <TabsTrigger value="legal" className="rounded-full">
            {t("assistant", "legalReferencesTab")}
          </TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-full">
            Evidence
          </TabsTrigger>
          <TabsTrigger value="plan" className="rounded-full">
            {t("assistant", "actionPlanTab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="answer"
          className="mt-3 rounded-xl border border-border/60 bg-background/70 p-4"
        >
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {response.answer}
            </ReactMarkdown>
          </div>
        </TabsContent>

        <TabsContent
          value="legal"
          className="mt-3 rounded-xl border border-border/60 bg-background/70 p-4"
        >
          {response.legal_references.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("assistant", "noLegalReferences")}
            </p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              {response.legal_references.map((reference, index) => (
                <li key={`${reference}-${index}`}>{reference}</li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent
          value="evidence"
          className="mt-3 space-y-3 rounded-xl border border-border/60 bg-background/70 p-4"
        >
          {response.source_passages && response.source_passages.length > 0 ? (
            response.source_passages.map((passage, index) => (
              <div
                key={`${passage.source}-${index}`}
                className="rounded-lg border border-border/60 bg-card px-3 py-2"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {passage.source}
                  {passage.section ? ` • ${passage.section}` : ""}
                </p>
                <p className="mt-1 text-sm">"{passage.quote}"</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No quote snippets available.</p>
          )}
        </TabsContent>

        <TabsContent
          value="plan"
          className="mt-3 rounded-xl border border-border/60 bg-background/70 p-4"
        >
          {response.action_plan.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("assistant", "noActionPlan")}
            </p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {response.action_plan.map((step, index) => (
                <AccordionItem
                  key={step.title + index}
                  value={`item-${index}`}
                  className="rounded-lg border border-border/60 bg-card px-3"
                >
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        {index + 1}. {step.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {step.description}
                      </ReactMarkdown>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default function AssistantChatPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { t, language } = useLanguage();

  const quickPrompts = [
    t("assistant", "quickPrompt1"),
    t("assistant", "quickPrompt2"),
    t("assistant", "quickPrompt3"),
  ];

  const addMessage = (message: Omit<Message, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setHistory((prev) => [...prev, { id, ...message }]);
  };

  const askQuestion = async (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isPending) return;

    addMessage({ role: "user", content: cleanQuestion });
    setInput("");
    setIsPending(true);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: cleanQuestion,
          demographics: buildDemographics(),
          preferred_language: language,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: ApiResponse = await res.json();

      addMessage({
        role: "assistant",
        content: data.answer,
        response: data,
      });
    } catch (error) {
      console.error("Failed to get response:", error);
      addMessage({
        role: "assistant",
        content: t("assistant", "genericError"),
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await askQuestion(input);
  };

  useEffect(() => {
    const initialConversation = sessionStorage.getItem("initial_conversation");
    if (initialConversation) {
      try {
        const messages = JSON.parse(initialConversation) as Message[];
        setHistory(messages);
      } catch (error) {
        console.error("Failed to load initial conversation:", error);
      }
      sessionStorage.removeItem("initial_conversation");
    }

    const draft = sessionStorage.getItem("assistant_draft");
    if (draft) {
      setInput(draft);
      sessionStorage.removeItem("assistant_draft");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history, isPending]);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-background to-card/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_40%),radial-gradient(circle_at_20%_25%,rgba(14,165,233,0.12),transparent_35%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/15 p-2 text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  LegalSahayak
                </p>
                <h1 className="text-sm font-semibold sm:text-base">
                  {t("assistant", "title")}
                </h1>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/assistant">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-4 pb-40 sm:px-6">
            {history.length === 0 && !isPending && (
              <Card className="gap-4 border-border/70 bg-card/85 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-accent/20 p-2">
                    <Sparkles className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {t("assistant", "askFirstQuestion")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("assistant", "firstQuestionHint")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => {
                        void askQuestion(prompt);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {history.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm sm:max-w-[70%]">
                    {message.content}
                  </div>
                ) : (
                  <div className="w-full max-w-4xl">
                    {message.response ? (
                      <AssistantResponse message={message} t={t} />
                    ) : (
                      <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm">
                        {message.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("assistant", "loadingTitle")}
                  </div>
                </div>
              </div>
            )}
          </main>
        </ScrollArea>

        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/70 bg-background/90 backdrop-blur">
          <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-card px-3 py-2 shadow-sm">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("assistant", "detailedInputPlaceholder")}
                  disabled={isPending}
                  className="min-h-14 max-h-36 resize-y border-0 bg-transparent px-1 py-2 text-sm shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void askQuestion(input);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="mb-1 h-11 w-11 rounded-full border border-amber-300/60 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 shadow-[0_8px_18px_-10px_rgba(251,191,36,0.9)] transition-all duration-200 hover:scale-105 hover:from-amber-200 hover:to-amber-400 disabled:opacity-60"
                  disabled={isPending || !input.trim()}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t("assistant", "tipText")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
