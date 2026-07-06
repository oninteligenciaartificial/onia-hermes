import { renderClinicHeroFullbleed } from "./clinic-hero-fullbleed";
import { renderClinicHeroSplit } from "./clinic-hero-split";
import { renderClinicHeroTypographic } from "./clinic-hero-typographic";
import { renderClinicHeroVideo } from "./clinic-hero-video";
import type { SiteClient } from "./types";

export type HeroVariant = "fullbleed" | "split" | "typographic" | "video";

// Hero variant dispatcher: the composition is chosen from client.heroVariant, or
// auto-selected from signals (video, rubro, photo) so the factory picks a
// different hero per client instead of always rendering the same layout.
export function renderClinicHero(client: SiteClient): string {
  switch (resolveHeroVariant(client)) {
    case "split":
      return renderClinicHeroSplit(client);
    case "typographic":
      return renderClinicHeroTypographic(client);
    case "video":
      return renderClinicHeroVideo(client);
    default:
      return renderClinicHeroFullbleed(client);
  }
}

const BRAND_LED_RUBRO = /(estudio|agencia|marca|boutique|fotograf|arquitect|dise|joyer|moda|est[eé]tica|spa)/;

export function resolveHeroVariant(client: SiteClient): HeroVariant {
  const explicit = client.heroVariant;
  if (explicit && explicit !== "auto") return explicit;
  // Auto-selection by signals, most specific first.
  if (client.heroVideo?.trim()) return "video";
  if (BRAND_LED_RUBRO.test((client.rubro ?? "").toLowerCase())) return "typographic";
  if (client.heroPoster?.trim()) return "fullbleed";
  return "split";
}
