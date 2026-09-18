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
    <article>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.subtitle}</p>
      <ul>
        {frontmatter.badges.map((badge) => (
          <li key={badge}>{badge}</li>
        ))}
      </ul>
      {frontmatter.metricStrip ? (
        <MetricStrip>{frontmatter.metricStrip}</MetricStrip>
      ) : null}
      <p>{frontmatter.summary}</p>
      {frontmatter.disclaimer ? <p>{frontmatter.disclaimer}</p> : null}
      <Body components={mdxComponents} />
    </article>
  );
}
