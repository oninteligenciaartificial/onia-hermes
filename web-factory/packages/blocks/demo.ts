/**
 * Living gallery of the factory's blocks — renders the REAL block functions (not
 * a hand-kept mirror like the old motion-demo.html, which desynced) with ONIA
 * tokens and the motion toolkit wired, so the page is proof the blocks compose
 * and run, and the single place a session can see what already exists.
 *
 *   pnpm blocks:demo   ->   out/blocks-demo/index.html
 *
 * Each block renders inside its own srcdoc frame carrying ONLY the stylesheet it
 * ships with in production. That isolation is the point: pouring landing's bare
 * `h1 {}` rule over the realestate blocks would make this page lie about how they
 * look, and a gallery nobody trusts gets rebuilt from scratch.
 *
 * "Who uses this" and "what is still missing" are computed at build time
 * (gallery.ts) from packages/templates/src and data/references/reels/models,
 * so they cannot rot into a stale inventory.
 *
 * Content is deliberately labelled sample copy: this page proves the blocks, it
 * is not a client site and it must never read as one.
 */
import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderLandingClinicCss,
  renderLandingCss,
  renderLandingRealestateCss,
  type RealestateClient,
} from "@onia/templates";
import { clientTokenCss } from "@onia/tokens";
import {
  FACTORY_ROOT,
  GALLERY,
  modelGaps,
  readModelDemand,
  readTemplateUsage,
  type BlockFamily,
  type GalleryBlock,
} from "./gallery";
import { SAMPLE_CLIENT } from "./sample-client";
import {
  BENEFIT_STRIP_CSS,
  EDITORIAL_STATEMENT_CSS,
  escapeHtml,
  FOOTER_BRAND_CSS,
  INLINE_QUOTE_FORM_CSS,
  MEDIA_HERO_CSS,
  MOTION_PRIMITIVES,
  NEWSLETTER_BAND_CSS,
  PATH_CARDS_CSS,
  PROPERTY_CARDS_CSS,
  renderMotionScript,
  renderMotionStyles,
  SCROLL_STORY_HERO_CSS,
  STAT_STRIP_CSS,
} from "./src/index";

/**
 * Every model block's own stylesheet. The realestate sheet only carries the CSS
 * of the blocks that template composes, so an orphan block (today benefit-strip)
 * would render unstyled here — which is exactly the bug the browser caught. The
 * content check keeps the sheet duplicate-free and self-healing for new blocks.
 */
const MODEL_BLOCK_CSS = [
  MEDIA_HERO_CSS,
  EDITORIAL_STATEMENT_CSS,
  PATH_CARDS_CSS,
  PROPERTY_CARDS_CSS,
  BENEFIT_STRIP_CSS,
  NEWSLETTER_BAND_CSS,
  FOOTER_BRAND_CSS,
  SCROLL_STORY_HERO_CSS,
  STAT_STRIP_CSS,
  INLINE_QUOTE_FORM_CSS,
] as const;

function modelFamilyCss(client: RealestateClient): string {
  const sheet = renderLandingRealestateCss(client);
  const missing = MODEL_BLOCK_CSS.filter((css) => !sheet.includes(css));
  return [sheet, ...missing].join("\n\n");
}

const OUT_DIR = path.join(FACTORY_ROOT, "out", "blocks-demo");

/** Sample assets copied next to the page so the gallery works offline, from file://. */
const SAMPLE_ASSETS: ReadonlyArray<readonly [string, string]> = [
  ["data/clients/realestate-demo.assets/hero-placeholder.svg", "hero-placeholder.svg"],
  ["data/clients/realestate-demo.assets/propiedad-placeholder.svg", "propiedad-placeholder.svg"],
  ["data/clients/dental-demo.assets/hero-consultorio.webp", "hero-consultorio.webp"],
  ["data/clients/dental-demo.assets/detalle-atencion.webp", "detalle-atencion.webp"],
  ["data/clients/logistics-demo.assets/etapa-1-deposito.svg", "etapa-1-deposito.svg"],
  ["data/clients/logistics-demo.assets/etapa-2-ruta.svg", "etapa-2-ruta.svg"],
  ["data/clients/logistics-demo.assets/etapa-3-entrega.svg", "etapa-3-entrega.svg"],
];

type FamilyMeta = {
  title: string;
  blurb: string;
  css: string;
  /** Wrapper the production template puts around these blocks, when it matters. */
  open: string;
  close: string;
};

const REALESTATE_SAMPLE: RealestateClient = {
  ...SAMPLE_CLIENT,
  statement: "",
  statementAccent: "",
  newsletter: { titulo: "", texto: "", accion: "", boton: "", nota: "" },
  productos: [],
  footerLegal: "",
};

const FAMILIES: Record<BlockFamily, FamilyMeta> = {
  base: {
    title: "Bloques base",
    blurb:
      "Se arman desde SiteClient y devuelven \"\" cuando el cliente no tiene ese dato: la composicion es data-driven. Sus estilos los publica la plantilla landing.",
    css: renderLandingCss(SAMPLE_CLIENT),
    open: "",
    close: "",
  },
  clinic: {
    title: "Bloques clinic",
    blurb:
      "Variante editorial para clinica/estetica. Necesitan el envoltorio .wf-clinic-page (de ahi salen --wrap y --ink-accent). El reveal en scroll lo inyecta la plantilla, no el bloque, asi que aca se ven en su estado final.",
    css: renderLandingClinicCss(SAMPLE_CLIENT),
    open: '<main class="wf-clinic-page">',
    close: "</main>",
  },
  model: {
    title: "Bloques de modelo aprendido",
    blurb:
      "Salidos del catalogo de modelos (docs/WEB_FACTORY_LEARNED_MODELS.md). Cada uno publica su propio CSS solo-tokens, asi que una plantilla compone markup y estilos con un solo import.",
    css: modelFamilyCss(REALESTATE_SAMPLE),
    open: '<div class="wf-re">',
    close: "</div>",
  },
};

const FAMILY_ORDER: readonly BlockFamily[] = ["base", "clinic", "model"];

/**
 * Frames are born tall (see .gal-frame) and report the height of their CONTENT —
 * body, not documentElement, whose scrollHeight is clamped to the frame box and
 * would report every short block as 900px tall.
 *
 * Measured once and applied once, on purpose: vh-based blocks (the heroes)
 * resolve against the frame box, so re-measuring after the resize we just caused
 * walks them down to nothing.
 */
const FRAME_HEIGHT_JS = `
(function(){
  var id=document.documentElement.getAttribute('data-wf-frame');
  var send=function(){parent.postMessage({wfFrame:id,h:document.body.scrollHeight},'*');};
  window.addEventListener('load',send);setTimeout(send,600);
})();`.trim();

const PAGE_HEIGHT_JS = `
var wfSized={};
window.addEventListener('message',function(e){
  var d=e.data;if(!d||!d.wfFrame||wfSized[d.wfFrame])return;
  var f=document.getElementById(d.wfFrame);
  if(!f)return;
  wfSized[d.wfFrame]=1;
  f.style.height=Math.max(180,d.h)+'px';
});`.trim();

function frameDocument(block: GalleryBlock): string {
  const family = FAMILIES[block.family];

  return `<!doctype html>
<html lang="es" data-wf-frame="${frameId(block)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>${family.css}</style>
${renderMotionStyles()}
<style>body{overflow-x:hidden}</style>
</head>
<body>${family.open}${block.html}${family.close}${renderMotionScript()}<script>${FRAME_HEIGHT_JS}</script></body>
</html>`;
}

function frameId(block: GalleryBlock): string {
  return `frame-${block.id}`;
}

function blockCard(block: GalleryBlock, templates: readonly string[], models: readonly string[]): string {
  const usage = templates.length
    ? templates.map((id) => `<code>${escapeHtml(id)}</code>`).join(" ")
    : `<span class="gal-orphan">huerfano: ninguna plantilla lo compone</span>`;
  const from = models.length
    ? `<div class="gal-row"><dt>modelos</dt><dd>${models.map((id) => `<code>${escapeHtml(id)}</code>`).join(" ")}</dd></div>`
    : "";

  return `
    <article class="gal-block" id="${escapeHtml(block.id)}">
      <header class="gal-head">
        <h3 class="gal-name">${escapeHtml(block.id)}</h3>
        <p class="gal-note">${escapeHtml(block.note)}</p>
      </header>
      <dl class="gal-meta">
        <div class="gal-row"><dt>archivo</dt><dd><code>${escapeHtml(block.file)}</code></dd></div>
        <div class="gal-row"><dt>props</dt><dd><code>${escapeHtml(block.props)}</code></dd></div>
        <div class="gal-row"><dt>estilos</dt><dd><code>${escapeHtml(block.css)}</code></dd></div>
        <div class="gal-row"><dt>plantillas</dt><dd>${usage}</dd></div>
        ${from}
      </dl>
      <iframe class="gal-frame" id="${frameId(block)}" title="Bloque ${escapeHtml(block.id)}"
              loading="lazy" srcdoc="${escapeHtml(frameDocument(block))}"></iframe>
    </article>
  `;
}

function motionTable(): string {
  const rows = MOTION_PRIMITIVES.map(
    (item) => `<tr>
      <td><code>${escapeHtml(item.class)}</code></td>
      <td>${escapeHtml(item.motionSpec)}</td>
      <td>${escapeHtml(item.trigger)}</td>
    </tr>`,
  ).join("");

  return `
    <section class="gal-section" id="motion" aria-labelledby="motion-h">
      <h2 class="gal-section-title" id="motion-h">Primitivas de movimiento</h2>
      <p class="gal-section-blurb">
        De <code>packages/blocks/src/motion.ts</code> (<code>MOTION_PRIMITIVES</code>), leidas del codigo:
        un bloque se suma al movimiento agregando la clase. Cada primitiva trae su fallback de
        <code>prefers-reduced-motion</code>, y esta pagina lo respeta: con movimiento reducido cada
        bloque se ve en su estado final.
      </p>
      <table class="gal-table">
        <thead><tr><th scope="col">clase</th><th scope="col">movimiento</th><th scope="col">disparo</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function gapsTable(gaps: ReadonlyArray<{ block: string; models: string[] }>): string {
  const rows = gaps.length
    ? gaps
        .map(
          (gap) => `<tr>
            <td><code>${escapeHtml(gap.block)}</code></td>
            <td class="gal-num">${gap.models.length}</td>
            <td>${gap.models.map((id) => `<code>${escapeHtml(id)}</code>`).join(" ")}</td>
          </tr>`,
        )
        .join("")
    : `<tr><td colspan="3">Ningun modelo pide un bloque que falte.</td></tr>`;

  return `
    <section class="gal-section" id="faltan" aria-labelledby="faltan-h">
      <h2 class="gal-section-title" id="faltan-h">Lo que falta construir</h2>
      <p class="gal-section-blurb">
        Calculado al generar la pagina: bloques que los modelos aprendidos piden en
        <code>data/references/reels/models/*.json</code> y todavia no existen, ordenados por cuantos
        modelos desbloquea cada uno. Nada inventado: si ningun modelo lo pide, no esta en la lista.
      </p>
      <table class="gal-table">
        <thead><tr><th scope="col">bloque</th><th scope="col">modelos</th><th scope="col">quien lo pide</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function pageCss(): string {
  return `
*{box-sizing:border-box}
body{margin:0;background:var(--color-bg);color:var(--color-fg);font-family:var(--font-body);line-height:1.6}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.82em}
a{color:inherit}
.gal-wrap{width:min(1180px,calc(100% - 40px));margin:0 auto}
.gal-top{padding:clamp(48px,7vw,88px) 0 0}
/* Brand accent pulled toward the ink so it stays legible in BOTH token scopes:
   a dark --color-primary over the dark surface is only 2.1:1 on its own. */
.gal-ink-accent{color:color-mix(in srgb,var(--color-primary) 60%,var(--color-fg))}
.gal-kicker{margin:0;font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.gal-title{margin:12px 0 0;font-family:var(--font-heading);font-size:clamp(2rem,4.4vw,3.4rem);line-height:1.02;letter-spacing:-.02em}
.gal-lede{margin:16px 0 0;max-width:66ch;color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg))}
.gal-counts{margin:28px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0}
.gal-counts li{padding:0 24px 0 0;margin-right:24px;border-right:1px solid color-mix(in srgb,var(--color-fg) 14%,transparent)}
.gal-counts li:last-child{border-right:0}
.gal-count-n{display:block;font-family:var(--font-heading);font-size:1.9rem;line-height:1;font-variant-numeric:tabular-nums}
.gal-count-l{display:block;margin-top:4px;font-size:.8rem;color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg))}
.gal-toc{margin:32px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:8px}
.gal-toc a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1px solid color-mix(in srgb,var(--color-fg) 16%,transparent);border-radius:999px;font-size:.86rem;text-decoration:none}
.gal-toc a:hover{border-color:var(--color-primary);color:color-mix(in srgb,var(--color-primary) 60%,var(--color-fg))}
.gal-toc a:focus-visible,.gal-name a:focus-visible{outline:2px solid var(--color-primary);outline-offset:3px}
.gal-section{padding:clamp(48px,6vw,80px) 0 0}
.gal-section-title{margin:0;font-family:var(--font-heading);font-size:clamp(1.4rem,2.6vw,2rem);line-height:1.1}
.gal-section-blurb{margin:10px 0 0;max-width:76ch;color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg));font-size:.95rem}
.gal-block{margin-top:40px;padding-top:28px;border-top:1px solid color-mix(in srgb,var(--color-fg) 14%,transparent)}
.gal-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 18px}
.gal-name{margin:0;font-family:var(--font-heading);font-size:1.25rem;letter-spacing:-.01em}
.gal-note{margin:0;flex:1 1 320px;color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg));font-size:.92rem}
.gal-meta{margin:16px 0 0;display:grid;gap:2px}
.gal-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;align-items:baseline}
.gal-row dt{color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg));font-size:.76rem;letter-spacing:.06em;text-transform:uppercase}
.gal-row dd{margin:0;min-width:0;font-size:.88rem;overflow-wrap:anywhere}
.gal-orphan{color:color-mix(in srgb,var(--color-primary) 60%,var(--color-fg));font-weight:700}
.gal-frame{display:block;width:100%;height:900px;margin-top:20px;border:1px solid color-mix(in srgb,var(--color-fg) 14%,transparent);border-radius:10px;background:var(--color-bg)}
.gal-table{margin-top:20px;width:100%;border-collapse:collapse;font-size:.9rem}
.gal-table th,.gal-table td{padding:10px 12px;text-align:left;border-bottom:1px solid color-mix(in srgb,var(--color-fg) 12%,transparent);vertical-align:top}
.gal-table th{color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg));font-size:.76rem;letter-spacing:.06em;text-transform:uppercase}
.gal-num{font-variant-numeric:tabular-nums}
.gal-foot{margin:64px 0;padding-top:20px;border-top:1px solid color-mix(in srgb,var(--color-fg) 14%,transparent);color:color-mix(in srgb,var(--color-fg) 72%,var(--color-bg));font-size:.86rem}
@media (max-width:640px){.gal-row{grid-template-columns:1fr;gap:2px}}
`.trim();
}

async function build(): Promise<string> {
  const usage = await readTemplateUsage();
  const demand = await readModelDemand();
  const gaps = modelGaps(demand);
  const demandByBlock = new Map(demand.map((entry) => [entry.block, entry.models]));

  const orphans = GALLERY.filter((block) => (usage.get(block.fn) ?? []).length === 0);

  const sections = FAMILY_ORDER.map((familyId) => {
    const family = FAMILIES[familyId];
    const blocks = GALLERY.filter((block) => block.family === familyId);

    return `
      <section class="gal-section" id="${familyId}" aria-labelledby="${familyId}-h">
        <h2 class="gal-section-title" id="${familyId}-h">${escapeHtml(family.title)}</h2>
        <p class="gal-section-blurb">${escapeHtml(family.blurb)}</p>
        ${blocks
          .map((block) => blockCard(block, usage.get(block.fn) ?? [], demandByBlock.get(block.id) ?? []))
          .join("")}
      </section>
    `;
  }).join("");

  const toc = [
    ...FAMILY_ORDER.map((id) => ({ id, label: FAMILIES[id].title })),
    { id: "motion", label: "Movimiento" },
    { id: "faltan", label: `Falta construir (${gaps.length})` },
  ]
    .map((item) => `<li><a href="#${item.id}">${escapeHtml(item.label)}</a></li>`)
    .join("");

  const page = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Web Factory · galeria de bloques</title>
    <style>${clientTokenCss(SAMPLE_CLIENT)}</style>
    <style>${pageCss()}</style>
  </head>
  <body>
    <main class="gal-wrap">
      <header class="gal-top">
        <p class="gal-kicker gal-ink-accent">Web Factory · packages/blocks</p>
        <h1 class="gal-title">Galeria de bloques</h1>
        <p class="gal-lede">
          Todo lo que la fabrica puede componer hoy, renderizado por las funciones reales con tokens ONIA
          y el toolkit de movimiento conectado. Cada bloque va en su propio frame con el CSS que lleva en
          produccion. Texto de muestra etiquetado: esta pagina prueba los bloques, no es un sitio de cliente.
        </p>
        <ul class="gal-counts">
          <li><span class="gal-count-n">${GALLERY.length}</span><span class="gal-count-l">bloques</span></li>
          <li><span class="gal-count-n">${orphans.length}</span><span class="gal-count-l">huerfanos</span></li>
          <li><span class="gal-count-n">${MOTION_PRIMITIVES.length}</span><span class="gal-count-l">primitivas de motion</span></li>
          <li><span class="gal-count-n">${gaps.length}</span><span class="gal-count-l">bloques por construir</span></li>
        </ul>
        <ul class="gal-toc">${toc}</ul>
      </header>
      ${sections}
      ${motionTable()}
      ${gapsTable(gaps)}
      <footer class="gal-foot">
        Generado por <code>pnpm blocks:demo</code> (<code>packages/blocks/demo.ts</code> +
        <code>packages/blocks/gallery.ts</code>). Plantillas y huecos se leen del codigo y de
        <code>data/references/reels/models</code> al generar: si agregas un bloque, aparece solo.
      </footer>
    </main>
    <script>${PAGE_HEIGHT_JS}</script>
  </body>
</html>
`;

  await mkdir(path.join(OUT_DIR, "assets"), { recursive: true });
  for (const [source, target] of SAMPLE_ASSETS) {
    await cp(path.join(FACTORY_ROOT, source), path.join(OUT_DIR, "assets", target));
  }

  const file = path.join(OUT_DIR, "index.html");
  await writeFile(file, page, "utf8");

  process.stdout.write(
    `${file}\n${GALLERY.length} bloques · ${orphans.length} huerfanos (${orphans.map((b) => b.id).join(", ") || "-"}) · ${gaps.length} por construir\n`,
  );
  return file;
}

await build();
