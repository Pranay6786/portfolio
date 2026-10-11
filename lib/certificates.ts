import fs from "node:fs";
import path from "node:path";
import {
  CREDENTIAL_LINK_LABELS,
  isCredentialHref,
  isCredentialLinkLabel,
  type CredentialLinkLabel,
} from "@/lib/credentials";

/** A completed course listed as a plain row: no card, no logo. */
export type CertificateListItem = {
  issuer: string;
  title: string;
  href: string;
  linkLabel: CredentialLinkLabel;
};

/**
 * The /certificates page's own copy. The six credential cards come from the
 * homepage's certifications in content/homepage.json, so they are not repeated
 * here.
 */
export type CertificatesContent = {
  title: string;
  intro: string;
  description: string;
  alsoCompleted: {
    title: string;
    items: CertificateListItem[];
  };
  closing: string;
};

const CERTIFICATES_FILE = "content/certificates.json";

function fail(field: string, problem: string): never {
  throw new Error(`Invalid content in ${CERTIFICATES_FILE}: field "${field}" ${problem}.`);
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

function listItem(value: unknown, field: string): CertificateListItem {
  const data = record(value, field, ["issuer", "title", "href", "linkLabel"]);

  const href = text(data.href, `${field}.href`);
  if (!isCredentialHref(href)) {
    fail(
      `${field}.href`,
      `must be an absolute https:// URL or a path starting /certificates/, received ${JSON.stringify(href)}`,
    );
  }

  const linkLabel = text(data.linkLabel, `${field}.linkLabel`);
  if (!isCredentialLinkLabel(linkLabel)) {
    fail(
      `${field}.linkLabel`,
      `must be one of ${CREDENTIAL_LINK_LABELS.map((label) => JSON.stringify(label)).join(" or ")}, received ${JSON.stringify(linkLabel)}`,
    );
  }

  return {
    issuer: text(data.issuer, `${field}.issuer`),
    title: text(data.title, `${field}.title`),
    href,
    linkLabel,
  };
}

/** Validates the parsed /certificates copy, naming the offending field. */
export function validateCertificates(value: unknown): CertificatesContent {
  const root = record(value, "(top level)", [
    "title",
    "intro",
    "description",
    "alsoCompleted",
    "closing",
  ]);
  const alsoCompleted = record(root.alsoCompleted, "alsoCompleted", ["title", "items"]);
  if (!Array.isArray(alsoCompleted.items) || alsoCompleted.items.length === 0) {
    fail("alsoCompleted.items", "must be a list with at least one entry");
  }

  return {
    title: text(root.title, "title"),
    intro: text(root.intro, "intro"),
    description: text(root.description, "description"),
    alsoCompleted: {
      title: text(alsoCompleted.title, "alsoCompleted.title"),
      items: alsoCompleted.items.map((entry, index) =>
        listItem(entry, `alsoCompleted.items[${index}]`),
      ),
    },
    closing: text(root.closing, "closing"),
  };
}

/** The /certificates copy from content/certificates.json, parsed and validated. */
export function getCertificatesContent(): CertificatesContent {
  const source = fs.readFileSync(path.join(process.cwd(), CERTIFICATES_FILE), "utf8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid content in ${CERTIFICATES_FILE}: not valid JSON (${reason}).`);
  }

  return validateCertificates(parsed);
}
