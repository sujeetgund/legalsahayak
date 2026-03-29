import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLibraryDocumentBySlug } from "@/lib/library-documents";
import { ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import DocumentActions from "./document-actions";

type DocumentViewerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentViewerPage({
  params,
}: DocumentViewerPageProps) {
  const { id } = await params;
  const doc = await getLibraryDocumentBySlug(id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Link
        href="/library"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Link>

      <section className="rounded-2xl border bg-card p-6 shadow-medium sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {doc.topics.slice(0, 2).map((topic) => (
                <Badge
                  key={`${doc.slug}-${topic}`}
                  variant="secondary"
                  className="rounded-full"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <h1 className="font-headline text-3xl tracking-headings sm:text-4xl">
              {doc.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{doc.jurisdiction}</span>
              <Separator
                orientation="vertical"
                className="hidden h-4 sm:block"
              />
              <span>{doc.updatedLabel}</span>
              <Separator
                orientation="vertical"
                className="hidden h-4 sm:block"
              />
              <span>{doc.sectionCount} sections</span>
            </div>
          </div>
          <DocumentActions title={doc.title} />
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <aside className="order-2 lg:order-1 lg:col-span-3">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-lg">Outline</CardTitle>
            </CardHeader>
            <CardContent>
              {doc.outline.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No section headings available.
                </p>
              ) : (
                <nav className="space-y-1">
                  {doc.outline.map((item) => (
                    <a
                      key={`${item.id}-${item.title}`}
                      href={`#${item.id}`}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary ${
                        item.level === 3 ? "ml-4" : ""
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{item.title}</span>
                    </a>
                  ))}
                </nav>
              )}
            </CardContent>
          </Card>
        </aside>

        <main className="order-1 lg:order-2 lg:col-span-9">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <article className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:tracking-headings prose-a:text-primary prose-strong:text-foreground dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug]}
                >
                  {doc.content}
                </ReactMarkdown>
              </article>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
