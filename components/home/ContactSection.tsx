import type { ComponentType, SVGProps } from "react";
import SectionHeader from "@/components/home/SectionHeader";
import { opensNewTab } from "@/components/home/TextLink";
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import type { HomepageContent, HomepageLink } from "@/lib/homepage";

/** Each contact action's icon, matched by its label in homepage.json. */
const ACTION_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Email: MailIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  "Résumé": FileIcon,
};

/**
 * The email's subject line in the inbox, sent as Formspree's `_subject` field.
 * It is never shown on the page.
 */
const FORM_SUBJECT = "Portfolio contact form";

const LABEL_CLASS = "font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted";

// 1.0625rem keeps the text at 17px, above the 16px below which iOS zooms in on
// a focused field.
const FIELD_CLASS =
  "w-full rounded-[4px] border border-border bg-surface px-3.5 py-2.5 font-sans text-[1.0625rem] text-text placeholder:text-faint focus:outline-2 focus:outline-offset-2 focus:outline-accent";

/**
 * Closing lines, a contact form, and the ways to get in touch as icon links.
 *
 * The form is plain HTML posting to Formspree, with no client code: it works
 * with JavaScript disabled, and Formspree answers with its own thank-you page.
 * `_gotcha` is Formspree's honeypot. It is removed from layout, the tab order
 * and the accessibility tree, so only a bot that fills every field fills it.
 */
export default function ContactSection({ content }: { content: HomepageContent["contact"] }) {
  const { form } = content;

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="contact-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <div className="flex max-w-[40rem] flex-col gap-2">
        {content.lines.map((line) => (
          <p key={line} className="font-serif text-[1.3125rem] leading-snug text-text">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-10 max-w-[40rem] rounded-[4px] border border-border bg-surface p-6 sm:p-8">
        <form method="POST" action={form.endpoint} className="flex flex-col gap-5">
          <input type="hidden" name="_subject" value={FORM_SUBJECT} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className={LABEL_CLASS}>
                {form.nameLabel}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={FIELD_CLASS}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className={LABEL_CLASS}>
                {form.emailLabel}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className={LABEL_CLASS}>
              {form.messageLabel}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder={form.messagePlaceholder}
              className={`${FIELD_CLASS} min-h-28 resize-y`}
            />
          </div>

          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div>
            <button
              type="submit"
              className="rounded-full border border-accent-dim bg-accent-tint px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-accent hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {form.submitLabel}
            </button>
          </div>
        </form>
      </div>

      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-6">
        {content.actions.map((action) => (
          <li key={`${action.label}-${action.href}`}>
            <ContactIconLink action={action} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactIconLink({ action }: { action: HomepageLink }) {
  const Icon = ACTION_ICONS[action.label];

  if (!Icon) {
    throw new Error(
      `No contact icon for the action labelled "${action.label}" in content/homepage.json. ` +
        `Known labels: ${Object.keys(ACTION_ICONS).join(", ")}.`,
    );
  }

  const newTab = opensNewTab(action.href);

  return (
    <a
      href={action.href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex flex-col items-center gap-2 text-muted hover:text-accent"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface">
        <Icon width={20} height={20} />
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em]">
        {action.label}
        {newTab ? <span className="sr-only"> (opens in new tab)</span> : null}
      </span>
    </a>
  );
}
