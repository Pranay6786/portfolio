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
