import SectionHeader from "@/components/home/SectionHeader";
import TextLink from "@/components/home/TextLink";
import type { HomepageContent } from "@/lib/homepage";

/** The short version of the background, then the "Now" block. */
export default function BackgroundSection({
  content,
}: {
  content: HomepageContent["background"];
}) {
  return (
    <section id="background" aria-labelledby="background-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="background-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
        subtitle={content.subtitle}
        intro={content.intro}
      />

      <div className="flex max-w-[40rem] flex-col gap-5">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph} className="font-serif text-[1.0625rem] leading-[1.7] text-text">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 max-w-[40rem] rounded-[4px] border border-border bg-surface p-6 sm:p-8">
        <h3 className="font-serif text-[1.3125rem] font-semibold leading-[1.35] text-text">
          {content.now.title}
        </h3>
        <dl className="mt-5 flex flex-col gap-4">
          {content.now.items.map((item) => (
            <div key={item.label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="pt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
                {item.label}
              </dt>
              <dd className="font-sans text-[0.875rem] leading-6 text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-8">
        <TextLink href={content.linkHref}>{content.linkText}</TextLink>
      </p>
    </section>
  );
}
