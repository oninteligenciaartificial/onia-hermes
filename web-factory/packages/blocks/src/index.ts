export { escapeAttribute, escapeHtml } from "./escape";
export { renderFeatures } from "./features";
export { renderFooter, type FooterOptions } from "./footer";
export { renderHero, type HeroOptions } from "./hero";
export { renderTrust } from "./trust";
export { renderProcess } from "./process";
export { renderFaq } from "./faq";
export { renderStickyCta } from "./sticky-cta";
export { renderIcon, pickCredencialIcon, hasIcon } from "./icons";
export {
  WF_EASE,
  MOTION_CSS,
  MOTION_RUNTIME_JS,
  MOTION_PRIMITIVES,
  renderMotionStyles,
  renderMotionScript,
  renderMotionAssets,
} from "./motion";

// Model blocks: built from the learned catalog (docs/WEB_FACTORY_LEARNED_MODELS.md).
// Each one ships its own token-only CSS so a template composes markup + styles
// from a single import instead of re-declaring block styles per template.
export {
  renderEditorialStatement,
  EDITORIAL_STATEMENT_CSS,
  type EditorialStatementProps,
} from "./editorial-statement";
export {
  renderBenefitStrip,
  BENEFIT_STRIP_CSS,
  type BenefitStripItem,
  type BenefitStripProps,
} from "./benefit-strip";
export {
  renderFooterBrand,
  FOOTER_BRAND_CSS,
  type FooterBrandGroup,
  type FooterBrandItem,
  type FooterBrandProps,
} from "./footer-brand";
export {
  renderMediaHero,
  MEDIA_HERO_CSS,
  type MediaHeroLink,
  type MediaHeroProps,
} from "./media-hero";
export {
  renderPathCards,
  PATH_CARDS_CSS,
  type PathCard,
  type PathCardsProps,
} from "./path-cards";
export {
  renderPropertyCards,
  PROPERTY_CARDS_CSS,
  type PropertyCard,
  type PropertyCardsProps,
  type PropertySpec,
} from "./property-cards";
export {
  renderNewsletterBand,
  NEWSLETTER_BAND_CSS,
  type NewsletterBandProps,
} from "./newsletter-band";

export { renderClinicHero } from "./clinic-hero";
export { renderClinicServices } from "./clinic-services";
export { renderClinicProcess } from "./clinic-process";
export { renderClinicFeature } from "./clinic-feature";
export type { SiteClient } from "./types";
