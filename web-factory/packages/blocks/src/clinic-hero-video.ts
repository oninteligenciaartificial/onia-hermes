import { escapeAttribute } from "./escape";
import { renderOverlayHero } from "./clinic-hero-fullbleed";
import type { SiteClient } from "./types";

// Video hero: a muted, looping background video fills the viewport (same overlay
// shell as full-bleed). Falls back to the poster image when no video is set.
export function renderClinicHeroVideo(client: SiteClient): string {
  const video = client.heroVideo?.trim();
  const poster = client.heroPoster?.trim();

  if (!video) {
    const fallback = poster
      ? `<div class="wf-clinic-hero-media"><img class="wf-clinic-hero-img" src="${escapeAttribute(poster)}" alt="" fetchpriority="high" decoding="async"></div>`
      : `<div class="wf-clinic-hero-media wf-clinic-hero-media--empty" aria-hidden="true"></div>`;
    return renderOverlayHero(client, fallback);
  }

  const posterAttr = poster ? ` poster="${escapeAttribute(poster)}"` : "";
  const mediaLayer = `<div class="wf-clinic-hero-media">
    <video class="wf-clinic-hero-video" autoplay muted loop playsinline preload="metadata"${posterAttr}>
      <source src="${escapeAttribute(video)}" type="video/mp4">
    </video>
  </div>`;
  return renderOverlayHero(client, mediaLayer);
}
