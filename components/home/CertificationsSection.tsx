import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/** One certification per row: issuer, then the certification itself. */
export default function CertificationsSection({
  content,
}: {
  content: HomepageContent["certifications"];
}) {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader
        titleId="certifications-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <ul className="max-w-[40rem] divide-y divide-border border-y border-border">
        {content.items.map((item) => (
          <li
            key={`${item.issuer}-${item.name}`}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="font-sans text-[0.875rem] text-muted sm:w-40 sm:shrink-0">
              {item.issuer}
            </span>
            <span className="font-serif text-[1.0625rem] text-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
