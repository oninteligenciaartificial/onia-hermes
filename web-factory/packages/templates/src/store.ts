import { clientTokenCss } from "@onia/tokens";
import type { LandingClient } from "./landing";

export type StoreProduct = {
  titulo: string;
  categoria: string;
  precio: string;
  precioValor?: number | null;
  moneda?: string;
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
  incluye: string[];
  especificaciones: StoreProductSpec[];
  detalleImagenes: StoreProductDetailImage[];
  detalleNota: string;
  ordenRutina?: number;
};

export type StoreProductSpec = {
  label: string;
  value: string;
};

export type StoreProductDetailImage = {
  src: string;
  alt: string;
  label: string;
};

export type StoreClient = LandingClient & {
  logoIcon?: string;
  logoWide?: string;
  heroVideo?: string;
  categorias: string[];
  productos: StoreProduct[];
  beneficios: string[];
};

type StoreRenderContext = {
  rootHref: string;
  assetPrefix: string;
};

const STORE_CSS_VERSION = "store-20260617-real-cart-v1";
const rootRenderContext: StoreRenderContext = { rootHref: "", assetPrefix: "" };
const productPageRenderContext: StoreRenderContext = { rootHref: "../../", assetPrefix: "../../" };

export function renderStoreBody(client: StoreClient): string {
  const products = client.productos.length ? client.productos : fallbackProducts(client);
  const routineProducts = getRoutineProducts(products);
  const featuredProducts = products.slice(0, 2);
  const brandNames = getUniqueValues(products.map((product) => product.marca || product.categoria));
  const categoryNames = getUniqueValues(products.map((product) => product.categoria));
  const slogan = client.tagline || "Everything for everyone";

  return `
    <main class="store-page" id="top">
      ${renderStoreHeader(client, slogan, rootRenderContext)}

      <section class="store-hero${client.heroVideo ? " has-video" : ""}" aria-labelledby="nuvia-hero-title">
        ${
          client.heroVideo
            ? `<video class="store-hero-video" src="${escapeAttribute(resolveAssetPath(client.heroVideo, rootRenderContext))}" autoplay loop muted playsinline aria-hidden="true"></video>
        <div class="store-hero-overlay" aria-hidden="true"></div>`
            : ""
        }
        <div class="store-hero-inner">
          <div class="store-hero-copy store-reveal" data-reveal>
            <p class="store-kicker">NUVIA | ${escapeHtml(slogan.toUpperCase())}</p>
            <h1 id="nuvia-hero-title">SKINCARE SIMPLE PARA COMPRAR MEJOR</h1>
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
              <strong>productos destacados del mes</strong>
              <small>10% de descuento</small>
            </div>
            <div class="store-stage-grid">
              ${featuredProducts.map((product, index) => renderStageProduct(product, index, rootRenderContext)).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="store-section store-reveal" id="catalogo" data-reveal>
        <div class="store-section-heading">
          <p class="store-kicker">CATALOGO</p>
          <h2>UN SOLO LUGAR PARA ELEGIR PRODUCTOS</h2>
          <p>El catalogo es la fuente visual principal. Cuando Nuvia agregue mas productos, esta seccion crece sin repetirlos en bloques secundarios.</p>
        </div>
        <div class="store-catalog-tools" aria-label="Resumen del catalogo">
          <div>
            <span>productos</span>
            <strong>${products.length}</strong>
          </div>
          <div>
            <span>marcas</span>
            <p>${escapeHtml(brandNames.join(" + ") || client.nombre)}</p>
          </div>
          <div>
            <span>categorias</span>
            <p>${escapeHtml(categoryNames.join(" + ") || "Seleccion activa")}</p>
          </div>
        </div>
        <div class="store-product-grid">
          ${products.map((product, index) => renderProductCard(product, index, rootRenderContext)).join("")}
        </div>
      </section>

      <section class="store-guide store-reveal" id="guia" data-reveal>
        <div class="store-guide-copy">
          <p class="store-kicker">GUIA DE COMPRA</p>
          <h2>COMPRA ASISTIDA, SIN REPETIR EL CATALOGO</h2>
          <p>Esta guia explica el proceso. Los productos viven en el catalogo y en sus paginas individuales.</p>
        </div>
        <div class="store-guide-list">
          ${renderBuyingStep("01", "elige", "Revisa el catalogo y abre la ficha del producto que te interesa.")}
          ${renderBuyingStep("02", "consulta", "Usa el CTA de la ficha para pedir disponibilidad, precio final y recomendacion.")}
          ${renderBuyingStep("03", "compra", "Cuando el canal este configurado, Nuvia recibira el mensaje prellenado.")}
        </div>
      </section>

      <section class="store-subscribe store-reveal" id="descuentos" data-reveal>
        <div>
          <p class="store-kicker">DESCUENTOS</p>
          <h2>PROMOCIONES LISTAS CUANDO EL CANAL SE CONECTE</h2>
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
          <p class="store-kicker">FAQ</p>
          <h2>INFORMACION CLARA ANTES DE COMPRAR</h2>
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
        <h2>ELIGE, CONSULTA Y COMPRA CON ASISTENCIA</h2>
        <button class="store-button-primary" type="button" data-cart-open>abrir carrito</button>
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
      ${renderStoreCart(client, products, rootRenderContext)}
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
  const favicon = client.logoIcon
    ? `<link rel="icon" href="${escapeAttribute(resolveAssetPath(client.logoIcon, rootRenderContext))}">`
    : "";

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
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    ${favicon}
    <link rel="stylesheet" href="./site.css?v=${STORE_CSS_VERSION}">
  </head>
  <body>
    ${renderStoreBody(client)}
    ${renderStoreScripts(client, client.productos.length ? client.productos : fallbackProducts(client), rootRenderContext)}
  </body>
</html>
`;
}

export function renderStoreProductDocument(client: StoreClient, product: StoreProduct): string {
  const title = `${product.titulo} | ${client.nombre}`;
  const description = product.desc || client.seo.description;
  const image = product.imagen || client.seo.ogImage;
  const ogImage = image ? `<meta property="og:image" content="${escapeHtml(image)}">` : "";
  const favicon = client.logoIcon
    ? `<link rel="icon" href="${escapeAttribute(resolveAssetPath(client.logoIcon, productPageRenderContext))}">`
    : "";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    ${ogImage}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    ${favicon}
    <link rel="stylesheet" href="../../site.css?v=${STORE_CSS_VERSION}">
  </head>
  <body>
    ${renderStoreProductBody(client, product)}
    ${renderStoreScripts(client, client.productos.length ? client.productos : fallbackProducts(client), productPageRenderContext)}
  </body>
</html>
`;
}

function renderStoreProductBody(client: StoreClient, product: StoreProduct): string {
  const slogan = client.tagline || "Everything for everyone";
  const productMeta = [product.marca, product.categoria].filter(Boolean).join(" | ");
  const productChips = getProductPageChips(product);

  return `
    <main class="store-page store-product-page" id="top">
      ${renderStoreHeader(client, slogan, productPageRenderContext)}

      <section class="store-product-page-hero store-reveal" data-reveal>
        <div class="store-product-page-visual">
          <a class="store-product-back" href="${escapeAttribute(sectionHref(productPageRenderContext, "catalogo"))}">VOLVER AL CATALOGO</a>
          <figure class="store-product-page-media">
            ${renderProductImage(product, productPageRenderContext)}
          </figure>
        </div>
        <div class="store-product-page-copy">
          <p class="store-kicker">${escapeHtml(productMeta.toUpperCase())}</p>
          <h1>${escapeHtml(product.titulo)}</h1>
          <p>${escapeHtml(product.desc)}</p>
          <ul class="store-product-page-points">
            ${productChips.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
          <div class="store-product-price-panel">
            <span>precio</span>
            <strong>${escapeHtml(product.precio)}</strong>
          </div>
          <div class="store-product-page-actions">
            <button class="store-button-primary store-product-buy-button" type="button" data-cart-add="${escapeAttribute(storeProductSlug(product))}">agregar al carrito</button>
            <button class="store-button-secondary" type="button" data-cart-open>ver carrito</button>
          </div>
          <p class="store-product-buy-note">El carrito guarda tu seleccion. Si el precio no esta configurado, Nuvia lo toma como cotizacion antes de cerrar la compra.</p>
          ${renderProductAccordions(product)}
        </div>
      </section>

      <footer class="store-footer" id="contacto">
        <div>
          <strong>${escapeHtml(client.nombre)}</strong>
          <p>${escapeHtml(client.seo.description)}</p>
          ${renderContactStatus(client)}
        </div>
        <div class="store-footer-links">
          <a href="${escapeAttribute(homeHref(productPageRenderContext))}">inicio</a>
          <a href="${escapeAttribute(sectionHref(productPageRenderContext, "catalogo"))}">catalogo</a>
          ${client.contacto.whatsapp ? `<a href="${escapeAttribute(getStoreActionHref(client, product, productPageRenderContext))}">whatsapp</a>` : ""}
        </div>
      </footer>
      ${renderStoreCart(client, client.productos.length ? client.productos : fallbackProducts(client), productPageRenderContext)}
    </main>
  `;
}

function renderStoreScripts(client: StoreClient, products: StoreProduct[], context: StoreRenderContext): string {
  return `${renderStoreCartDataScript(products, context)}
${renderStoreRevealScript()}
${renderStoreCartScript(client)}`;
}

function renderStoreCart(client: StoreClient, products: StoreProduct[], context: StoreRenderContext): string {
  const hasPricedProducts = products.some((product) => typeof product.precioValor === "number");
  const checkoutLabel = hasPricedProducts ? "continuar compra" : "cotizar pedido";

  return `
      <div class="store-cart-shell" data-cart-shell aria-hidden="true">
        <button class="store-cart-backdrop" type="button" data-cart-close aria-label="Cerrar carrito"></button>
        <aside class="store-cart-panel" role="dialog" aria-modal="true" aria-labelledby="store-cart-title" tabindex="-1" data-cart-panel>
          <header class="store-cart-header">
            <div>
              <span>${escapeHtml(client.nombre)}</span>
              <h2 id="store-cart-title">tu carrito</h2>
            </div>
            <button type="button" data-cart-close aria-label="Cerrar carrito">cerrar</button>
          </header>
          <div class="store-cart-empty" data-cart-empty>
            <strong>todavia no agregaste productos</strong>
            <p>Elige productos del catalogo y arma tu pedido antes de cotizar.</p>
          </div>
          <div class="store-cart-items" data-cart-items></div>
          <footer class="store-cart-footer">
            <div class="store-cart-total">
              <span data-cart-total-label>${hasPricedProducts ? "subtotal" : "subtotal pendiente"}</span>
              <strong data-cart-total>${hasPricedProducts ? "Bs. 0" : "cotizacion"}</strong>
            </div>
            <a class="store-cart-checkout" href="${escapeAttribute(getStoreActionHref(client, undefined, context))}" data-cart-checkout>${escapeHtml(checkoutLabel)}</a>
            <button class="store-cart-clear" type="button" data-cart-clear>vaciar carrito</button>
            <p data-cart-note>${escapeHtml(getCartNote(client, hasPricedProducts))}</p>
          </footer>
        </aside>
      </div>
  `;
}

function renderStoreCartDataScript(products: StoreProduct[], context: StoreRenderContext): string {
  const cartProducts = products.map((product) => ({
    id: storeProductSlug(product),
    title: product.titulo,
    brand: product.marca || product.categoria,
    size: product.tamano,
    category: product.categoria,
    use: product.uso,
    priceLabel: product.precio || "Consultar precio",
    priceValue: typeof product.precioValor === "number" ? product.precioValor : null,
    currency: product.moneda || "BOB",
    image: product.imagen ? resolveAssetPath(product.imagen, context) : "",
    imageAlt: product.imagenAlt || product.titulo,
    href: productPageHref(product, context),
  }));

  return `<script type="application/json" id="store-cart-data">${escapeScriptJson(JSON.stringify(cartProducts))}</script>`;
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

function renderStoreCartScript(client: StoreClient): string {
  const config = getCartContactConfig(client);

  return `<script>
(() => {
  const dataNode = document.getElementById("store-cart-data");
  const shell = document.querySelector("[data-cart-shell]");
  const panel = document.querySelector("[data-cart-panel]");
  const itemsNode = document.querySelector("[data-cart-items]");
  const emptyNode = document.querySelector("[data-cart-empty]");
  const countNodes = document.querySelectorAll("[data-cart-count]");
  const totalNode = document.querySelector("[data-cart-total]");
  const totalLabelNode = document.querySelector("[data-cart-total-label]");
  const checkoutNode = document.querySelector("[data-cart-checkout]");
  const noteNode = document.querySelector("[data-cart-note]");
  const clearNode = document.querySelector("[data-cart-clear]");
  const products = dataNode ? JSON.parse(dataNode.textContent || "[]") : [];
  const productMap = new Map(products.map((product) => [product.id, product]));
  const config = ${escapeScriptJson(JSON.stringify(config))};
  const storageKey = config.storageKey || "store-cart-v1";

  if (!shell || !panel || !itemsNode || !products.length) {
    return;
  }

  const money = (value, currency) => {
    if (currency === "BOB") {
      return "Bs. " + Number(value).toFixed(0);
    }

    return new Intl.NumberFormat("es", { style: "currency", currency: currency || "USD" }).format(Number(value));
  };

  const read = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed)
        ? parsed.filter((item) => productMap.has(item.id)).map((item) => ({ id: item.id, qty: Math.max(1, Number(item.qty) || 1) }))
        : [];
    } catch {
      return [];
    }
  };

  let cart = read();

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  };

  const countItems = () => cart.reduce((total, item) => total + item.qty, 0);

  const buildMessage = () => {
    const lines = cart.map((item) => {
      const product = productMap.get(item.id);
      return "- " + item.qty + " x " + product.title + " (" + product.brand + (product.size ? ", " + product.size : "") + ") - " + product.priceLabel;
    });

    return "Hola Nuvia, quiero cotizar este pedido:\\n" + lines.join("\\n") + "\\n\\nPor favor confirmame disponibilidad, precio final y forma de entrega.";
  };

  const checkoutHref = () => {
    if (!cart.length) {
      return "#catalogo";
    }

    const message = encodeURIComponent(buildMessage());

    if (config.mode === "whatsapp") {
      const separator = config.target.includes("?") ? "&" : "?";
      return config.target + separator + "text=" + message;
    }

    if (config.mode === "email") {
      return config.target + "?subject=" + encodeURIComponent("Pedido Nuvia") + "&body=" + message;
    }

    return "#contacto";
  };

  const render = () => {
    const totalCount = countItems();
    const priced = cart.every((item) => typeof productMap.get(item.id)?.priceValue === "number");
    const total = cart.reduce((sum, item) => {
      const product = productMap.get(item.id);
      return sum + (typeof product.priceValue === "number" ? product.priceValue * item.qty : 0);
    }, 0);

    countNodes.forEach((node) => {
      node.textContent = String(totalCount);
      node.toggleAttribute("hidden", totalCount === 0);
    });

    emptyNode.hidden = totalCount > 0;
    itemsNode.hidden = totalCount === 0;
    clearNode.hidden = totalCount === 0;

    if (totalLabelNode) {
      totalLabelNode.textContent = priced && totalCount ? "subtotal" : "subtotal pendiente";
    }

    if (totalNode) {
      totalNode.textContent = priced && totalCount ? money(total, "BOB") : "cotizacion";
    }

    if (checkoutNode) {
      checkoutNode.href = checkoutHref();
      checkoutNode.textContent = priced && totalCount ? "continuar compra" : "cotizar pedido";
      checkoutNode.setAttribute("aria-disabled", totalCount ? "false" : "true");
    }

    if (noteNode) {
      noteNode.textContent = totalCount
        ? config.note
        : "Agrega productos para preparar el pedido.";
    }

    itemsNode.innerHTML = cart.map((item) => {
      const product = productMap.get(item.id);
      const itemTotal = typeof product.priceValue === "number" ? money(product.priceValue * item.qty, product.currency) : product.priceLabel;

      return \`
        <article class="store-cart-item" data-cart-item="\${product.id}">
          <img src="\${product.image}" alt="\${product.imageAlt}" loading="lazy">
          <div>
            <span>\${product.brand}\${product.size ? " - " + product.size : ""}</span>
            <strong>\${product.title}</strong>
            <small>\${itemTotal}</small>
            <div class="store-cart-qty" aria-label="Cantidad">
              <button type="button" data-cart-decrease="\${product.id}" aria-label="Restar \${product.title}">-</button>
              <output>\${item.qty}</output>
              <button type="button" data-cart-increase="\${product.id}" aria-label="Sumar \${product.title}">+</button>
              <button type="button" data-cart-remove="\${product.id}">quitar</button>
            </div>
          </div>
        </article>
      \`;
    }).join("");
  };

  const open = () => {
    shell.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("store-cart-open");
    panel.focus();
  };

  const close = () => {
    shell.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("store-cart-open");
  };

  const add = (id) => {
    if (!productMap.has(id)) {
      return;
    }

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }

    save();
    render();
    open();
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cart-add], [data-cart-open], [data-cart-close], [data-cart-clear], [data-cart-increase], [data-cart-decrease], [data-cart-remove]");

    if (!target) {
      return;
    }

    if (target.matches("[data-cart-add]")) {
      add(target.getAttribute("data-cart-add"));
      return;
    }

    if (target.matches("[data-cart-open]")) {
      open();
      return;
    }

    if (target.matches("[data-cart-close]")) {
      close();
      return;
    }

    if (target.matches("[data-cart-clear]")) {
      cart = [];
      save();
      render();
      return;
    }

    const id = target.getAttribute("data-cart-increase") || target.getAttribute("data-cart-decrease") || target.getAttribute("data-cart-remove");
    const item = cart.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    if (target.matches("[data-cart-increase]")) {
      item.qty += 1;
    }

    if (target.matches("[data-cart-decrease]")) {
      item.qty -= 1;
    }

    if (target.matches("[data-cart-remove]") || item.qty <= 0) {
      cart = cart.filter((entry) => entry.id !== id);
    }

    save();
    render();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });

  render();
})();
</script>`;
}

function renderStoreHeader(client: StoreClient, slogan: string, context: StoreRenderContext): string {
  const navLinks = context.rootHref
    ? [
        { href: homeHref(context), label: "INICIO" },
        { href: sectionHref(context, "catalogo"), label: "PRODUCTOS" },
      ]
    : [
        { href: sectionHref(context, "catalogo"), label: "PRODUCTOS" },
        { href: sectionHref(context, "guia"), label: "GUIA" },
        { href: sectionHref(context, "descuentos"), label: "DESCUENTOS" },
        { href: sectionHref(context, "faq"), label: "FAQ" },
      ];

  return `
      <header class="store-header" aria-label="Principal">
        <a class="store-wordmark" href="${escapeAttribute(homeHref(context))}" aria-label="${escapeAttribute(client.nombre)}">
          ${renderBrandMark(client, context)}
          <span class="store-wordmark-copy">
            <strong>${escapeHtml(client.nombre.toUpperCase())}</strong>
            <small>${escapeHtml(slogan.toUpperCase())}</small>
          </span>
        </a>
        <nav class="store-nav" aria-label="Secciones">
          ${navLinks.map((link) => `<a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`).join("")}
        </nav>
        <button class="store-header-cta store-cart-button" type="button" data-cart-open aria-label="Abrir carrito">
          <span>COMPRAR</span>
          <strong data-cart-count>0</strong>
        </button>
      </header>
  `;
}

function homeHref(context: StoreRenderContext): string {
  return context.rootHref ? `${context.rootHref}index.html` : "#top";
}

function sectionHref(context: StoreRenderContext, section: string): string {
  return context.rootHref ? `${context.rootHref}index.html#${section}` : `#${section}`;
}

function productPageHref(product: StoreProduct, context: StoreRenderContext): string {
  const slug = storeProductSlug(product);

  return context.rootHref ? `../${slug}/` : `productos/${slug}/`;
}

function resolveAssetPath(src: string, context: StoreRenderContext): string {
  if (!src || /^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("#")) {
    return src;
  }

  return `${context.assetPrefix}${src}`;
}

function renderBrandMark(client: StoreClient, context: StoreRenderContext): string {
  const logo = client.logo.trim() || client.nombre.slice(0, 2).toUpperCase();

  if (client.logoIcon) {
    return `<span class="store-brand-mark has-image"><img src="${escapeAttribute(resolveAssetPath(client.logoIcon, context))}" alt=""></span>`;
  }

  return `<span class="store-brand-mark">${escapeHtml(logo.slice(0, 2).toUpperCase())}</span>`;
}

function getUniqueValues(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, 6);
}

function renderBuyingStep(index: string, title: string, description: string): string {
  return `
    <article class="store-guide-step">
      <span>${escapeHtml(index)}</span>
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
      </div>
    </article>
  `;
}

function renderStageProduct(product: StoreProduct, index: number, context: StoreRenderContext): string {
  const image = renderProductImage(product, context);

  return `
    <a class="store-stage-card is-${index + 1}" href="${escapeAttribute(productPageHref(product, context))}">
      <figure>${image}</figure>
      <div class="store-stage-meta">
        <span>${escapeHtml(product.marca || product.categoria)}</span>
        <small>${escapeHtml(product.uso || product.etiqueta)}</small>
      </div>
      <strong>${escapeHtml(product.titulo)}</strong>
    </a>
  `;
}

function renderProductCard(product: StoreProduct, index: number, context: StoreRenderContext): string {
  const chips = [...product.idealPara, ...product.beneficios].slice(0, 3);
  const meta = [product.marca, product.tamano].filter(Boolean).join(" - ") || product.categoria;
  const keyIngredients = product.ingredientesClave.slice(0, 3).join(", ");

  return `
    <article class="store-product-card store-reveal" id="${escapeAttribute(productDomId(product))}" data-reveal style="--reveal-index: ${index}">
      <figure>
        <span class="store-product-badge">${escapeHtml(product.etiqueta || product.categoria)}</span>
        ${renderProductImage(product, context)}
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
          <div class="store-product-actions">
            <a href="${escapeAttribute(productPageHref(product, context))}">ver detalle</a>
            <button type="button" data-cart-add="${escapeAttribute(storeProductSlug(product))}">agregar</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getProductPageChips(product: StoreProduct): string[] {
  return getUniqueValues([product.tamano, product.uso, ...product.ingredientesClave.slice(0, 2), ...product.idealPara.slice(0, 1)])
    .slice(0, 5);
}

function renderProductAccordions(product: StoreProduct): string {
  const includes = getProductIncludes(product)
    .filter((item) => !/consulta/i.test(item))
    .slice(0, 4);
  const characteristics = getUniqueValues([...product.beneficios, ...product.idealPara]).slice(0, 6);
  const specs = getProductSpecs(product).filter((spec) => !/precio/i.test(spec.label));
  const ingredients = product.ingredientesClave.slice(0, 6);
  const precautions = [
    "La dermocosmetica no reemplaza una consulta dermatologica.",
    "Si existe irritacion, condicion activa o duda de compatibilidad, consulta a un profesional.",
  ];

  return `
    <div class="store-product-accordions">
      ${renderProductAccordion("Detalles", [
        renderParagraph(product.desc),
        includes.length ? renderSimpleList(includes) : "",
      ])}
      ${renderProductAccordion("Caracteristicas", [
        characteristics.length ? renderSimpleList(characteristics) : "",
        specs.length ? renderSpecList(specs) : "",
      ])}
      ${renderProductAccordion("Indicaciones", [
        renderParagraph(product.modoUso),
        renderParagraph(product.detalleNota),
      ])}
      ${renderProductAccordion("Ingredientes", [
        ingredients.length ? renderSimpleList(ingredients) : renderParagraph("Ingredientes clave pendientes de completar."),
      ])}
      ${renderProductAccordion("Precauciones", [
        renderSimpleList(precautions),
      ])}
    </div>
  `;
}

function renderProductAccordion(title: string, body: string[], open = false): string {
  const content = body.filter(Boolean).join("");

  return `
    <details class="store-product-accordion"${open ? " open" : ""}>
      <summary>${escapeHtml(title)}</summary>
      <div>${content}</div>
    </details>
  `;
}

function renderSimpleList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderParagraph(value: string): string {
  return value ? `<p>${escapeHtml(value)}</p>` : "";
}

function renderSpecList(specs: StoreProductSpec[]): string {
  return `
    <dl>
      ${specs.map((spec) => `<div><dt>${escapeHtml(spec.label)}</dt><dd>${escapeHtml(spec.value)}</dd></div>`).join("")}
    </dl>
  `;
}

function getProductIncludes(product: StoreProduct): string[] {
  if (product.incluye.length) {
    return product.incluye;
  }

  return [
    product.titulo,
    product.tamano ? `Formato ${product.tamano}` : "Formato pendiente",
    product.uso || product.categoria,
    "Consulta de disponibilidad y precio final",
  ];
}

function getProductSpecs(product: StoreProduct): StoreProductSpec[] {
  if (product.especificaciones.length) {
    return product.especificaciones;
  }

  return [
    { label: "Marca", value: product.marca || "Nuvia" },
    { label: "Categoria", value: product.categoria },
    ...(product.tamano ? [{ label: "Tamano", value: product.tamano }] : []),
    ...(product.uso ? [{ label: "Rutina", value: product.uso }] : []),
    { label: "Precio", value: product.precio },
  ];
}

function renderProductImage(product: StoreProduct, context: StoreRenderContext): string {
  if (product.imagen) {
    return `<img src="${escapeAttribute(resolveAssetPath(product.imagen, context))}" alt="${escapeAttribute(product.imagenAlt || product.titulo)}" loading="lazy">`;
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

function getCartNote(client: StoreClient, hasPricedProducts: boolean): string {
  if (client.contacto.whatsapp) {
    return hasPricedProducts
      ? "El pedido se enviara por WhatsApp con productos, cantidades y subtotal."
      : "El pedido se enviara por WhatsApp como cotizacion porque faltan precios finales.";
  }

  if (client.contacto.email) {
    return hasPricedProducts
      ? "El pedido se preparara por email con productos, cantidades y subtotal."
      : "El pedido se preparara por email como cotizacion porque faltan precios finales.";
  }

  return "Checkout pendiente: configura WhatsApp, email o pasarela antes de cobrar pedidos reales.";
}

function getCartContactConfig(client: StoreClient): {
  mode: "whatsapp" | "email" | "pending";
  target: string;
  note: string;
  storageKey: string;
} {
  const baseConfig = {
    storageKey: `${client.slug || slugify(client.nombre)}-cart-v1`,
  };

  if (client.contacto.whatsapp) {
    const whatsapp = client.contacto.whatsapp.trim();

    if (/^\+?\d[\d\s().-]+$/.test(whatsapp)) {
      return {
        ...baseConfig,
        mode: "whatsapp",
        target: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
        note: getCartNote(client, client.productos.some((product) => typeof product.precioValor === "number")),
      };
    }

    return {
      ...baseConfig,
      mode: "whatsapp",
      target: whatsapp,
      note: getCartNote(client, client.productos.some((product) => typeof product.precioValor === "number")),
    };
  }

  if (client.contacto.email) {
    return {
      ...baseConfig,
      mode: "email",
      target: `mailto:${client.contacto.email}`,
      note: getCartNote(client, client.productos.some((product) => typeof product.precioValor === "number")),
    };
  }

  return {
    ...baseConfig,
    mode: "pending",
    target: "#contacto",
    note: getCartNote(client, client.productos.some((product) => typeof product.precioValor === "number")),
  };
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

function getStoreActionHref(client: StoreClient, product: StoreProduct | undefined, context: StoreRenderContext): string {
  const href = getStoreActionUrl(client, product);

  return href === "#contacto" ? sectionHref(context, "contacto") : href;
}

function productDomId(product: StoreProduct): string {
  return `producto-${storeProductSlug(product)}`;
}

export function storeProductSlug(product: StoreProduct): string {
  return slugify(product.titulo);
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
    incluye: [],
    especificaciones: [],
    detalleImagenes: [],
    detalleNota: "",
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
  min-width: 0;
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

button {
  cursor: pointer;
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
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at 14% 18%, rgba(0, 167, 160, 0.1), transparent 28%),
    radial-gradient(circle at 86% 44%, rgba(245, 180, 0, 0.11), transparent 26%),
    linear-gradient(180deg, #f8f9f6 0%, #f5f6f3 54%, #eef1ed 100%);
}

.store-header,
.store-product-page-hero,
.store-section,
.store-guide,
.store-subscribe,
.store-faq,
.store-final,
.store-footer {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}

.store-header {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 30;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  min-height: 96px;
  padding-top: 18px;
  color: #fffdfa;
  background: transparent;
  transform: translateX(-50%);
}

.store-wordmark,
.store-nav,
.store-actions,
.store-footer-links {
  display: flex;
  align-items: center;
}

.store-wordmark {
  gap: 12px;
  width: fit-content;
  color: #fffdfa;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0;
}

.store-wordmark-copy {
  display: grid;
  gap: 2px;
  line-height: 1;
}

.store-wordmark-copy strong,
.store-wordmark-copy small {
  display: block;
  letter-spacing: 0;
}

.store-wordmark-copy strong {
  font-size: 1rem;
}

.store-wordmark-copy small {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.54rem;
  font-weight: 650;
}

.store-brand-mark {
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
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
  gap: 4px;
  min-height: 42px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(8, 12, 15, 0.22);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.12);
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
}

.store-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  min-width: 32px;
  padding: 0 10px;
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
  gap: 8px;
  padding: 0 18px;
  letter-spacing: 0;
}

.store-cart-button strong {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  color: var(--nuvia-coral);
  background: #fffdfa;
  font-size: 0.72rem;
  line-height: 1;
}

.store-cart-button strong[hidden] {
  display: none;
}

.store-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  min-height: 100dvh;
  padding: clamp(120px, 14vw, 164px) 0 clamp(72px, 8vw, 108px);
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
  border-color: rgba(255, 255, 255, 0.24);
  background: rgba(8, 12, 15, 0.2);
  backdrop-filter: blur(16px);
  box-shadow: 0 28px 78px rgba(0, 0, 0, 0.2);
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
  letter-spacing: 0;
  text-transform: uppercase;
}

.store-hero h1,
.store-product-page-hero h1,
.store-section-heading h2,
.store-guide h2,
.store-subscribe h2,
.store-faq h2,
.store-final h2 {
  max-width: 780px;
  color: var(--store-ink);
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 0.93;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.store-hero h1 {
  max-width: 720px;
  font-size: clamp(3.2rem, 6vw, 5.5rem);
  line-height: 0.92;
}

.store-product-page-hero h1 {
  max-width: 720px;
  color: #fffdfa;
  font-size: clamp(3.2rem, 6.6vw, 6rem);
  line-height: 0.92;
}

.store-hero-copy p:not(.store-kicker),
.store-product-page-copy > p,
.store-section-heading p,
.store-guide-copy p,
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
  justify-self: end;
  align-self: end;
  width: min(100%, 620px);
  margin-bottom: clamp(12px, 5vh, 54px);
  overflow: hidden;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 14px;
  background: rgba(251, 251, 248, 0.48);
  box-shadow: 0 26px 62px rgba(17, 22, 21, 0.1);
  backdrop-filter: blur(18px);
}

.store-stage-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.1);
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
  flex: 1;
  min-width: 0;
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.84);
  font-size: clamp(0.66rem, 1vw, 0.78rem);
}

.store-stage-toolbar small {
  min-height: 24px;
  padding: 5px 10px;
  border-radius: 999px;
  color: #111615;
  background: rgba(245, 180, 0, 0.92);
  font-size: 0.68rem;
  font-weight: 650;
  white-space: nowrap;
}

.store-stage-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 12px;
}

.store-stage-card {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.11);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
}

.store-stage-card figure,
.store-product-card figure {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  background:
    radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.52), rgba(240, 244, 240, 0.18) 64%, transparent 76%);
}

.store-stage-card figure {
  position: relative;
  aspect-ratio: 1 / 0.92;
  min-height: clamp(190px, 21vw, 250px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    radial-gradient(circle at 50% 52%, rgba(255, 255, 255, 0.22), transparent 64%),
    rgba(255, 255, 255, 0.04);
}

.store-stage-card img,
.store-product-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  mix-blend-mode: multiply;
  filter: saturate(1.04) contrast(1.03);
}

.store-stage-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  mix-blend-mode: normal;
  filter: saturate(1.06) contrast(1.05) drop-shadow(0 14px 20px rgba(0, 0, 0, 0.18));
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

.store-stage-card span {
  color: rgba(255, 255, 255, 0.66);
}

.store-stage-meta small {
  color: rgba(0, 230, 218, 0.82);
}

.store-stage-card strong {
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(0.86rem, 1.1vw, 0.98rem);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.08;
}

.store-catalog-tools {
  display: grid;
  grid-template-columns: minmax(110px, 0.45fr) repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: -10px 0 18px;
}

.store-catalog-tools div {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
  min-height: 88px;
  padding: 15px;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 14px;
  background: rgba(251, 251, 248, 0.62);
  box-shadow: 0 14px 34px rgba(17, 22, 21, 0.04);
  backdrop-filter: blur(10px);
}

.store-catalog-tools span {
  color: rgba(15, 45, 82, 0.7);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.store-catalog-tools strong {
  color: var(--nuvia-teal);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 0.86;
}

.store-catalog-tools p {
  color: var(--store-ink);
  font-size: 0.92rem;
  font-weight: 620;
  line-height: 1.2;
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
.store-guide h2,
.store-subscribe h2,
.store-faq h2,
.store-final h2 {
  font-size: clamp(2.6rem, 5.8vw, 5.4rem);
  letter-spacing: 0;
}

.store-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 14px;
}

.store-product-card {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 16px;
  background: rgba(251, 251, 248, 0.7);
  box-shadow: 0 18px 44px rgba(17, 22, 21, 0.05);
  backdrop-filter: blur(10px);
}

.store-product-card figure {
  position: relative;
  min-height: 260px;
  aspect-ratio: 1.08 / 0.9;
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
  align-content: start;
  gap: 12px;
  padding: clamp(18px, 2.5vw, 26px);
}

.store-product-body h3 {
  color: var(--store-ink);
  font-size: clamp(1.35rem, 2.1vw, 2rem);
  font-weight: 520;
  letter-spacing: 0;
  line-height: 1.02;
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

.store-product-actions,
.store-product-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.store-product-actions a,
.store-product-actions button,
.store-product-footer a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  color: #fffdfa;
  background: var(--nuvia-navy);
  font-size: 0.78rem;
  font-weight: 650;
}

.store-product-actions button {
  background: var(--nuvia-coral);
}

.store-product-actions a {
  color: var(--store-ink);
  background: rgba(17, 22, 21, 0.08);
}

.store-product-page {
  background:
    linear-gradient(180deg, #ffffff 0%, #f5fbff 24%, #d8f2ff 58%, #f8faf6 100%);
}

.store-product-page .store-header {
  color: var(--store-ink);
}

.store-product-page .store-wordmark {
  color: var(--store-ink);
}

.store-product-page .store-wordmark-copy small {
  color: rgba(17, 22, 21, 0.58);
}

.store-product-page .store-nav {
  border-color: rgba(17, 22, 21, 0.12);
  color: rgba(17, 22, 21, 0.72);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 12px 34px rgba(17, 22, 21, 0.06);
}

.store-product-page-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.78fr);
  gap: clamp(28px, 6vw, 76px);
  align-items: start;
  min-height: min(860px, 100dvh);
  padding: clamp(128px, 13vw, 156px) 0 clamp(52px, 7vw, 82px);
  color: var(--store-ink);
}

.store-product-page-visual {
  position: sticky;
  top: 118px;
  display: grid;
  gap: 18px;
  min-width: 0;
}

.store-product-page-copy {
  display: grid;
  align-content: start;
  gap: 14px;
  min-width: 0;
}

.store-product-page .store-product-page-hero h1 {
  max-width: 560px;
  color: var(--store-ink);
  font-size: clamp(2.1rem, 3.1vw, 3rem);
  font-weight: 560;
  line-height: 1.04;
}

.store-product-page-copy .store-kicker,
.store-product-page-copy > p {
  color: rgba(17, 22, 21, 0.64);
}

.store-product-back {
  width: fit-content;
  color: rgba(17, 22, 21, 0.58);
  font-size: 0.68rem;
  font-weight: 760;
  letter-spacing: 0;
}

.store-product-page-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 2px 0 0;
  list-style: none;
}

.store-product-page-points li {
  min-height: 32px;
  padding: 7px 11px;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 999px;
  color: rgba(17, 22, 21, 0.74);
  background: rgba(255, 255, 255, 0.74);
  font-size: 0.78rem;
  font-weight: 620;
}

.store-product-page-media {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  min-height: clamp(500px, 56vw, 680px);
  border: 1px solid rgba(15, 45, 82, 0.06);
  border-radius: 18px;
  background:
    radial-gradient(circle at 52% 42%, rgba(255, 255, 255, 0.9), rgba(219, 244, 252, 0.74) 56%, rgba(184, 229, 245, 0.62));
  box-shadow: 0 28px 70px rgba(15, 45, 82, 0.08);
}

.store-product-page-media::after {
  position: absolute;
  inset: -40%;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.42) 50%, transparent 62%);
  content: "";
  opacity: 0;
  transform: translate3d(-42%, 0, 0) rotate(10deg);
}

.store-product-page-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: clamp(38px, 7vw, 92px);
  transform-origin: 50% 70%;
}

.store-product-price-panel {
  display: grid;
  gap: 4px;
  margin-top: 6px;
  padding-top: 16px;
  border-top: 1px solid rgba(17, 22, 21, 0.14);
}

.store-product-price-panel span {
  color: rgba(17, 22, 21, 0.5);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.store-product-price-panel strong {
  color: var(--store-ink);
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  font-weight: 600;
  letter-spacing: 0;
}

.store-product-buy-button {
  width: min(100%, 360px);
  margin-top: 4px;
  background: var(--store-ink);
}

.store-product-page-actions {
  margin-top: 4px;
}

.store-product-buy-note {
  max-width: 520px;
  color: rgba(17, 22, 21, 0.56) !important;
  font-size: 0.86rem;
  line-height: 1.42;
}

.store-product-accordions {
  display: grid;
  gap: 0;
  margin-top: 14px;
  border-top: 1px solid rgba(17, 22, 21, 0.18);
}

.store-product-accordion {
  border-bottom: 1px solid rgba(17, 22, 21, 0.18);
}

.store-product-accordion summary {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 0;
  cursor: pointer;
  color: var(--store-ink);
  font-size: 1rem;
  font-weight: 560;
  list-style: none;
}

.store-product-accordion summary::-webkit-details-marker {
  display: none;
}

.store-product-accordion summary::after {
  content: "+";
  font-weight: 500;
}

.store-product-accordion[open] summary::after {
  content: "-";
}

.store-product-accordion div {
  display: grid;
  gap: 10px;
  padding: 0 0 18px;
  color: rgba(17, 22, 21, 0.64);
  line-height: 1.5;
}

.store-product-accordion ul,
.store-product-accordion dl {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.store-product-accordion li {
  color: rgba(17, 22, 21, 0.64);
}

.store-product-accordion dl div {
  display: grid;
  grid-template-columns: minmax(96px, 0.38fr) minmax(0, 1fr);
  gap: 10px;
  padding: 0;
}

.store-product-accordion dt {
  color: rgba(15, 45, 82, 0.66);
  font-size: 0.76rem;
  font-weight: 760;
  text-transform: uppercase;
}

.store-product-accordion dd {
  margin: 0;
  color: rgba(17, 22, 21, 0.7);
  font-weight: 560;
}


.store-guide {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
  gap: clamp(26px, 6vw, 80px);
  padding: clamp(78px, 10vw, 122px) 0 0;
}

.store-guide-copy {
  display: grid;
  align-content: start;
  gap: 14px;
}

.store-guide-list {
  display: grid;
  gap: 12px;
}

.store-guide-step {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  min-height: 118px;
  padding: 18px;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 14px;
  background: rgba(251, 251, 248, 0.72);
}

.store-guide-step > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  color: #fffdfa;
  background: var(--nuvia-navy);
  font-size: 0.86rem;
  font-weight: 650;
}

.store-guide-step h3 {
  color: var(--store-ink);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.store-guide-step p {
  margin-top: 6px;
  color: rgba(17, 22, 21, 0.58);
  line-height: 1.52;
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

.store-subscribe > * {
  min-width: 0;
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
  min-width: 0;
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

.store-cart-shell {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
  visibility: hidden;
}

.store-cart-open {
  overflow: hidden;
}

.store-cart-shell[aria-hidden="false"] {
  pointer-events: auto;
  visibility: visible;
}

.store-cart-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(8, 12, 15, 0.48);
  opacity: 0;
  transition: opacity 220ms var(--ease-store);
}

.store-cart-shell[aria-hidden="false"] .store-cart-backdrop {
  opacity: 1;
}

.store-cart-panel {
  position: absolute;
  top: 14px;
  right: 14px;
  bottom: 14px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(430px, calc(100vw - 28px));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 247, 0.92)),
    radial-gradient(circle at 18% 12%, rgba(0, 167, 160, 0.1), transparent 28%);
  box-shadow: 0 28px 90px rgba(8, 12, 15, 0.28);
  color: var(--store-ink);
  transform: translate3d(18px, 0, 0);
  opacity: 0;
  transition:
    opacity 240ms var(--ease-store),
    transform 260ms var(--ease-store);
}

.store-cart-shell[aria-hidden="false"] .store-cart-panel {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.store-cart-header,
.store-cart-footer {
  padding: 18px;
}

.store-cart-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid rgba(17, 22, 21, 0.1);
}

.store-cart-header span {
  color: var(--nuvia-teal);
  font-size: 0.72rem;
  font-weight: 720;
  text-transform: uppercase;
}

.store-cart-header h2 {
  margin-top: 4px;
  color: var(--store-ink);
  font-size: clamp(2rem, 8vw, 3.2rem);
  font-weight: 540;
  line-height: 0.92;
}

.store-cart-header button,
.store-cart-clear {
  min-height: 34px;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 999px;
  color: rgba(17, 22, 21, 0.68);
  background: rgba(255, 255, 255, 0.58);
  font-size: 0.76rem;
  font-weight: 650;
}

.store-cart-header button {
  padding: 0 12px;
}

.store-cart-empty,
.store-cart-items {
  min-height: 0;
  overflow: auto;
  padding: 18px;
}

.store-cart-empty {
  display: grid;
  align-content: center;
  gap: 8px;
  text-align: center;
}

.store-cart-empty strong {
  color: var(--store-ink);
  font-size: 1.2rem;
}

.store-cart-empty p,
.store-cart-footer p {
  color: rgba(17, 22, 21, 0.58);
  line-height: 1.42;
}

.store-cart-items {
  display: grid;
  align-content: start;
  gap: 10px;
}

.store-cart-item {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(17, 22, 21, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.68);
}

.store-cart-item img {
  width: 88px;
  height: 96px;
  object-fit: contain;
  border-radius: 10px;
  background:
    radial-gradient(circle at 50% 48%, rgba(0, 167, 160, 0.08), transparent 66%),
    rgba(255, 255, 255, 0.58);
}

.store-cart-item div {
  min-width: 0;
}

.store-cart-item span,
.store-cart-item small {
  display: block;
  color: rgba(17, 22, 21, 0.56);
  font-size: 0.74rem;
  font-weight: 650;
}

.store-cart-item strong {
  display: block;
  margin: 4px 0;
  color: var(--store-ink);
  font-size: 0.95rem;
  line-height: 1.14;
}

.store-cart-qty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.store-cart-qty button,
.store-cart-qty output {
  display: grid;
  place-items: center;
  min-width: 32px;
  height: 32px;
  border: 1px solid rgba(17, 22, 21, 0.1);
  border-radius: 999px;
  color: var(--store-ink);
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 680;
}

.store-cart-qty button:last-child {
  width: auto;
  padding: 0 10px;
  color: rgba(17, 22, 21, 0.62);
}

.store-cart-footer {
  display: grid;
  gap: 10px;
  border-top: 1px solid rgba(17, 22, 21, 0.1);
  background: rgba(255, 255, 255, 0.42);
}

.store-cart-total {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
}

.store-cart-total span {
  color: rgba(17, 22, 21, 0.58);
  font-size: 0.72rem;
  font-weight: 720;
  text-transform: uppercase;
}

.store-cart-total strong {
  color: var(--store-ink);
  font-size: 1.5rem;
  font-weight: 560;
}

.store-cart-checkout {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  border-radius: 999px;
  color: #fffdfa;
  background: var(--nuvia-coral);
  font-weight: 700;
}

.store-cart-checkout[aria-disabled="true"] {
  opacity: 0.55;
  pointer-events: none;
}

.store-cart-clear {
  justify-self: start;
  padding: 0 12px;
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

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-copy > * {
  animation: storeProductSlideIn 620ms var(--ease-store) both;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-copy > *:nth-child(2) {
  animation-delay: 40ms;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-copy > *:nth-child(3) {
  animation-delay: 90ms;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-copy > *:nth-child(4) {
  animation-delay: 140ms;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-copy > *:nth-child(5) {
  animation-delay: 190ms;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-media {
  animation: storeProductMediaIn 760ms var(--ease-store) 110ms both;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-media::after {
  animation: storeProductSheen 1080ms var(--ease-store) 420ms both;
}

.store-motion-ready .store-product-page-hero.is-visible .store-product-page-media img {
  animation: storeProductFloat 6200ms ease-in-out 980ms infinite;
}

@keyframes storeProductSlideIn {
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    filter: blur(5px);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
}

@keyframes storeProductMediaIn {
  from {
    opacity: 0;
    transform: translate3d(0, 24px, 0) scale(0.96);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@keyframes storeProductSheen {
  0% {
    opacity: 0;
    transform: translate3d(-42%, 0, 0) rotate(10deg);
  }

  18% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: translate3d(42%, 0, 0) rotate(10deg);
  }
}

@keyframes storeProductFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(0, -8px, 0) scale(1.012);
  }
}

@media (hover: hover) and (pointer: fine) {
  .store-header-cta,
  .store-button-primary,
  .store-button-secondary,
  .store-product-footer a,
  .store-product-actions button,
  .store-cart-checkout,
  .store-cart-clear,
  .store-cart-qty button,
  .store-stage-card,
  .store-product-card,
  .store-guide-step,
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
  .store-product-actions button:hover,
  .store-cart-checkout:hover,
  .store-subscribe-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(255, 107, 107, 0.22);
  }

  .store-button-secondary:hover,
  .store-stage-card:hover,
  .store-product-card:hover,
  .store-guide-step:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 167, 160, 0.24);
  }

  .store-product-card:hover img {
    transform: scale(1.035);
  }

  .store-stage-card img,
  .store-product-card img {
    transition: transform 260ms var(--ease-store);
  }

  .store-header-cta:active,
  .store-button-primary:active,
  .store-button-secondary:active,
  .store-product-footer a:active,
  .store-product-actions button:active,
  .store-cart-checkout:active,
  .store-cart-clear:active,
  .store-cart-qty button:active,
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
  .store-product-page-hero,
  .store-guide,
  .store-subscribe,
  .store-faq,
  .store-final,
  .store-footer {
    grid-template-columns: 1fr;
  }

  .store-hero {
    min-height: auto;
    padding-top: 112px;
  }

  .store-hero-inner {
    min-height: auto;
  }

  .store-product-page-hero {
    min-height: auto;
  }

  .store-product-page-visual {
    position: static;
  }

  .store-final {
    align-items: start;
  }

  .store-catalog-tools {
    grid-template-columns: 1fr;
  }

  .store-product-card {
    grid-template-columns: 1fr;
  }

  .store-product-card figure {
    min-height: 260px;
  }

  .store-footer-links {
    justify-content: flex-start;
  }
}

@media (max-width: 680px) {
  .store-header,
  .store-hero-inner,
  .store-product-page-hero,
  .store-section,
  .store-guide,
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

  .store-wordmark {
    gap: 9px;
  }

  .store-brand-mark {
    width: 36px;
    height: 36px;
  }

  .store-wordmark-copy strong {
    font-size: 0.86rem;
  }

  .store-wordmark-copy small {
    display: none;
  }

  .store-hero h1 {
    font-size: clamp(2.8rem, 14vw, 4.2rem);
  }

  .store-product-page-hero {
    padding: 112px 16px 30px;
    border-radius: 0 0 14px 14px;
  }

  .store-product-page-hero h1 {
    font-size: clamp(2.25rem, 10vw, 3.1rem);
    line-height: 1.03;
  }

  .store-product-page-media {
    min-height: 320px;
  }

  .store-section-heading h2,
  .store-guide h2,
  .store-subscribe h2,
  .store-faq h2,
  .store-final h2 {
    font-size: clamp(2.65rem, 13vw, 4.2rem);
  }

  .store-stage-grid,
  .store-product-grid {
    grid-template-columns: 1fr;
  }

  .store-stage-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 10px;
  }

  .store-stage-toolbar {
    gap: 6px;
    min-height: 44px;
    padding: 0 10px;
  }

  .store-stage-toolbar span {
    width: 8px;
    height: 8px;
  }

  .store-stage-toolbar strong {
    font-size: 0.62rem;
  }

  .store-stage-toolbar small {
    padding: 4px 7px;
    font-size: 0.58rem;
  }

  .store-stage-card {
    gap: 7px;
    padding: 8px;
  }

  .store-stage-card figure {
    min-height: clamp(132px, 36vw, 178px);
  }

  .store-stage-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .store-stage-meta small {
    white-space: normal;
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

  .store-product-footer,
  .store-product-actions,
  .store-product-page-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .store-product-actions a,
  .store-product-actions button {
    width: 100%;
  }

  .store-guide-step {
    grid-template-columns: 42px minmax(0, 1fr);
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

  .store-cart-panel {
    top: 8px;
    right: 8px;
    bottom: 8px;
    width: calc(100vw - 16px);
    border-radius: 16px;
  }

  .store-cart-item {
    grid-template-columns: 74px minmax(0, 1fr);
  }

  .store-cart-item img {
    width: 74px;
    height: 86px;
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

function escapeScriptJson(value: string): string {
  return value.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
