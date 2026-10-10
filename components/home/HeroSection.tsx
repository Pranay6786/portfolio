import ActionLinks from "@/components/home/ActionLinks";
import type { HomepageContent } from "@/lib/homepage";

/** The opening statement: stacked serif lines, a subhead and the actions. No kicker. */
export default function HeroSection({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* The lines arrive one after another on load: see [data-hero-lines] in
          globals.css. */}
      <h1
        id="hero-title"
        data-hero-lines=""
        className="font-serif text-[2rem] font-semibold leading-[1.15] text-text sm:text-[2.375rem]"
      >
        {content.lines.map((line) => (
          <span key={line} className="block text-balance">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-6 font-sans text-[1.0625rem] leading-relaxed text-muted">
        {content.subhead}
      </p>
      <div className="mt-8">
        <ActionLinks actions={content.actions} />
      </div>
    </section>
  );
}
