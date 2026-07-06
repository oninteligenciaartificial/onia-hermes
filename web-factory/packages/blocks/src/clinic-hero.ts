import { renderClinicHeroFullbleed } from "./clinic-hero-fullbleed";
import { renderClinicHeroSplit } from "./clinic-hero-split";
import type { SiteClient } from "./types";

export type HeroVariant = "fullbleed" | "split" | "typographic";

// Hero variant dispatcher: the composition is chosen from client.heroVariant, or
// auto-selected from signals so the factory picks a different hero per client
// instead of always rendering the same layout.
export function renderClinicHero(client: SiteClient): string {
  switch (resolveHeroVariant(client)) {
    case "split":
      return renderClinicHeroSplit(client);
    // "typographic" falls back to full-bleed until its variant ships.
    default:
      return renderClinicHeroFullbleed(client);
  }
}

export function resolveHeroVariant(client: SiteClient): HeroVariant {
  const explicit = client.heroVariant;
  if (explicit && explicit !== "auto") return explicit;
  // Auto: with a usable photo a full-bleed hero reads strongest; without one,
  // the editorial split lets the type carry the hero.
  return client.heroPoster?.trim() ? "fullbleed" : "split";
}
