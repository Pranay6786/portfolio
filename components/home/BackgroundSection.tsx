import SectionHeader from "@/components/home/SectionHeader";
import TextLink from "@/components/home/TextLink";
import type { HomepageContent } from "@/lib/homepage";

/**
 * The short version of the background, then the "Now" block.
 *
 * The paragraphs run down a marker line built exactly like the education
 * timeline: a 16px column, a 14px accent-dim-ringed dot and a 2px segment from
 * the dot's centre to the same distance past each paragraph's bottom, with
 * `pb-10` on every paragraph, the last included. Only the offsets differ,
 * because the dot is tuned to serif text rather than the 13px mono period: a
 * 17px line at 1.7 is a 28.9px line box, centre 14.45px (0.903125rem) down, so
 * the 14px dot's top margin is 14.45 - 7 = 7.45px (0.465625rem). The segments draw in on scroll like the education ones (see
 * [data-timeline-segment] in globals.css), and the marker column is hidden
 * from assistive technology. The intro above and the link below have no
 * marker.
 */
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

      <div data-reveal="pending" className="max-w-[50rem]">
        {content.paragraphs.map((paragraph) => (
          <div key={paragraph} className="flex gap-6 pb-10">
            {/* The dot sits on the paragraph's first line, centred 0.903125rem down. */}
            <div aria-hidden="true" className="relative w-4 shrink-0">
              <span
                data-timeline-segment=""
                className="absolute top-[0.903125rem] -bottom-[0.903125rem] left-[calc(50%-1px)] w-0.5 bg-border"
              />
              <span className="relative mx-auto mt-[0.465625rem] block h-3.5 w-3.5 rounded-full border-2 border-accent-dim bg-bg" />
            </div>
            <p className="min-w-0 font-serif text-[1.0625rem] leading-[1.7] text-text">
              {paragraph}
            </p>
          </div>
        ))}
      </div>

      <div data-reveal="pending" className="mt-10 max-w-[50rem] rounded-[4px] border border-border bg-surface p-6 sm:p-8">
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

      <p data-reveal="pending" className="mt-8">
        <TextLink href={content.linkHref} size="lg">
          {content.linkText}
        </TextLink>
      </p>
    </section>
  );
}
