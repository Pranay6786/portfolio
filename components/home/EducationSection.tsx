import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/** Education entries, newest first as authored, then the publication line. */
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

      <ul className="flex flex-col gap-8">
        {content.items.map((item) => (
          <li
            key={`${item.period}-${item.institution}`}
            className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6"
          >
            <p className="pt-1 font-mono text-[0.8125rem] text-faint">{item.period}</p>
            <div>
              <p className="font-serif text-[1.0625rem] font-semibold leading-snug text-text">
                {item.institution}
              </p>
              <p className="mt-1 font-sans text-[0.875rem] leading-6 text-muted">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-[40rem] font-serif text-[1.0625rem] italic leading-snug text-muted">
        {content.publication}
      </p>
    </section>
  );
}
