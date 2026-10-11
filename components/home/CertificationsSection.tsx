import CredentialCard from "@/components/home/CredentialCard";
import IconLink from "@/components/home/IconLink";
import SectionHeader from "@/components/home/SectionHeader";
import { AwardIcon } from "@/components/icons";
import type { HomepageContent } from "@/lib/homepage";

/**
 * Credential cards on a 12-column grid at `md` and up, one column below, each
 * card taking its own span; then a link to the full set on /certificates. The
 * grid is one reveal target, not one per card.
 */
export default function CertificationsSection({
  content,
}: {
  content: HomepageContent["certifications"];
}) {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="certifications-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <ul data-reveal="pending" className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {content.items.map((credential) => (
          <CredentialCard key={`${credential.issuer}-${credential.title}`} credential={credential} />
        ))}
      </ul>

      <p data-reveal="pending" className="mt-8">
        <IconLink
          href={content.allCertificatesHref}
          label={content.allCertificatesLabel}
          icon={AwardIcon}
          layout="inline"
        />
      </p>
    </section>
  );
}
