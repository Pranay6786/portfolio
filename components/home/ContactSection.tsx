import ActionLinks from "@/components/home/ActionLinks";
import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/** Closing lines and the ways to get in touch. */
export default function ContactSection({ content }: { content: HomepageContent["contact"] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 py-16 sm:py-24">
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

      <div className="mt-8">
        <ActionLinks actions={content.actions} />
      </div>
    </section>
  );
}
