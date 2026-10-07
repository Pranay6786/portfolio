import fs from "node:fs";
import path from "node:path";

export type HomepageLink = {
  label: string;
  href: string;
};

export type HomepageSectionFrame = {
  number: string;
  kicker: string;
  title: string;
};

export type HomepageContent = {
  hero: {
    lines: string[];
    subhead: string;
    actions: HomepageLink[];
  };
  work: HomepageSectionFrame & {
    intro: string;
    allWorkLabel: string;
    allWorkHref: string;
  };
  decide: HomepageSectionFrame & {
    intro: string;
    steps: {
      number: string;
      title: string;
      body: string;
      linkText: string;
      href: string;
    }[];
  };
  background: HomepageSectionFrame & {
    subtitle: string;
    intro: string;
    paragraphs: string[];
    now: {
      title: string;
      items: { label: string; value: string }[];
    };
    linkText: string;
    linkHref: string;
  };
  skills: HomepageSectionFrame & {
    groups: { title: string; items: string[] }[];
  };
  certifications: HomepageSectionFrame & {
    items: { issuer: string; name: string }[];
  };
  education: HomepageSectionFrame & {
    items: { period: string; institution: string; detail: string }[];
    publication: string;
  };
  contact: HomepageSectionFrame & {
    lines: string[];
    actions: HomepageLink[];
  };
};

const HOMEPAGE_FILE = "content/homepage.json";

function fail(field: string, problem: string): never {
  throw new Error(
    `Invalid content in ${HOMEPAGE_FILE}: field "${field}" ${problem}.`,
  );
}

function describe(value: unknown): string {
  if (value === null) {
    return "null";
  }
  return Array.isArray(value) ? "a list" : typeof value;
}

/**
 * Checks that a value is a plain object carrying exactly the given keys. A key
 * the type does not know is rejected too: it would otherwise never render, and
 * a misspelt field would fail only as "missing" without naming the typo.
 */
function record(
  value: unknown,
  field: string,
  keys: readonly string[],
): Record<string, unknown> {
  const label = field === "" ? "(top level)" : field;
  if (value === undefined) {
    fail(label, "is required but missing");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(label, `must be an object, received ${describe(value)}`);
  }

  const data = value as Record<string, unknown>;
  for (const key of Object.keys(data)) {
    if (!keys.includes(key)) {
      fail(field === "" ? key : `${field}.${key}`, "is not a known field");
    }
  }
  return data;
}

function text(value: unknown, field: string): string {
  if (value === undefined || value === null) {
    fail(field, "is required but missing");
  }
  if (typeof value !== "string") {
    fail(field, `must be a string, received ${describe(value)}`);
  }
  if (value.trim() === "") {
    fail(field, "must be a non-empty string");
  }
  return value;
}

function list<T>(
  value: unknown,
  field: string,
  item: (entry: unknown, entryField: string) => T,
): T[] {
  if (value === undefined || value === null) {
    fail(field, "is required but missing");
  }
  if (!Array.isArray(value)) {
    fail(field, `must be a list, received ${describe(value)}`);
  }
  if (value.length === 0) {
    fail(field, "must contain at least one entry");
  }
  return value.map((entry, index) => item(entry, `${field}[${index}]`));
}

function link(value: unknown, field: string): HomepageLink {
  const data = record(value, field, ["label", "href"]);
  return {
    label: text(data.label, `${field}.label`),
    href: text(data.href, `${field}.href`),
  };
}

function frame(data: Record<string, unknown>, field: string): HomepageSectionFrame {
  return {
    number: text(data.number, `${field}.number`),
    kicker: text(data.kicker, `${field}.kicker`),
    title: text(data.title, `${field}.title`),
  };
}

const FRAME_KEYS = ["number", "kicker", "title"] as const;

/**
 * Validates the parsed homepage content. Throws an error naming the offending
 * field by its full path, such as "decide.steps[2].href". The loader runs only
 * during prerendering, so bad content fails the build rather than a request.
 */
export function validateHomepage(value: unknown): HomepageContent {
  const root = record(value, "", [
    "hero",
    "work",
    "decide",
    "background",
    "skills",
    "certifications",
    "education",
    "contact",
  ]);

  const hero = record(root.hero, "hero", ["lines", "subhead", "actions"]);
  const work = record(root.work, "work", [
    ...FRAME_KEYS,
    "intro",
    "allWorkLabel",
    "allWorkHref",
  ]);
  const decide = record(root.decide, "decide", [...FRAME_KEYS, "intro", "steps"]);
  const background = record(root.background, "background", [
    ...FRAME_KEYS,
    "subtitle",
    "intro",
    "paragraphs",
    "now",
    "linkText",
    "linkHref",
  ]);
  const now = record(background.now, "background.now", ["title", "items"]);
  const skills = record(root.skills, "skills", [...FRAME_KEYS, "groups"]);
  const certifications = record(root.certifications, "certifications", [
    ...FRAME_KEYS,
    "items",
  ]);
  const education = record(root.education, "education", [
    ...FRAME_KEYS,
    "items",
    "publication",
  ]);
  const contact = record(root.contact, "contact", [...FRAME_KEYS, "lines", "actions"]);

  return {
    hero: {
      lines: list(hero.lines, "hero.lines", text),
      subhead: text(hero.subhead, "hero.subhead"),
      actions: list(hero.actions, "hero.actions", link),
    },
    work: {
      ...frame(work, "work"),
      intro: text(work.intro, "work.intro"),
      allWorkLabel: text(work.allWorkLabel, "work.allWorkLabel"),
      allWorkHref: text(work.allWorkHref, "work.allWorkHref"),
    },
    decide: {
      ...frame(decide, "decide"),
      intro: text(decide.intro, "decide.intro"),
      steps: list(decide.steps, "decide.steps", (entry, field) => {
        const step = record(entry, field, ["number", "title", "body", "linkText", "href"]);
        return {
          number: text(step.number, `${field}.number`),
          title: text(step.title, `${field}.title`),
          body: text(step.body, `${field}.body`),
          linkText: text(step.linkText, `${field}.linkText`),
          href: text(step.href, `${field}.href`),
        };
      }),
    },
    background: {
      ...frame(background, "background"),
      subtitle: text(background.subtitle, "background.subtitle"),
      intro: text(background.intro, "background.intro"),
      paragraphs: list(background.paragraphs, "background.paragraphs", text),
      now: {
        title: text(now.title, "background.now.title"),
        items: list(now.items, "background.now.items", (entry, field) => {
          const row = record(entry, field, ["label", "value"]);
          return {
            label: text(row.label, `${field}.label`),
            value: text(row.value, `${field}.value`),
          };
        }),
      },
      linkText: text(background.linkText, "background.linkText"),
      linkHref: text(background.linkHref, "background.linkHref"),
    },
    skills: {
      ...frame(skills, "skills"),
      groups: list(skills.groups, "skills.groups", (entry, field) => {
        const group = record(entry, field, ["title", "items"]);
        return {
          title: text(group.title, `${field}.title`),
          items: list(group.items, `${field}.items`, text),
        };
      }),
    },
    certifications: {
      ...frame(certifications, "certifications"),
      items: list(certifications.items, "certifications.items", (entry, field) => {
        const item = record(entry, field, ["issuer", "name"]);
        return {
          issuer: text(item.issuer, `${field}.issuer`),
          name: text(item.name, `${field}.name`),
        };
      }),
    },
    education: {
      ...frame(education, "education"),
      items: list(education.items, "education.items", (entry, field) => {
        const item = record(entry, field, ["period", "institution", "detail"]);
        return {
          period: text(item.period, `${field}.period`),
          institution: text(item.institution, `${field}.institution`),
          detail: text(item.detail, `${field}.detail`),
        };
      }),
      publication: text(education.publication, "education.publication"),
    },
    contact: {
      ...frame(contact, "contact"),
      lines: list(contact.lines, "contact.lines", text),
      actions: list(contact.actions, "contact.actions", link),
    },
  };
}

/** The homepage copy from content/homepage.json, parsed and validated. */
export function getHomepageContent(): HomepageContent {
  const source = fs.readFileSync(path.join(process.cwd(), HOMEPAGE_FILE), "utf8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid content in ${HOMEPAGE_FILE}: not valid JSON (${reason}).`);
  }

  return validateHomepage(parsed);
}
