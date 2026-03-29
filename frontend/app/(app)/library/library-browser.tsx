"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LibraryDocumentSummary } from "@/lib/library-documents";
import { ArrowRight, BookOpenText, Landmark, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type LibraryBrowserProps = {
  documents: LibraryDocumentSummary[];
};

const MAX_VISIBLE_TOPICS = 8;

export default function LibraryBrowser({ documents }: LibraryBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");

  const topics = useMemo(() => {
    const unique = new Set<string>();
    for (const doc of documents) {
      for (const topic of doc.topics) {
        if (topic.trim()) {
          unique.add(topic.trim());
        }
      }
    }

    return ["All", ...Array.from(unique).slice(0, MAX_VISIBLE_TOPICS)];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const lowered = query.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesTopic =
        activeTopic === "All" ||
        doc.topics.some(
          (topic) => topic.toLowerCase() === activeTopic.toLowerCase(),
        );

      const searchable = [
        doc.title,
        doc.jurisdiction,
        doc.excerpt,
        ...doc.topics,
        ...doc.chapters,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = lowered.length === 0 || searchable.includes(lowered);

      return matchesTopic && matchesQuery;
    });
  }, [activeTopic, documents, query]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-medium sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.2),transparent_60%)]" />
        <div className="pointer-events-none absolute -left-14 top-8 h-28 w-28 rounded-full border border-primary/15" />
        <div className="relative space-y-4">
          <Badge
            variant="outline"
            className="w-fit border-primary/30 text-primary"
          >
            Legal Knowledge Atlas
          </Badge>
          <h1 className="font-headline text-3xl tracking-headings sm:text-4xl">
            Explore Law Through Practical Sections
          </h1>
          <p className="max-w-3xl text-muted-foreground md:text-lg">
            Curated legal explainers from statutes and constitutional material.
            Search quickly, jump through chapter structure, and open reading
            pages designed for focused study.
          </p>

          <div className="relative max-w-2xl pt-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by act, chapter, jurisdiction, or legal topic"
              className="h-12 border-primary/20 bg-background pr-12 text-base"
            />
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Filter by topic
        </p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Button
              key={topic}
              type="button"
              size="sm"
              variant={activeTopic === topic ? "default" : "outline"}
              onClick={() => setActiveTopic(topic)}
              className="rounded-full"
            >
              {topic}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredDocuments.length}
            </span>{" "}
            document
            {filteredDocuments.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredDocuments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <p className="font-medium">
                No documents match your current search.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another keyword or clear topic filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredDocuments.map((document) => (
              <Link key={document.slug} href={`/library/${document.slug}`}>
                <Card className="group h-full border-primary/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-heavy">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="line-clamp-2 text-xl font-headline tracking-headings">
                          {document.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Landmark className="h-4 w-4" />
                          <span>{document.jurisdiction}</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <BookOpenText className="h-5 w-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {document.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {document.topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={`${document.slug}-${topic}`}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{document.sectionCount} sections</span>
                      <span>{document.updatedLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <span>Open document</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
