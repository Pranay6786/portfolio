import type { Metadata } from "next";
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

// Both strings come from content/homepage.json, so no copy lives here.
export function generateMetadata(): Metadata {
  const { hero } = getHomepageContent();

  return {
    title: hero.subhead,
    description: hero.lines.join(" "),
  };
}

export default function Home() {
  const content = getHomepageContent();
  const featured = getAllCaseStudies()
    .map((study) => study.frontmatter)
    .filter((frontmatter) => frontmatter.kind === "featured");

  return (
    <main className="mx-auto w-full max-w-[61rem] px-5 sm:px-6">
      {/* Sections after the hero fade up as they scroll into view, in CSS: see
          [data-reveal-sections] in globals.css. */}
      <div data-reveal-sections="" className="divide-y divide-border">
        <HeroSection content={content.hero} />
        <WorkSection content={content.work} studies={featured} />
        <DecideSection content={content.decide} />
        <BackgroundSection content={content.background} />
        <SkillsSection content={content.skills} />
        <CertificationsSection content={content.certifications} />
        <EducationSection content={content.education} />
        <ContactSection content={content.contact} />
      </div>
    </main>
  );
}
