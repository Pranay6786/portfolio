/**
 * Rules shared by the two places credentials are written: the homepage cards
 * (content/homepage.json, validated in lib/homepage.ts) and the /certificates
 * page's own list (content/certificates.json, validated in lib/certificates.ts).
 * Each validator reports a broken rule against its own file.
 */

/** The only two link labels a credential may carry. */
export const CREDENTIAL_LINK_LABELS = ["Verify credential", "View certificate"] as const;

export type CredentialLinkLabel = (typeof CREDENTIAL_LINK_LABELS)[number];

/** A credential shown as a card, with its issuer's logo. */
export type Credential = {
  issuer: string;
  title: string;
  blurb: string;
  logo: string;
  href: string;
  linkLabel: CredentialLinkLabel;
  /** Columns of the 12-column grid the card takes at `md` and up, 4 to 8. */
  span: number;
};

/** Issuer logos live here. */
export const CREDENTIAL_LOGO_PREFIX = "/images/certs/";

/** Certificate files (PDF and JPG) live here. */
export const CERTIFICATE_FILE_PREFIX = "/certificates/";

export const CREDENTIAL_SPAN_MIN = 4;
export const CREDENTIAL_SPAN_MAX = 8;

/** An absolute https:// URL, or a certificate file in public/certificates/. */
export function isCredentialHref(href: string): boolean {
  return /^https:\/\/[^\s/]+\/\S*$/.test(href) || href.startsWith(CERTIFICATE_FILE_PREFIX);
}

export function isCredentialLinkLabel(label: string): label is CredentialLinkLabel {
  return (CREDENTIAL_LINK_LABELS as readonly string[]).includes(label);
}
