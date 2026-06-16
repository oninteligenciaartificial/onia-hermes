import { clientTokenCss } from "@onia/tokens";
import type { LandingClient } from "./landing";

export type StoreProduct = {
  titulo: string;
  categoria: string;
  precio: string;
  desc: string;
  etiqueta: string;
  imagen: string;
  imagenAlt: string;
  marca: string;
  tamano: string;
  uso: string;
  beneficios: string[];
  idealPara: string[];
  ingredientesClave: string[];
  modoUso: string;
  ordenRutina?: number;
};

export type StoreClient = LandingClient & {
  logoIcon?: string;
  logoWide?: string;
  heroVideo?: string;
  categorias: string[];
  productos: StoreProduct[];
  beneficios: string[];
};

export function renderStoreBody(client: StoreClient): string {
  const products = client.productos.length ? client.productos : fallbackProducts(client);
  const routineProducts = getRoutineProducts(products);

  return `
    <main class="store-page" id="top">
      <header class="store-header" aria-label="Principal">
        <a class="store-wordmark" href="#top" aria-label="${escapeAttribute(client.nombre)}">
          ${renderBrandMark(client)}
          <span>${escapeHtml(client.nombre.toLowerCase())}</span>
        </a>
        <nav class="store-nav" aria-label="Secciones">
          <a href="#catalogo">productos</a>
          <a href="#rutina">rutina</a>
          <a href="#faq">faq</a>
        </nav>
        <a class="store-header-cta" href="${escapeAttribute(getStoreActionUrl(client))}">comprar</a>
      </header>

      <section class="store-hero${client.heroVideo ? " has-video" : ""}" aria-labelledby="nuvia-hero-title">
        ${
          client.heroVideo
            ? `<video class="store-hero-video" src="${escapeAttribute(client.heroVideo)}" autoplay loop muted playsinline aria-hidden="true"></video>
        <div class="store-hero-overlay" aria-hidden="true"></div>`
            : ""
        }
        <div class="store-hero-inner">
          <div class="store-hero-copy store-reveal" data-reveal>
            <p class="store-kicker">nuvia skincare edit</p>
            <h1 id="nuvia-hero-title">skincare simple para comprar mejor</h1>
            <p>${escapeHtml(client.descripcion)}</p>
            <ul class="store-hero-proof" aria-label="promesas de compra">
              <li><span></span>${escapeHtml(products.map((product) => product.marca).filter(Boolean).slice(0, 2).join(" + ") || "marcas activas")}</li>
              <li><span></span>${routineProducts.length ? `${routineProducts.length} pasos claros` : "seleccion simple"}</li>
              <li><span></span>sin precios inventados</li>
            </ul>
            <div class="store-actions">
              <a class="store-button-primary" href="#catalogo">ver productos</a>
              <a class="store-button-secondary" href="${escapeAttribute(getStoreActionUrl(client))}">pedir ayuda</a>
            </div>
          </div>

          <div class="store-product-stage store-reveal" data-reveal style="--reveal-index: 1">
            <div class="store-stage-toolbar">
              <span></span>
              <span></span>
              <span></span>
              <strong>${escapeHtml(client.nombre.toLowerCase())}</strong>
              <small>rutina guiada</small>
            </div>
            <div class="store-stage-grid">
              ${products.map((product, index) => renderStageProduct(product, index)).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="store-section store-reveal" id="catalogo" data-reveal>
        <div class="store-section-heading">
          <p class="store-kicker">seleccion inicial</p>
          <h2>productos reales, decision rapida</h2>
          <p>Cada ficha responde que es, para quien sirve y que pedir. El precio queda en consulta hasta que Nuvia cargue valores finales.</p>
        </div>
        <div class="store-product-grid">
          ${products.map((product, index) => renderProductCard(client, product, index)).join("")}
        </div>
      </section>

      ${
        routineProducts.length
          ? `
        <section class="store-routine store-reveal" id="rutina" data-reveal>
          <div class="store-routine-copy">
            <p class="store-kicker">rutina corta</p>
            <h2>dos pasos para comprar con criterio</h2>
            <p>Primero limpia, luego protege. La rutina aparece como una ruta de compra, no como texto decorativo.</p>
            <a class="store-button-secondary" href="${escapeAttribute(getStoreActionUrl(client))}">consultar rutina</a>
          </div>
          <div class="store-routine-list">
            ${routineProducts.map((product, index) => renderRoutineRow(client, product, index)).join("")}
          </div>
        </section>
      `
          : ""
      }

      <section class="store-subscribe store-reveal" id="descuentos" data-reveal>
        <div>
          <p class="store-kicker">descuentos</p>
          <h2>promociones listas cuando el canal se conecte</h2>
          <p>Deja el correo para futuras promos de lanzamiento. La captura queda lista para conectar con CRM, n8n o WhatsApp.</p>
        </div>
        <form class="store-subscribe-form" action="#contacto">
          <label for="nuvia-discount-email">correo</label>
          <input id="nuvia-discount-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" required>
          <button type="submit">suscribirme</button>
        </form>
      </section>

      <section class="store-faq store-reveal" id="faq" data-reveal>
        <div class="store-section-heading">
          <p class="store-kicker">faq</p>
          <h2>informacion clara antes de comprar</h2>
        </div>
        <div class="store-faq-list">
          <details open>
            <summary>como pido un producto?</summary>
            <p>Elige un producto y usa consultar. Cuando Nuvia configure WhatsApp, el mensaje saldra prellenado con el producto.</p>
          </details>
          <details>
            <summary>por que no aparecen precios?</summary>
            <p>Porque aun no hay precios finales registrados. La web evita informacion inventada y deja la consulta preparada.</p>
          </details>
          <details>
            <summary>esto reemplaza una consulta dermatologica?</summary>
            <p>No. Nuvia vende dermocosmetica y productos de uso diario; ante una condicion de piel, consulta a un profesional.</p>
          </details>
        </div>
      </section>

      <section class="store-final store-reveal" data-reveal>
        <h2>elige, consulta y compra con asistencia</h2>
        <a class="store-button-primary" href="${escapeAttribute(getStoreActionUrl(client))}">quiero comprar</a>
      </section>

      <footer class="store-footer" id="contacto">
        <div>
          <strong>${escapeHtml(client.nombre)}</strong>
          <p>${escapeHtml(client.seo.description)}</p>
          ${renderContactStatus(client)}
        </div>
        <div class="store-footer-links">
          <a href="#catalogo">productos</a>
          <a href="#descuentos">descuentos</a>
          ${client.contacto.whatsapp ? `<a href="${escapeAttribute(getStoreActionUrl(client))}">whatsapp</a>` : ""}
        </div>
      </footer>
    </main>
  `;
}

export function renderStoreCss(client: StoreClient): string {
  return `${clientTokenCss(client)}

${storeBaseCss}`;
}

export function renderStoreDocument(client: StoreClient): string {
  const ogImage = client.seo.ogImage
    ? `<meta property="og:image" content="${escapeHtml(client.seo.ogImage)}">`
    : "";
  const favicon = client.logoIcon ? `<link rel="icon" href="${escapeAttribute(client.logoIcon)}">` : "";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(client.seo.title)}</title>
    <meta name="description" content="${escapeHtml(client.seo.description)}">
    <meta property="og:title" content="${escapeHtml(client.seo.title)}">
    <meta property="og:description" content="${escapeHtml(client.seo.description)}">
    ${ogImage}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    ${favicon}
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderStoreBody(client)}
    ${renderStoreRevealScript()}
  </body>
</html>
`;
}

function renderStoreRevealScript(): string {
  return `<script>
(() => {
  const items = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length || reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("store-motion-ready");
  const reveal = (item) => item.classList.add("is-visible");
  window.setTimeout(() => items.forEach(reveal), 2200);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: "0px 0px 18% 0px" });

  items.forEach((item) => observer.observe(item));
})();
</script>`;
}

function renderBrandMark(client: StoreClient): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();

  if (client.logoIcon) {
    return `<span class="store-brand-mark has-image"><img src="${escapeAttribute(client.logoIcon)}" alt=""></span>`;
  }

  return `<span class="store-brand-mark">${escapeHtml(logo.slice(0, 2).toUpperCase())}</span>`;
}

function renderStageProduct(product: StoreProduct, index: number): string {
  const image = renderProductImage(product);

  return `
    <a class="store-stage-card is-${index + 1}" href="#${escapeAttribute(productDomId(product))}">
      <figure>${image}</figure>
      <div class="store-stage-meta">
        <span>${escapeHtml(product.marca || product.categoria)}</span>
        <small>${escapeHtml(product.uso || product.etiqueta)}</small>
      </div>
      <strong>${escapeHtml(product.titulo)}</strong>
    </a>
  `;
}

function renderProductCard(client: StoreClient, product: StoreProduct, index: number): string {
  const chips = [...product.idealPara, ...product.beneficios].slice(0, 3);
  const meta = [product.marca, product.tamano].filter(Boolean).join(" - ") || product.categoria;
  const keyIngredients = product.ingredientesClave.slice(0, 3).join(", ");

  return `
    <article class="store-product-card store-reveal" id="${escapeAttribute(productDomId(product))}" data-reveal style="--reveal-index: ${index}">
      <figure>
        <span class="store-product-badge">${escapeHtml(product.etiqueta || product.categoria)}</span>
        ${renderProductImage(product)}
      </figure>
      <div class="store-product-body">
        <div class="store-product-meta">
          <span>${escapeHtml(meta)}</span>
          ${product.uso ? `<small>${escapeHtml(product.uso)}</small>` : ""}
        </div>
        <h3>${escapeHtml(product.titulo)}</h3>
        <p>${escapeHtml(product.desc)}</p>
        ${keyIngredients ? `<p class="store-product-ingredients">claves: ${escapeHtml(keyIngredients)}</p>` : ""}
        ${chips.length ? `<ul>${chips.map((chip) => `<li>${escapeHtml(chip)}</li>`).join("")}</ul>` : ""}
        <div class="store-product-footer">
          <strong>${escapeHtml(product.precio)}</strong>
          <a href="${escapeAttribute(getStoreActionUrl(client, product))}">consultar</a>
        </div>
      </div>
    </article>
  `;
}

function renderRoutineRow(client: StoreClient, product: StoreProduct, index: number): string {
  return `
    <article class="store-routine-row store-reveal" data-reveal style="--reveal-index: ${index}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <figure>${renderProductImage(product)}</figure>
      <div>
        <h3>${escapeHtml(product.uso || product.titulo)}</h3>
        <p>${escapeHtml(product.modoUso || product.desc)}</p>
      </div>
      <a href="${escapeAttribute(getStoreActionUrl(client, product))}" aria-label="${escapeAttribute(`Consultar ${product.titulo}`)}">+</a>
    </article>
  `;
}

function renderProductImage(product: StoreProduct): string {
  if (product.imagen) {
    return `<img src="${escapeAttribute(product.imagen)}" alt="${escapeAttribute(product.imagenAlt || product.titulo)}" loading="lazy">`;
  }

  return `<span>${escapeHtml(product.categoria)}</span>`;
}

function getRoutineProducts(products: StoreProduct[]): StoreProduct[] {
  return products
    .filter((product) => product.ordenRutina)
    .sort((a, b) => (a.ordenRutina ?? 99) - (b.ordenRutina ?? 99));
}

function renderContactStatus(client: StoreClient): string {
  if (client.contacto.whatsapp) {
    return `<p class="store-contact-status">Pedidos listos por WhatsApp.</p>`;
  }

  if (client.contacto.email) {
    return `<p class="store-contact-status">Pedidos listos por email mientras se conecta WhatsApp.</p>`;
  }

  return `<p class="store-contact-status">Canal de compra en stand by: configura WhatsApp para activar pedidos prellenados.</p>`;
}

function getStoreActionUrl(client: StoreClient, product?: StoreProduct): string {
  const productMeta = product ? [product.marca, product.tamano].filter(Boolean).join(" - ") : "";
  const message = product
    ? `Hola Nuvia, quiero consultar por ${product.titulo}${productMeta ? ` (${productMeta})` : ""}. Esta disponible y cual es el precio final?`
    : "Hola Nuvia, quiero ayuda para comprar en el catalogo.";

  if (client.contacto.whatsapp) {
    const whatsapp = client.contacto.whatsapp.trim();

    if (/^\+?\d[\d\s().-]+$/.test(whatsapp)) {
      return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    }

    const separator = whatsapp.includes("?") ? "&" : "?";
    return `${whatsapp}${separator}text=${encodeURIComponent(message)}`;
  }

  if (client.contacto.email) {
    return `mailto:${client.contacto.email}?subject=${encodeURIComponent("Consulta Nuvia")}&body=${encodeURIComponent(message)}`;
  }

  return "#contacto";
}

function productDomId(product: StoreProduct): string {
  return `producto-${slugify(product.titulo)}`;
}

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function fallbackProducts(client: StoreClient): StoreProduct[] {
  return client.servicios.map((service, index) => ({
    titulo: service.titulo,
    categoria: "Destacados",
    precio: "Consultar",
    desc: service.desc,
    etiqueta: index === 0 ? "Favorito" : "Nuevo",
    imagen: "",
    imagenAlt: "",
    marca: "",
    tamano: "",
    uso: "",
    beneficios: [],
    idealPara: [],
    ingredientesClave: [],
    modoUso: "",
  }));
}

const storeBaseCss = `
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 92px;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f5f6f3;
  color: #111615;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible,
button:focus-visible,
summary:focus-visible,
input:focus-visible {
  outline: 2px solid var(--nuvia-coral);
  outline-offset: 4px;
}

img {
  display: block;
  max-width: 100%;
}

button,
input {
  font: inherit;
}

h1,
h2,
h3,
p,
figure {
  margin: 0;
}

.store-page {
  --nuvia-navy: #0F2D52;
  --nuvia-teal: #00A7A0;
  --nuvia-gold: #F5B400;
  --nuvia-coral: #FF6B6B;
  --nuvia-purple: #7B4FB5;
  --store-ink: #111615;
  --store-muted: rgba(17, 22, 21, 0.62);
  --store-line: rgba(17, 22, 21, 0.12);
  --store-surface: #fbfbf8;
  --ease-store: cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 100vh;
  background:
    radial-gradient(circle at 14% 18%, rgba(0, 167, 160, 0.1), transparent 28%),
    radial-gradient(circle at 86% 44%, rgba(245, 180, 0, 0.11), transparent 26%),
    linear-gradient(180deg, #f8f9f6 0%, #f5f6f3 54%, #eef1ed 100%);
}

.store-header,
.store-section,
.store-routine,
.store-subscribe,
.store-faq,
.store-final,
.store-footer {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}

.store-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  min-height: 76px;
  padding-top: 10px;
  background: rgba(245, 246, 243, 0.74);
  backdrop-filter: blur(18px);
}

.store-wordmark,
.store-nav,
.store-actions,
.store-footer-links {
  display: flex;
  align-items: center;
}

.store-wordmark {
  gap: 8px;
  width: fit-content;
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.store-brand-mark {
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fff;
  color: var(--nuvia-navy);
  font-size: 0.68rem;
  font-weight: 700;
}

.store-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-nav {
  justify-content: center;
  gap: 22px;
  min-height: 38px;
  padding: 0 18px;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 999px;
  background: rgba(251, 251, 248, 0.72);
  backdrop-filter: blur(18px);
  font-size: 0.78rem;
  font-weight: 560;
}

.store-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  min-width: 32px;
}

.store-header-cta,
.store-button-primary,
.store-product-footer a,
.store-subscribe-form button,
.store-final a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  color: #fffdfa;
  background: var(--nuvia-coral);
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
}

.store-header-cta {
  justify-self: end;
  padding: 0 18px;
}

.store-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  min-height: calc(100dvh - 76px);
  padding: clamp(34px, 5vw, 64px) 0 clamp(72px, 8vw, 108px);
  background: #f5f6f3;
}

.store-hero-inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(380px, 1.12fr);
  gap: clamp(28px, 6vw, 88px);
  align-items: center;
  width: min(1120px, calc(100% - 40px));
  min-height: calc(100dvh - 232px);
  margin: 0 auto;
}

.store-hero-video,
.store-hero-overlay {
  position: absolute;
  inset: 0;
}

.store-hero-video {
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(0.96);
}

.store-hero-overlay {
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(8, 12, 15, 0.86) 0%, rgba(8, 12, 15, 0.5) 48%, rgba(8, 12, 15, 0.66) 100%),
    linear-gradient(180deg, rgba(8, 12, 15, 0.12) 0%, rgba(8, 12, 15, 0.82) 100%);
}

.store-hero.has-video {
  color: #fffdfa;
  background: #080c0f;
}

.store-hero.has-video .store-kicker,
.store-hero.has-video .store-hero-copy p:not(.store-kicker) {
  color: rgba(255, 255, 255, 0.78);
}

.store-hero.has-video h1 {
  color: #fffdfa;
  text-shadow: 0 24px 72px rgba(0, 0, 0, 0.34);
}

.store-hero.has-video .store-button-secondary {
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.store-hero.has-video .store-product-stage {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(251, 251, 248, 0.88);
  backdrop-filter: blur(18px);
  box-shadow: 0 34px 90px rgba(0, 0, 0, 0.24);
}

.store-hero-copy {
  display: grid;
  gap: 18px;
  align-content: center;
  min-width: 0;
}

.store-hero-proof {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.store-hero-proof li {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.86);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  font-size: 0.78rem;
  font-weight: 560;
}

.store-hero-proof span {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--nuvia-teal);
}

.store-hero-proof li:nth-child(2) span {
  background: var(--nuvia-gold);
}

.store-hero-proof li:nth-child(3) span {
  background: var(--nuvia-purple);
}

.store-kicker {
  color: rgba(17, 22, 21, 0.72);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  text-transform: lowercase;
}

.store-hero h1,
.store-section-heading h2,
.store-routine h2,
.store-subscribe h2,
.store-faq h2,
.store-final h2 {
  max-width: 780px;
  color: var(--store-ink);
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.93;
  text-wrap: balance;
}

.store-hero h1 {
  font-size: clamp(3.9rem, 7vw, 6rem);
  line-height: 0.89;
}

.store-hero-copy p:not(.store-kicker),
.store-section-heading p,
.store-routine-copy p,
.store-subscribe p,
.store-faq-list p,
.store-footer p {
  max-width: 560px;
  color: var(--store-muted);
  font-size: 0.98rem;
  line-height: 1.58;
  text-wrap: pretty;
}

.store-actions {
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.store-button-primary,
.store-button-secondary {
  min-height: 44px;
  padding: 0 18px;
}

.store-button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: 1px solid rgba(17, 22, 21, 0.12);
  border-radius: 999px;
  color: var(--store-ink);
  background: rgba(251, 251, 248, 0.5);
  font-size: 0.82rem;
  font-weight: 650;
}

.store-product-stage {
  overflow: hidden;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 14px;
  background: var(--store-surface);
  box-shadow: 0 26px 62px rgba(17, 22, 21, 0.1);
}

.store-stage-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(17, 22, 21, 0.08);
}

.store-stage-toolbar span {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--nuvia-coral);
}

.store-stage-toolbar span:nth-child(2) {
  background: var(--nuvia-teal);
}

.store-stage-toolbar span:nth-child(3) {
  background: var(--nuvia-gold);
}

.store-stage-toolbar strong {
  margin-left: auto;
  font-size: 0.78rem;
}

.store-stage-toolbar small {
  min-height: 24px;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--nuvia-teal);
  background: rgba(0, 167, 160, 0.1);
  font-size: 0.68rem;
  font-weight: 650;
}

.store-stage-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 16px;
}

.store-stage-card {
  display: grid;
  gap: 9px;
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.48);
}

.store-stage-card figure,
.store-product-card figure {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  background:
    radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.95), rgba(240, 244, 240, 0.72) 64%, rgba(229, 236, 231, 0.5));
}

.store-stage-card figure {
  aspect-ratio: 1 / 0.8;
}

.store-stage-card img,
.store-product-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
}

.store-stage-meta,
.store-product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.store-stage-meta small,
.store-product-meta small,
.store-stage-card span,
.store-product-body span,
.store-product-body li {
  color: rgba(17, 22, 21, 0.58);
  font-size: 0.76rem;
  font-weight: 620;
}

.store-stage-meta small,
.store-product-meta small {
  color: var(--nuvia-teal);
  white-space: nowrap;
}

.store-stage-card strong {
  color: var(--store-ink);
  font-size: 0.94rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.08;
}

.store-section {
  padding: clamp(70px, 9vw, 112px) 0 0;
}

.store-section-heading {
  display: grid;
  gap: 12px;
  max-width: 760px;
  margin-bottom: 28px;
}

.store-section-heading h2,
.store-routine h2,
.store-subscribe h2,
.store-faq h2,
.store-final h2 {
  font-size: clamp(2.6rem, 5.8vw, 5.4rem);
  letter-spacing: -0.035em;
}

.store-product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.store-product-card {
  display: grid;
  grid-template-columns: minmax(280px, 0.88fr) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 14px;
  background: var(--store-surface);
  box-shadow: 0 18px 44px rgba(17, 22, 21, 0.05);
}

.store-product-card figure {
  position: relative;
  min-height: 390px;
  border-radius: 0;
}

.store-product-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1;
  min-height: 30px;
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--store-ink);
  background: rgba(245, 180, 0, 0.78);
  font-size: 0.72rem;
  font-weight: 650;
}

.store-product-body {
  display: grid;
  align-content: center;
  gap: 12px;
  padding: clamp(22px, 3vw, 34px);
}

.store-product-body h3 {
  color: var(--store-ink);
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  font-weight: 520;
  letter-spacing: -0.04em;
  line-height: 0.98;
  text-wrap: balance;
}

.store-product-body p {
  color: var(--store-muted);
  line-height: 1.58;
}

.store-product-ingredients {
  color: rgba(15, 45, 82, 0.8) !important;
  font-size: 0.9rem;
  font-weight: 560;
}

.store-product-body ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 2px 0;
  list-style: none;
}

.store-product-body li {
  min-height: 28px;
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(0, 167, 160, 0.08);
  color: var(--nuvia-teal);
}

.store-product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(17, 22, 21, 0.1);
}

.store-product-footer strong {
  font-size: 1rem;
  font-weight: 700;
}

.store-product-footer a {
  min-height: 38px;
  padding: 0 15px;
  background: var(--nuvia-navy);
}

.store-routine {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
  gap: clamp(26px, 6vw, 80px);
  padding: clamp(78px, 10vw, 122px) 0 0;
}

.store-routine-copy {
  display: grid;
  align-content: start;
  gap: 14px;
}

.store-routine-list {
  display: grid;
  gap: 12px;
}

.store-routine-row {
  display: grid;
  grid-template-columns: 42px 92px minmax(0, 1fr) 38px;
  gap: 16px;
  align-items: center;
  min-height: 128px;
  padding: 14px;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 14px;
  background: rgba(251, 251, 248, 0.72);
}

.store-routine-row > span,
.store-routine-row a {
  color: rgba(17, 22, 21, 0.46);
  font-size: 0.86rem;
  font-weight: 650;
}

.store-routine-row figure {
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 92px;
  height: 92px;
  border-radius: 12px;
  background: rgba(0, 167, 160, 0.08);
}

.store-routine-row figure img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.store-routine-row h3 {
  color: var(--store-ink);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.store-routine-row p {
  margin-top: 6px;
  color: rgba(17, 22, 21, 0.58);
  line-height: 1.52;
}

.store-routine-row a {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(17, 22, 21, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.52);
}

.store-subscribe {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.7fr);
  gap: 24px;
  align-items: center;
  margin-top: clamp(78px, 10vw, 122px);
  padding: clamp(24px, 4vw, 38px);
  border: 1px solid rgba(15, 45, 82, 0.12);
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(15, 45, 82, 0.96), rgba(0, 167, 160, 0.82));
  color: #fffdfa;
}

.store-subscribe h2 {
  max-width: 720px;
  color: #fffdfa;
}

.store-subscribe p {
  color: rgba(255, 255, 255, 0.76);
}

.store-subscribe .store-kicker {
  color: rgba(255, 255, 255, 0.72);
}

.store-subscribe-form {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
}

.store-subscribe-form label {
  padding-left: 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.76rem;
  font-weight: 650;
}

.store-subscribe-form input {
  min-width: 0;
  min-height: 42px;
  border: 0;
  color: #fffdfa;
  background: transparent;
}

.store-subscribe-form input::placeholder {
  color: rgba(255, 255, 255, 0.56);
}

.store-subscribe-form button {
  min-height: 42px;
  padding: 0 15px;
  color: var(--store-ink);
  background: #fffdfa;
}

.store-faq {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
  gap: clamp(26px, 6vw, 80px);
  padding: clamp(78px, 10vw, 122px) 0 0;
}

.store-faq-list {
  display: grid;
  gap: 10px;
}

.store-faq-list details {
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 12px;
  background: rgba(251, 251, 248, 0.72);
}

.store-faq-list summary {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  cursor: pointer;
  color: var(--store-ink);
  font-weight: 650;
  list-style: none;
}

.store-faq-list summary::-webkit-details-marker {
  display: none;
}

.store-faq-list summary::after {
  content: "+";
}

.store-faq-list details[open] summary::after {
  content: "-";
}

.store-faq-list p {
  padding: 0 18px 18px;
}

.store-final {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 24px;
  padding: clamp(78px, 10vw, 122px) 0;
}

.store-final h2 {
  max-width: 780px;
}

.store-final a {
  min-height: 44px;
  padding: 0 18px;
}

.store-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  padding: 28px 0 42px;
  border-top: 1px solid rgba(17, 22, 21, 0.12);
}

.store-footer strong {
  display: block;
  margin-bottom: 8px;
  color: var(--store-ink);
  font-size: 0.95rem;
}

.store-contact-status {
  margin-top: 8px;
  color: rgba(17, 22, 21, 0.78) !important;
  font-weight: 650;
}

.store-footer-links {
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 14px;
  color: rgba(17, 22, 21, 0.58);
  font-size: 0.86rem;
  font-weight: 650;
}

.store-footer-links a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
}

.store-reveal {
  --reveal-index: 0;
}

.store-motion-ready .store-reveal {
  opacity: 0;
  transform: translate3d(0, 18px, 0);
  filter: blur(5px);
  transition:
    opacity 560ms ease,
    transform 620ms var(--ease-store),
    filter 620ms var(--ease-store);
  transition-delay: min(calc(var(--reveal-index) * 46ms), 260ms);
}

.store-reveal.is-visible,
.store-motion-ready .store-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

@media (hover: hover) and (pointer: fine) {
  .store-header-cta,
  .store-button-primary,
  .store-button-secondary,
  .store-product-footer a,
  .store-stage-card,
  .store-product-card,
  .store-routine-row a,
  .store-subscribe-form button {
    transition:
      transform 180ms ease,
      background 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .store-header-cta:hover,
  .store-button-primary:hover,
  .store-product-footer a:hover,
  .store-subscribe-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(255, 107, 107, 0.22);
  }

  .store-button-secondary:hover,
  .store-stage-card:hover,
  .store-product-card:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 167, 160, 0.24);
  }

  .store-stage-card:hover img,
  .store-product-card:hover img,
  .store-routine-row:hover img {
    transform: scale(1.035);
  }

  .store-stage-card img,
  .store-product-card img,
  .store-routine-row img {
    transition: transform 260ms var(--ease-store);
  }

  .store-header-cta:active,
  .store-button-primary:active,
  .store-button-secondary:active,
  .store-product-footer a:active,
  .store-subscribe-form button:active {
    transform: scale(0.98);
  }
}

@media (max-width: 900px) {
  .store-header {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .store-nav {
    display: none;
  }

  .store-hero-inner,
  .store-routine,
  .store-subscribe,
  .store-faq,
  .store-final,
  .store-footer {
    grid-template-columns: 1fr;
  }

  .store-hero {
    min-height: auto;
    padding-top: 38px;
  }

  .store-hero-inner {
    min-height: auto;
  }

  .store-final {
    align-items: start;
  }

  .store-product-card {
    grid-template-columns: 1fr;
  }

  .store-product-card figure {
    min-height: 330px;
  }

  .store-footer-links {
    justify-content: flex-start;
  }
}

@media (max-width: 680px) {
  .store-header,
  .store-hero-inner,
  .store-section,
  .store-routine,
  .store-subscribe,
  .store-faq,
  .store-final,
  .store-footer {
    width: min(100% - 24px, 1120px);
  }

  .store-header-cta {
    min-height: 38px;
    padding: 0 14px;
  }

  .store-hero h1 {
    font-size: clamp(3.35rem, 18vw, 5rem);
  }

  .store-section-heading h2,
  .store-routine h2,
  .store-subscribe h2,
  .store-faq h2,
  .store-final h2 {
    font-size: clamp(2.65rem, 13vw, 4.2rem);
  }

  .store-stage-grid,
  .store-product-grid {
    grid-template-columns: 1fr;
  }

  .store-product-card {
    grid-template-columns: 1fr;
  }

  .store-product-card figure {
    min-height: 290px;
  }

  .store-product-body {
    padding: 20px;
  }

  .store-routine-row {
    grid-template-columns: 34px minmax(0, 1fr) 36px;
    align-items: start;
  }

  .store-routine-row > span {
    grid-column: 1 / 2;
    grid-row: 1;
  }

  .store-routine-row figure {
    grid-column: 2 / 4;
    grid-row: 2;
    width: 100%;
    height: 150px;
  }

  .store-routine-row > div {
    grid-column: 2 / 4;
    grid-row: 3;
  }

  .store-routine-row a {
    grid-column: 3 / 4;
    grid-row: 1;
  }

  .store-subscribe {
    padding: 18px;
  }

  .store-subscribe-form {
    grid-template-columns: 1fr;
    border-radius: 12px;
  }

  .store-subscribe-form label {
    padding-left: 8px;
  }

  .store-subscribe-form input,
  .store-subscribe-form button,
  .store-button-primary,
  .store-button-secondary {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }

  .store-reveal {
    opacity: 1;
    transform: none;
  }
}
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
