import "server-only";

import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

type Frontmatter = {
  act?: string;
  source?: string;
  jurisdiction?: string;
  enactment_date?: string;
  topics?: unknown;
  chapters?: unknown;
};

export type LibraryOutlineItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type LibraryDocumentSummary = {
  slug: string;
  title: string;
  jurisdiction: string;
  topics: string[];
  chapters: string[];
  sectionCount: number;
  updatedLabel: string;
  excerpt: string;
};

export type LibraryDocumentDetail = LibraryDocumentSummary & {
  content: string;
  outline: LibraryOutlineItem[];
};

type ParsedDocument = {
  summary: LibraryDocumentSummary;
  detail: LibraryDocumentDetail;
};

function toSlugFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeList(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function firstHeading(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(markdown: string): string {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith("#") &&
        !line.startsWith("---") &&
        !line.startsWith("|"),
    );

  const sentence = lines.find((line) => /[a-z0-9]/i.test(line)) ?? "";
  return stripInlineMarkdown(sentence).slice(0, 190);
}

function formatUpdatedLabel(rawDate?: string): string {
  if (!rawDate) {
    return "Date not specified";
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function extractOutline(markdown: string): LibraryOutlineItem[] {
  const headingRegex = /^(##|###)\s+(.+)$/gm;
  const outline: LibraryOutlineItem[] = [];
  const slugger = new GithubSlugger();

  for (const match of markdown.matchAll(headingRegex)) {
    const level = match[1] === "##" ? 2 : 3;
    const title = stripInlineMarkdown(match[2]);

    if (!title) {
      continue;
    }

    outline.push({
      id: slugger.slug(title),
      title,
      level,
    });
  }

  return outline;
}

async function parseDocument(filename: string): Promise<ParsedDocument> {
  const fullPath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(fullPath, "utf-8");
  const parsed = matter(raw);
  const data = parsed.data as Frontmatter;

  const slug = toSlugFromFilename(filename);
  const title =
    data.act ??
    data.source ??
    firstHeading(parsed.content) ??
    slug.replace(/-/g, " ");
  const topics = normalizeList(data.topics);
  const chapters = normalizeList(data.chapters);
  const outline = extractOutline(parsed.content);

  const summary: LibraryDocumentSummary = {
    slug,
    title,
    jurisdiction: data.jurisdiction ?? "India",
    topics,
    chapters,
    sectionCount: outline.length,
    updatedLabel: formatUpdatedLabel(data.enactment_date),
    excerpt: extractExcerpt(parsed.content),
  };

  return {
    summary,
    detail: {
      ...summary,
      content: parsed.content,
      outline,
    },
  };
}

async function loadAllDocuments(): Promise<ParsedDocument[]> {
  const files = await fs.readdir(DATA_DIR);
  const markdownFiles = files
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .sort();
  const parsedDocuments = await Promise.all(
    markdownFiles.map((file) => parseDocument(file)),
  );

  return parsedDocuments.sort((a, b) =>
    a.summary.title.localeCompare(b.summary.title),
  );
}

export async function getLibraryDocuments(): Promise<LibraryDocumentSummary[]> {
  const docs = await loadAllDocuments();
  return docs.map((doc) => doc.summary);
}

export async function getLibraryDocumentBySlug(
  slug: string,
): Promise<LibraryDocumentDetail | null> {
  const docs = await loadAllDocuments();
  const match = docs.find((doc) => doc.summary.slug === slug);
  return match?.detail ?? null;
}
