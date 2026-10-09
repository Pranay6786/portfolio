import SectionHeader from "@/components/home/SectionHeader";
import TextLink from "@/components/home/TextLink";
import type { HomepageContent } from "@/lib/homepage";

/** The decision steps, each pointing at the case study where it was used. */
export default function DecideSection({ content }: { content: HomepageContent["decide"] }) {
  return (
    <section id="decide" aria-labelledby="decide-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="decide-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
        intro={content.intro}
      />

      <ol className="flex flex-col gap-10">
        {content.steps.map((step) => (
          <li key={step.number} className="grid gap-2 sm:grid-cols-[3rem_1fr] sm:gap-6">
            <p className="pt-1.5 font-mono text-[0.8125rem] text-faint">{step.number}</p>
            <div>
              <h3 className="font-serif text-[1.3125rem] font-semibold leading-[1.35] text-balance text-text">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted">
                {step.body}
              </p>
              <p className="mt-3">
                <TextLink href={step.href}>{step.linkText}</TextLink>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
