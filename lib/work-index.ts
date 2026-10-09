import fs from "node:fs";
import path from "node:path";
import type { CaseStudyKind } from "@/lib/content";

export type WorkIndexContent = {
  kicker: string;
  title: string;
  intro: string;
  groups: Record<CaseStudyKind, string>;
};

const WORK_INDEX_FILE = "content/work.json";

function fail(field: string, problem: string): never {
  throw new Error(`Invalid content in ${WORK_INDEX_FILE}: field "${field}" ${problem}.`);
}

/** A plain object carrying exactly the given keys, as in lib/homepage.ts. */
function record(value: unknown, field: string, keys: readonly string[]): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(field, "must be an object");
  }
  const data = value as Record<string, unknown>;
  for (const key of keys) {
    if (!(key in data)) {
      fail(field === "(top level)" ? key : `${field}.${key}`, "is required but missing");
    }
  }
  for (const key of Object.keys(data)) {
    if (!keys.includes(key)) {
      fail(field === "(top level)" ? key : `${field}.${key}`, "is not a known field");
    }
  }
  return data;
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(field, "must be a non-empty string");
  }
  return value;
}

/** Validates the parsed /work index copy, naming the offending field. */
export function validateWorkIndex(value: unknown): WorkIndexContent {
  const root = record(value, "(top level)", ["kicker", "title", "intro", "groups"]);
  const groups = record(root.groups, "groups", ["featured", "library"]);

  return {
    kicker: text(root.kicker, "kicker"),
    title: text(root.title, "title"),
    intro: text(root.intro, "intro"),
    groups: {
      featured: text(groups.featured, "groups.featured"),
      library: text(groups.library, "groups.library"),
    },
  };
}

/** The /work index copy from content/work.json, parsed and validated. */
export function getWorkIndexContent(): WorkIndexContent {
  const source = fs.readFileSync(path.join(process.cwd(), WORK_INDEX_FILE), "utf8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid content in ${WORK_INDEX_FILE}: not valid JSON (${reason}).`);
  }

  return validateWorkIndex(parsed);
}
