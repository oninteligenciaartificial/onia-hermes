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
export {
  renderScrollStoryHero,
  SCROLL_STORY_HERO_CSS,
  type ScrollStoryFrame,
  type ScrollStoryHeroLink,
  type ScrollStoryHeroProps,
} from "./scroll-story-hero";
export {
  renderStatStrip,
  STAT_STRIP_CSS,
  type StatItem,
  type StatStripProps,
} from "./stat-strip";
export {
  renderInlineQuoteForm,
  INLINE_QUOTE_FORM_CSS,
  type InlineQuoteFormProps,
  type QuoteContact,
  type QuoteField,
  type QuoteFieldType,
} from "./inline-quote-form";
export {
  renderTwoStepPopup,
  renderTwoStepPopupScript,
  TWO_STEP_POPUP_CSS,
  TWO_STEP_POPUP_JS,
  type TwoStepPopupOption,
  type TwoStepPopupProps,
} from "./two-step-popup";

export {
  renderStickyNicheSwitcher,
  renderStickyNicheSwitcherScript,
  STICKY_NICHE_SWITCHER_CSS,
  STICKY_NICHE_SWITCHER_JS,
  type NicheItem,
  type NichePhoto,
  type StickyNicheSwitcherProps,
} from "./sticky-niche-switcher";
export {
  renderPanoramaSlider3D,
  renderPanoramaSlider3DScript,
  PANORAMA_SLIDER_3D_CSS,
  PANORAMA_SLIDER_3D_JS,
  type PanoramaCard,
  type PanoramaSlider3DProps,
} from "./panorama-slider-3d";

export { renderClinicHero } from "./clinic-hero";
export { renderClinicServices } from "./clinic-services";
export { renderClinicProcess } from "./clinic-process";
export { renderClinicFeature } from "./clinic-feature";
export type { SiteClient } from "./types";
