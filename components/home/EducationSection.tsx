import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/**
 * Education entries as a vertical timeline, newest first as authored, then the
 * publication line outside it.
 *
 * Each entry has a 16px marker column holding its dot, a 14px bead with a 2px
 * accent-dim ring on the page background, then the period, institution and
 * detail stacked. The 2px line is drawn per entry: each segment runs from its
 * own dot's centre to the next dot's centre, and the last entry ends in a
 * short tail running 2rem past its dot. Entries are spaced with bottom padding
 * rather than a gap, so a segment can reach the next entry exactly. The line
 * never starts above the first dot, and the dots, drawn above it, hide its
 * upper ends.
 *
 * Centring: the period's first line box is 13px x 1.5 = 19.5px, centre
 * 0.609375rem (9.75px) down. The dot's top margin is that less half its 14px,
 * 0.171875rem (2.75px), and `mx-auto` centres it in the 16px column. The 2px
 * segment sits at `calc(50% - 1px)`, so both are centred on the column's 8px
 * line, and each segment starts and ends 0.609375rem into an entry, on a dot
 * centre. The marker column is hidden
 * from assistive technology, so screen readers get a plain list. Each segment
 * draws itself downward as it scrolls into view: see [data-timeline-segment]
 * in globals.css.
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
              {/* The dot sits on the period's first line, centred 0.609375rem down. */}
              <div aria-hidden="true" className="relative w-4 shrink-0">
                {isLast ? (
                  // The tail: from the last dot's centre to 2rem below its edge.
                  <span
                    data-timeline-segment=""
                    className="absolute top-[0.609375rem] left-[calc(50%-1px)] h-[2.4375rem] w-0.5 bg-border"
                  />
                ) : (
                  <span
                    data-timeline-segment=""
                    className="absolute top-[0.609375rem] -bottom-[0.609375rem] left-[calc(50%-1px)] w-0.5 bg-border"
                  />
                )}
                <span className="relative mx-auto mt-[0.171875rem] block h-3.5 w-3.5 rounded-full border-2 border-accent-dim bg-bg" />
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
