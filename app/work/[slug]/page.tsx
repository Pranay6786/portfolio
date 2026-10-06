import { notFound } from "next/navigation";
import Callout from "@/components/Callout";
import Confidence from "@/components/Confidence";
import ContentTable from "@/components/ContentTable";
import MetricStrip from "@/components/MetricStrip";
import {
  compileCaseStudyBody,
  getAllCaseStudies,
  getCaseStudyBySlug,
  type MdxComponentMap,
} from "@/lib/content";

// Only the slugs returned by generateStaticParams are served; anything else 404s.
export const dynamicParams = false;

const mdxComponents: MdxComponentMap = {
  Callout,
  Confidence,
  MetricStrip,
  table: ContentTable,
};

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.frontmatter.slug }));
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const { frontmatter } = study;
  const Body = await compileCaseStudyBody(study.body);

  return (
    <main className="mx-auto w-full max-w-[40rem] px-5 py-14 sm:px-6 sm:py-20">
      <article data-article="">
        <header className="mb-2 border-b border-border pb-8">
          <h1 className="font-serif text-[2rem] font-semibold leading-[1.15] text-text sm:text-[2.375rem]">
            {frontmatter.title}
          </h1>
          <p className="mt-3 mb-0 font-serif text-[1.1875rem] leading-snug text-muted sm:text-[1.3125rem]">
            {frontmatter.subtitle}
          </p>

          {frontmatter.badges.length > 0 ? (
            <ul className="mt-6 mb-0 flex list-none flex-wrap gap-2 ps-0">
              {frontmatter.badges.map((badge) => (
                <li
                  key={badge}
                  className="my-0 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted"
                >
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}

          {frontmatter.metricStrip ? (
            <div className="mt-5">
              <MetricStrip>{frontmatter.metricStrip}</MetricStrip>
            </div>
          ) : null}

          <p className="mt-5 mb-0 font-serif text-[1.0625rem] leading-[1.7] text-text">
            {frontmatter.summary}
          </p>

          {frontmatter.disclaimer ? (
            <p className="mt-6 mb-2 font-sans text-[0.8125rem] leading-6 text-faint">
              {frontmatter.disclaimer}
            </p>
          ) : null}
        </header>

        <Body components={mdxComponents} />
      </article>
    </main>
  );
}
