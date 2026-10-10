import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import type { ComponentType, ElementType } from "react";

/** Map of tag name or component name to the component MDX should render for it. */
export type MdxComponentMap = Record<string, ElementType>;

export type CaseStudyKind = "featured" | "library";

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  subtitle: string;
  kind: CaseStudyKind;
  order: number;
  badges: string[];
  metricStrip: string | null;
  summary: string;
  disclaimer: string | null;
  /** A publicly usable version of the product, when there is one. */
  liveUrl: string | null;
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  body: string;
};

const CASE_STUDY_DIR = path.join(process.cwd(), "content", "case-studies");

const KINDS: readonly CaseStudyKind[] = ["featured", "library"];

function fail(file: string, field: string, problem: string): never {
  throw new Error(
    `Invalid frontmatter in ${file}: field "${field}" ${problem}.`,
  );
}

function requireString(data: Record<string, unknown>, field: string, file: string): string {
  const value = data[field];
  if (value === undefined || value === null) {
    fail(file, field, "is required but missing");
  }
  if (typeof value !== "string") {
    fail(file, field, `must be a string, received ${typeof value}`);
  }
  if (value.trim() === "") {
    fail(file, field, "must be a non-empty string");
  }
  return value;
}

function nullableString(data: Record<string, unknown>, field: string, file: string): string | null {
  const value = data[field];
  if (value === undefined) {
    fail(file, field, "is required but missing (use null if it does not apply)");
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    fail(file, field, `must be a string or null, received ${typeof value}`);
  }
  return value;
}

/**
 * The one optional field: absent and null both mean "no live product". When
 * present it must be an absolute https:// URL. This mirrors the endpoint check
 * in lib/homepage.ts, except that a bare host with no path is accepted, since
 * a product's address is often just its domain.
 */
function optionalHttpsUrl(data: Record<string, unknown>, field: string, file: string): string | null {
  const value = data[field];
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    fail(file, field, `must be a string or null, received ${typeof value}`);
  }
  if (!/^https:\/\/[^\s/]+(\/\S*)?$/.test(value)) {
    fail(file, field, `must be an absolute https:// URL, received ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * Validates one parsed frontmatter object. Throws an error naming the file and
 * the offending field. Called from the content loaders, which only run during
 * prerendering, so a bad field fails the build rather than a request.
 */
export function validateFrontmatter(data: unknown, file: string): CaseStudyFrontmatter {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(`Invalid frontmatter in ${file}: expected a block of key/value pairs.`);
  }

  const raw = data as Record<string, unknown>;

  const slug = requireString(raw, "slug", file);
  const title = requireString(raw, "title", file);
  const subtitle = requireString(raw, "subtitle", file);
  const summary = requireString(raw, "summary", file);

  const kind = raw.kind;
  if (kind === undefined || kind === null) {
    fail(file, "kind", "is required but missing");
  }
  if (typeof kind !== "string" || !KINDS.includes(kind as CaseStudyKind)) {
    fail(file, "kind", `must be one of ${KINDS.map((k) => `"${k}"`).join(" or ")}, received ${JSON.stringify(kind)}`);
  }

  const order = raw.order;
  if (order === undefined || order === null) {
    fail(file, "order", "is required but missing");
  }
  if (typeof order !== "number" || !Number.isFinite(order)) {
    fail(file, "order", `must be a finite number, received ${JSON.stringify(order)}`);
  }

  const badges = raw.badges;
  if (badges === undefined || badges === null) {
    fail(file, "badges", "is required but missing (use an empty list if there are none)");
  }
  if (!Array.isArray(badges)) {
    fail(file, "badges", `must be a list of strings, received ${typeof badges}`);
  }
  badges.forEach((badge, index) => {
    if (typeof badge !== "string") {
      fail(file, `badges[${index}]`, `must be a string, received ${typeof badge}`);
    }
  });

  return {
    slug,
    title,
    subtitle,
    kind: kind as CaseStudyKind,
    order,
    badges: badges as string[],
    metricStrip: nullableString(raw, "metricStrip", file),
    summary,
    disclaimer: nullableString(raw, "disclaimer", file),
    liveUrl: optionalHttpsUrl(raw, "liveUrl", file),
  };
}

function readCaseStudyFile(fileName: string): CaseStudy {
  const filePath = path.join(CASE_STUDY_DIR, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const relativePath = path.posix.join("content/case-studies", fileName);

  return {
    frontmatter: validateFrontmatter(parsed.data, relativePath),
    body: parsed.content,
  };
}

/** Every case study in content/case-studies/, validated and sorted by order. */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDY_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CASE_STUDY_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readCaseStudyFile)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

/** One case study by its frontmatter slug, or undefined if there is no match. */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return getAllCaseStudies().find((study) => study.frontmatter.slug === slug);
}

export type Section = {
  id: string;
  text: string;
};

/**
 * Turns heading text into an ASCII-safe anchor: lowercase, words joined by
 * hyphens. Accented letters are decomposed and their marks dropped so that
 * "Café" and "Cafe" both produce "cafe" rather than a percent-encoded id.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['‘’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The ordered list of `##` headings in a case study body, as anchor targets.
 * Fenced code blocks are skipped so a commented-out heading cannot leak in.
 * Repeated heading text gets a numeric suffix, so ids stay unique.
 */
export function getSections(body: string): Section[] {
  const seen = new Map<string, number>();
  const sections: Section[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line.startsWith("## ")) {
      continue;
    }

    const text = line.slice(3).trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;

    seen.set(base, count + 1);
    sections.push({ id: count === 0 ? base : `${base}-${count + 1}`, text });
  }

  return sections;
}

/**
 * Compiles an MDX body into a React component. Runs during prerendering, so the
 * compile cost is paid at build time.
 */
export async function compileCaseStudyBody(
  body: string,
): Promise<ComponentType<{ components?: MdxComponentMap }>> {
  const { default: Content } = await evaluate(body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
  });

  return Content as ComponentType<{ components?: MdxComponentMap }>;
}
