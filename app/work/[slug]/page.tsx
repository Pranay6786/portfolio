import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleHeading from "@/components/ArticleHeading";
import BeforeAfter from "@/components/BeforeAfter";
import Callout from "@/components/Callout";
import CaseStudyBar from "@/components/CaseStudyBar";
import Confidence from "@/components/Confidence";
import ContentTable from "@/components/ContentTable";
import MetricStrip from "@/components/MetricStrip";
import SectionIndex from "@/components/SectionIndex";
import { MASTHEAD_SENTINEL_ID } from "@/lib/case-study-bar";
import {
  compileCaseStudyBody,
  getAllCaseStudies,
  getCaseStudyBySlug,
  getSections,
  type MdxComponentMap,
} from "@/lib/content";

// Only the slugs returned by generateStaticParams are served; anything else 404s.
export const dynamicParams = false;

const mdxComponents: MdxComponentMap = {
  BeforeAfter,
  Callout,
  Confidence,
  MetricStrip,
  h2: ArticleHeading,
  table: ContentTable,
};

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.frontmatter.slug }));
}

// An unknown slug returns no metadata rather than throwing: the page itself
// calls notFound(), and the 404 keeps the layout's default title.
export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {};
  }

  return {
    title: study.frontmatter.title,
    description: study.frontmatter.summary,
  };
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
  const sections = getSections(study.body);
  const Body = await compileCaseStudyBody(study.body);

  return (
    <>
      {/* Outside main so it spans the full width, like the site header. */}
      <CaseStudyBar
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        badges={frontmatter.badges}
      />

      <main className="mx-auto w-full max-w-[61rem] px-5 pt-8 pb-14 sm:px-6 sm:pt-12 sm:pb-20">
        {/* Masthead: centred on the content width, above the two-column group. */}
        <header className="mx-auto mb-12 max-w-[40rem] border-b border-border pb-10 text-center">
          <h1 className="font-serif text-[2rem] font-semibold leading-[1.15] text-balance text-text sm:text-[2.375rem]">
            {frontmatter.title}
          </h1>
          <p className="mt-3 mb-0 font-serif text-[1.1875rem] leading-snug text-balance text-muted sm:text-[1.3125rem]">
            {frontmatter.subtitle}
          </p>

          {frontmatter.badges.length > 0 ? (
            <ul className="mt-6 mb-0 flex list-none flex-wrap justify-center gap-2 ps-0">
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
            <p className="mt-6 mb-0 font-sans text-[0.8125rem] leading-6 text-faint">
              {frontmatter.disclaimer}
            </p>
          ) : null}
        </header>

        {/* Marks the end of the masthead for CaseStudyBar to observe. */}
        <div id={MASTHEAD_SENTINEL_ID} />

        {/* The index column and the article are centred together as one group:
            13rem + 5rem gap + 40rem. Below lg the index is not rendered and the
            article alone stays centred. */}
        <div className="flex justify-center gap-20">
          <div className="hidden w-52 shrink-0 lg:block">
            <SectionIndex sections={sections} />
          </div>

          <article data-article="" className="w-full max-w-[40rem] min-w-0">
            <Body components={mdxComponents} />
          </article>
        </div>
      </main>
    </>
  );
}
