import type { Metadata } from "next";
import { ViewTransition } from "react";
import BackgroundSection from "@/components/home/BackgroundSection";
import CertificationsSection from "@/components/home/CertificationsSection";
import ContactSection from "@/components/home/ContactSection";
import DecideSection from "@/components/home/DecideSection";
import EducationSection from "@/components/home/EducationSection";
import HeroSection from "@/components/home/HeroSection";
import SkillsSection from "@/components/home/SkillsSection";
import WorkSection from "@/components/home/WorkSection";
import { getAllCaseStudies } from "@/lib/content";
import { getHomepageContent } from "@/lib/homepage";

// Both strings come from content/homepage.json, so no copy lives here. The
// title joins the name and the role line, which reads mid-sentence there, so
// its first letter is lowered: "Pranay Patil - targeting APM / Junior PM roles".
export function generateMetadata(): Metadata {
  const { hero } = getHomepageContent();
  const role = hero.subhead.charAt(0).toLowerCase() + hero.subhead.slice(1);

  return {
    title: `${hero.name} - ${role}`,
    description: hero.lines.join(" "),
  };
}

export default function Home() {
  const content = getHomepageContent();
  const featured = getAllCaseStudies()
    .map((study) => study.frontmatter)
    .filter((frontmatter) => frontmatter.kind === "featured");

  // Cross-fades the page in and out on navigation; see ::view-transition in
  // globals.css. Updates within the page do not animate.
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <main className="mx-auto w-full max-w-[61rem] px-5 sm:px-6">
        <HeroSection content={content.hero} />
        <WorkSection content={content.work} studies={featured} />
        <DecideSection content={content.decide} />
        <BackgroundSection content={content.background} />
        <SkillsSection content={content.skills} />
        <CertificationsSection content={content.certifications} />
        <EducationSection content={content.education} />
        <ContactSection content={content.contact} />
      </main>
    </ViewTransition>
  );
}
