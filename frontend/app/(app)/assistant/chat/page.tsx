"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authUtils } from "@/lib/auth";
import {
  Bot,
  CheckCircle,
  Loader2,
  Scale,
  Send,
  Sparkles,
  User,
} from "lucide-react";
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

type ApiResponse = {
  answer: string;
  confidence: number;
  legal_references: string[];
  action_plan: ActionPlanStep[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ApiResponse;
};

const AssistantResponse = ({ message }: { message: Message }) => {
  const response = message.response;

  if (!response) return null;

  const confidencePercent = Math.max(
    0,
    Math.min(100, Math.round(response.confidence * 100)),
  );

  // const handleDownload = () => {
  //     const doc = new jsPDF();
  //     const messageIndex = fullHistory.findIndex(m => m.id === message.id);
  //     const userMessage = fullHistory[messageIndex - 1];

  //     let y = 15; // vertical position in points
  //     const margin = 15;
  //     const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);

  //     const addWrappedText = (text: string, options: { isTitle?: boolean, isSubtitle?: boolean } = {}) => {
  //         if (y > 270) { // Add new page if content overflows
  //             doc.addPage();
  //             y = 15;
  //         }
  //         const { isTitle = false, isSubtitle = false } = options;
  //         doc.setFont("helvetica", isTitle || isSubtitle ? "bold" : "normal");
  //         doc.setFontSize(isTitle ? 16 : isSubtitle ? 12 : 10);

  //         const lines = doc.splitTextToSize(text, maxWidth);
  //         doc.text(lines, margin, y);
  //         y += (lines.length * (isTitle ? 7 : 5)) + 3; // Adjust spacing after text
  //     }

  //     doc.setFontSize(20);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("LegalSahayak AI Legal Assistant Response", margin, y);
  //     y += 15;

  //     if (userMessage) {
  //         addWrappedText("Your Question:", { isTitle: true });
  //         addWrappedText(userMessage.content);
  //         y += 5;
  //     }

  //     addWrappedText("AI Response", { isTitle: true });

  //     addWrappedText("Summary", { isSubtitle: true });
  //     addWrappedText(response.summary);
  //     y += 5;

  //     addWrappedText("Legal Basis", { isSubtitle: true });
  //     addWrappedText(response.detailedAnalysis);
  //     y += 5;

  //     addWrappedText("Action Plan", { isSubtitle: true });
  //     response.actionPlan.forEach((step, index) => {
  //         addWrappedText(`${index + 1}. ${step.title}`, { isSubtitle: true });
  //         addWrappedText(step.description);
  //     });

  //     y += 10;
  //     doc.setFontSize(8);
  //     doc.setFont("helvetica", "italic");
  //     doc.text("Disclaimer: This information is AI-generated and not a substitute for professional legal advice.", margin, y);

  //     doc.save('LegalSahayak_Response.pdf');
  // };

  return (
    <Card className="shadow-light border border-border/60 bg-card/80 backdrop-blur">
      <CardHeader className="px-5 pt-5 pb-4 border-b bg-gradient-to-r from-primary/5 via-background to-accent/10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Jurisdiction: India</Badge>
              <Badge className="bg-accent text-accent-foreground">
                Confidence: {confidencePercent}%
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              AI-generated guidance
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="answer" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/70 p-1">
          <TabsTrigger value="answer" className="rounded-full">
            Answer
          </TabsTrigger>
          <TabsTrigger value="legal" className="rounded-full">
            Legal References
          </TabsTrigger>
          <TabsTrigger value="plan" className="rounded-full">
            Action Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="answer"
          className="mt-4 p-5 bg-background/60 rounded-2xl border border-border/50"
        >
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {response.answer}
            </ReactMarkdown>
          </div>
        </TabsContent>
        <TabsContent
          value="legal"
          className="mt-4 p-5 bg-background/60 rounded-2xl border border-border/50"
        >
          {response.legal_references.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No legal references provided.
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
              {response.legal_references.map((reference, index) => (
                <li key={`${reference}-${index}`}>{reference}</li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent
          value="plan"
          className="mt-4 p-5 bg-background/60 rounded-2xl border border-border/50"
        >
          {response.action_plan.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No action plan provided.
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {response.action_plan.map((step, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="bg-background rounded-xl border border-border/60 px-4"
                >
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>
                        {index + 1}. {step.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {step.description}
                    </ReactMarkdown>
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
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const quickPrompts = [
    "I work on daily wages. What are my rights?",
    "How do I file a consumer complaint?",
    "What documents do I need for a rental agreement?",
  ];

  // Load initial conversation from sessionStorage on mount
  useEffect(() => {
    const initialConversation = sessionStorage.getItem("initial_conversation");
    if (initialConversation) {
      try {
        const messages = JSON.parse(initialConversation);
        setHistory(messages);
        sessionStorage.removeItem("initial_conversation");
      } catch (error) {
        console.error("Failed to load initial conversation:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const addMessage = (message: Omit<Message, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setHistory((prev) => [...prev, { id, ...message }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const question = input.trim();
    if (!question) return;

    addMessage({ role: "user", content: question });
    setInput("");
    setIsPending(true);

    try {
      const user = authUtils.getCurrentUser();
      const profile = user?.profile;

      // Build demographics with defaults for strict schema compliance
      const demographics: Demographics = {
        age: profile?.age ?? 0,
        gender: profile?.gender ?? "Not specified",
        location: profile?.location ?? "India",
        education_level: profile?.education_level ?? "Not specified",
        job_title: profile?.job_title ?? "Not specified",
      };

      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, demographics }),
      });

      console.log("Request payload:", { question, demographics });
      console.log("API response status:", res.status);

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
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-background">
      <div
        className="absolute inset-0 bg-repeat bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  LegalSahayak
                </p>
                <h1 className="text-xl font-bold text-foreground">
                  AI Legal Assistant
                </h1>
              </div>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div
            className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8"
            ref={contentRef}
            style={{ paddingBottom: 200 }}
          >
            {history.length === 0 && !isPending && (
              <div className="rounded-3xl border-2 border-border/80 bg-gradient-to-br from-card/90 to-card/70 p-10 shadow-xl backdrop-blur">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Ask your first question
                      </h2>
                      <p className="text-base text-muted-foreground mt-1">
                        Share your situation. We will tailor the answer to your
                        profile.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {quickPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        type="button"
                        variant="secondary"
                        className="rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md"
                        onClick={() => {
                          setInput(prompt);
                          inputRef.current?.focus();
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {history.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="w-6 h-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-xl max-w-[85%] ${message.role === "user" ? "" : "w-full"}`}
                >
                  {message.response ? (
                    <div className="w-full">
                      <AssistantResponse message={message} />
                    </div>
                  ) : (
                    <p className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-lg whitespace-pre-wrap text-base leading-relaxed">
                      {message.content}
                    </p>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-12 w-12 shadow-md">
                    <AvatarFallback className="bg-accent/30">
                      <User className="w-6 h-6 text-accent-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="w-6 h-6 text-primary animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-5 rounded-2xl max-w-[85%] bg-card/80 border border-border/60 shadow-lg">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/80 bg-background/95 backdrop-blur-md shadow-2xl">
          <div className="mx-auto w-full max-w-5xl px-6 py-5">
            <form onSubmit={handleSubmit}>
              <div className="relative rounded-2xl border-2 border-border/70 bg-card shadow-xl overflow-hidden">
                <div className="flex items-end gap-4 p-4">
                  <div className="flex-1">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your legal situation in detail. Include dates, locations, and any relevant context..."
                      disabled={isPending}
                      className="min-h-[100px] text-base leading-relaxed rounded-xl shadow-none border-0 focus-visible:ring-0 resize-none bg-transparent px-2 py-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <div className="pb-2">
                    <Button
                      type="submit"
                      size="icon"
                      className="h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-xl transition-all hover:scale-105"
                      disabled={isPending || !input.trim()}
                    >
                      {isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  💡 Tip: Provide context and location for more accurate
                  guidance.
                </span>
                <span className="font-medium">Powered by LegalSahayak AI</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
