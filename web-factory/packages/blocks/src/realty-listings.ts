import { escapeAttribute, escapeHtml } from "./escape";
import type { Listing, SiteClient } from "./types";

function renderMeta(listing: Listing): string {
  const parts: string[] = [];
  if (typeof listing.dormitorios === "number") parts.push(`${listing.dormitorios} dorm`);
  if (typeof listing.banos === "number") parts.push(`${listing.banos} bano${listing.banos === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function renderCard(listing: Listing, featured: boolean): string {
  const meta = renderMeta(listing);
  const image = listing.imagen?.trim()
    ? `<img src="${escapeAttribute(listing.imagen)}" alt="${escapeAttribute(listing.imagenAlt || listing.titulo)}" loading="lazy" decoding="async">`
    : `<div class="wf-realty-listing-media--empty" aria-hidden="true"></div>`;

  return `
    <article class="wf-realty-listing-card${featured ? " wf-realty-listing--featured" : ""}" data-reveal>
      <figure class="wf-realty-listing-media">
        ${image}
        <span class="wf-realty-listing-price">${escapeHtml(listing.precio)}</span>
        <span class="wf-realty-listing-op">${listing.operacion === "alquiler" ? "Alquiler" : "Venta"}</span>
      </figure>
      <div class="wf-realty-listing-body">
        <h3>${escapeHtml(listing.titulo)}</h3>
        <p class="wf-realty-listing-zone">${escapeHtml(listing.zona)} · ${escapeHtml(listing.tipo)}</p>
        ${meta ? `<p class="wf-realty-listing-meta">${escapeHtml(meta)}</p>` : ""}
      </div>
    </article>
  `;
}

export function renderListings(client: SiteClient): string {
  const listings = client.listings ?? [];
  if (listings.length === 0) {
    return `
      <section class="wf-realty-section" id="propiedades" aria-labelledby="wf-realty-listings-heading">
        <div class="wf-realty-section-head">
          <p class="wf-realty-kicker">Propiedades</p>
          <h2 id="wf-realty-listings-heading">Propiedades disponibles</h2>
        </div>
        <div class="wf-realty-empty" role="status">Todavia no hay propiedades cargadas.</div>
      </section>
    `;
  }

  const featured = listings.find((listing) => listing.destacado);
  const rest = listings.filter((listing) => listing !== featured);

  const cards = [
    featured ? renderCard(featured, true) : "",
    ...rest.map((listing) => renderCard(listing, false)),
  ].join("");

  return `
    <section class="wf-realty-section" id="propiedades" aria-labelledby="wf-realty-listings-heading">
      <div class="wf-realty-section-head">
        <p class="wf-realty-kicker">Propiedades</p>
        <h2 id="wf-realty-listings-heading">Propiedades disponibles</h2>
      </div>
      <div class="wf-realty-listing-grid">
        ${cards}
      </div>
    </section>
  `;
}
