import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/**
 * Education entries as a vertical timeline, newest first as authored, then the
 * publication line outside it.
 *
 * Each entry has a 10px marker column holding its dot, a bead with a 2px
 * accent-dim ring on the page background, then the period, institution and
 * detail stacked. The line is drawn per entry and left off the last one: each
 * segment runs from its own dot's centre to the next dot's centre. Entries are
 * spaced with bottom padding rather than a gap, so a segment can reach the
 * next entry exactly. It never extends above the first dot or below the last,
 * and the dots, drawn above it, hide its ends. The marker column is hidden
 * from assistive technology, so screen readers get a plain list.
 */
export default function EducationSection({
  content,
}: {
  content: HomepageContent["education"];
}) {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="education-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <ul>
        {content.items.map((item, index) => {
          const isLast = index === content.items.length - 1;

          return (
            <li
              key={`${item.period}-${item.institution}`}
              className={isLast ? "flex gap-6" : "flex gap-6 pb-10"}
            >
              {/* The dot sits on the period's first line, centred 0.6rem down. */}
              <div aria-hidden="true" className="relative w-2.5 shrink-0">
                {isLast ? null : (
                  <span className="absolute top-[0.6rem] -bottom-[0.6rem] left-[calc(50%-0.5px)] w-px bg-border" />
                )}
                <span className="relative mt-[0.3rem] block h-2.5 w-2.5 rounded-full border-2 border-accent-dim bg-bg" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[0.8125rem] text-faint">{item.period}</p>
                <p className="mt-1 font-serif text-[1.0625rem] font-semibold leading-snug text-text">
                  {item.institution}
                </p>
                <p className="mt-1 font-sans text-[0.875rem] leading-6 text-muted">
                  {item.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 max-w-[40rem] font-serif text-[1.0625rem] italic leading-snug text-muted">
        {content.publication}
      </p>
    </section>
  );
}
