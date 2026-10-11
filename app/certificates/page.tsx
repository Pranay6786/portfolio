import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import CredentialCard, { CredentialLink } from "@/components/home/CredentialCard";
import { ArrowLeftIcon } from "@/components/icons";
import { getCertificatesContent } from "@/lib/certificates";
import { getHomepageContent } from "@/lib/homepage";

// Both strings come from content/certificates.json, so no copy lives here.
export function generateMetadata(): Metadata {
  const content = getCertificatesContent();

  return {
    title: content.title,
    description: content.description,
  };
}

/**
 * Every certificate: the homepage's credential cards, read from the same
 * content so the two never drift, then the shorter courses as plain rows.
 */
export default function CertificatesPage() {
  const content = getCertificatesContent();
  const credentials = getHomepageContent().certifications.items;

  // Cross-fades the page in and out on navigation; see ::view-transition in
  // globals.css. Updates within the page do not animate.
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <main className="mx-auto w-full max-w-[61rem] px-5 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        {/* Title and intro on the left; the back control on the right, aligned
            to the top of the block at every width. It is a plain link home to
            the section, so browser back is left entirely to the browser. */}
        <header className="mb-12 flex items-start justify-between gap-6 sm:mb-16">
          <div className="min-w-0">
            <h1 className="font-serif text-[2rem] font-semibold leading-[1.15] text-balance text-text sm:text-[2.375rem]">
              {content.title}
            </h1>
            <p className="mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted">
              {content.intro}
            </p>
          </div>
          <Link
            href={content.back.href}
            aria-label={content.back.label}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-accent"
          >
            <ArrowLeftIcon />
          </Link>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {credentials.map((credential) => (
            <CredentialCard
              key={`${credential.issuer}-${credential.title}`}
              credential={credential}
              headingLevel={2}
            />
          ))}
        </ul>

        <section aria-labelledby="also-completed" className="mt-14 sm:mt-16">
          <h2
            id="also-completed"
            className="mb-6 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint"
          >
            {content.alsoCompleted.title}
          </h2>
          <ul className="max-w-[50rem] divide-y divide-border border-y border-border">
            {content.alsoCompleted.items.map((item) => (
              <li key={item.href} className="flex flex-col gap-1.5 py-5">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
                  {item.issuer}
                </p>
                <p className="font-serif text-[1.0625rem] leading-snug text-text">{item.title}</p>
                <p className="mt-1">
                  <CredentialLink href={item.href} label={item.linkLabel} />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-serif text-[1.0625rem] leading-[1.7] text-muted">
            {content.closing}
          </p>
        </section>
      </main>
    </ViewTransition>
  );
}
