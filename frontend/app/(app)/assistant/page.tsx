"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { authUtils } from "@/lib/auth";
import { ArrowRight, BookOpen, Loader2, Send, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const question = input.trim();
    if (!question) return;

    setIsPending(true);

    try {
      const user = authUtils.getCurrentUser();
      const profile = user?.profile;

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

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: ApiResponse = await res.json();

      // Store initial conversation in sessionStorage
      const initialConversation = [
        {
          id: `${Date.now()}-user`,
          role: "user" as const,
          content: question,
        },
        {
          id: `${Date.now()}-assistant`,
          role: "assistant" as const,
          content: data.answer,
          response: data,
        },
      ];

      sessionStorage.setItem(
        "initial_conversation",
        JSON.stringify(initialConversation),
      );

      router.push("/assistant/chat");
    } catch (error) {
      console.error("Failed to get response:", error);

      // Store error conversation
      const errorConversation = [
        {
          id: `${Date.now()}-user`,
          role: "user" as const,
          content: question,
        },
        {
          id: `${Date.now()}-assistant`,
          role: "assistant" as const,
          content: "Sorry, I encountered an error. Please try again.",
        },
      ];

      sessionStorage.setItem(
        "initial_conversation",
        JSON.stringify(errorConversation),
      );

      router.push("/assistant/chat");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-12">
      {isPending && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Analyzing your question...
              </h3>
              <p className="text-sm text-muted-foreground">
                This may take a moment
              </p>
            </div>
          </Card>
        </div>
      )}
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 text-center">
        <div className="container px-4 md:px-6 z-10">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-5xl font-bold tracking-headings sm:text-6xl xl:text-7xl/none">
              <span className="gradient-text">AI Legal Assistant</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Your confidential, AI-powered guide to understanding your rights.
              Ask any legal question and get clear, actionable answers.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-background rounded-xl shadow-heavy border border-transparent transition-all">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="My landlord won't return my security deposit..."
                  disabled={isPending}
                  className="pr-36 min-h-[80px] text-lg p-6 rounded-xl shadow-none border-0 focus-visible:ring-0 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isPending || input.trim() === ""}
                    className="w-12 h-12 rounded-full btn-primary-gradient"
                  >
                    {isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="w-full py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
              Or, Explore Other Resources
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed">
              Dive deeper into legal topics, learn from others, or browse
              official documents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <LegalDictionary /> */}
            <Card className="p-8 shadow-medium hover:shadow-heavy transition-shadow duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Community Stories
                </CardTitle>
                <CardDescription className="mb-4 flex-1">
                  Read real-life experiences from people who have faced similar
                  legal issues.
                </CardDescription>
              </div>
              <Button asChild className="w-full mt-4 rounded-button">
                <Link href="/forum">
                  Browse Stories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
            <Card className="p-8 shadow-medium hover:shadow-heavy transition-shadow duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
                  <BookOpen className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Explore Legal Topics
                </CardTitle>
                <CardDescription className="mb-4 flex-1">
                  Browse our library of simplified legal acts, codes, and
                  regulations.
                </CardDescription>
              </div>
              <Button asChild className="w-full mt-4 rounded-button">
                <Link href="/legal-library">
                  Go to Library <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
