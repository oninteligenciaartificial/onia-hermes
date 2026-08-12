/**
 * Test page for the model blocks — renders the REAL block functions (not a
 * hand-kept mirror like motion-demo.html, which desyncs) with ONIA tokens and
 * the motion toolkit wired, so the page is proof the blocks compose and run.
 *
 *   pnpm blocks:demo   ->   out/blocks-demo/index.html
 *
 * Content is deliberately labelled sample copy: this page proves the blocks, it
 * is not a client site and it must never read as one.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { clientTokenCss } from "@onia/tokens";
import {
  BENEFIT_STRIP_CSS,
  EDITORIAL_STATEMENT_CSS,
  FOOTER_BRAND_CSS,
  renderBenefitStrip,
  renderEditorialStatement,
  renderFooterBrand,
  renderMotionScript,
  renderMotionStyles,
} from "./src/index";

const tokens = {
  colores: {
    primary: "#2f4f45",
    secondary: "#1a1a18",
    accent: "#8a8378",
    bg: "#faf8f5",
    fg: "#1a1a18",
  },
  tipografia: { heading: "Onest", body: "Onest" },
};

const page = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Web Factory · bloques del catalogo aprendido</title>
    <style>${clientTokenCss(tokens)}</style>
    <style>${PAGE_CSS()}</style>
    <style>${EDITORIAL_STATEMENT_CSS}</style>
    <style>${BENEFIT_STRIP_CSS}</style>
    <style>${FOOTER_BRAND_CSS}</style>
    ${renderMotionStyles()}
  </head>
  <body>
    <main id="top">
      <header class="demo-head">
        <p class="demo-kicker">Web Factory · packages/blocks</p>
        <h1>Bloques del catalogo aprendido</h1>
        <p class="demo-lede">
          Los tres bloques que mas modelos piden, renderizados por sus funciones reales.
          Texto de muestra etiquetado: esta pagina prueba los bloques, no es un sitio de cliente.
        </p>
      </header>

      <p class="demo-tag">editorial-statement — find-realestate-editorial · lecercle-realestate</p>
      ${renderEditorialStatement({
        label: "el bloque",
        statement: "Una linea reencuadra el rubro y sube el tono de toda la pagina",
        accent: "por el precio de una frase.",
      })}

      <p class="demo-tag">benefit-strip (grid) — unitedcarriers-logistics</p>
      ${renderBenefitStrip({
        label: "beneficios",
        layout: "grid",
        items: [
          { icon: "map-pin", title: "Titulo de muestra", copy: "Copy de muestra: el dato concreto del cliente va aca." },
          { icon: "clock", title: "Titulo de muestra", copy: "Copy de muestra: el dato concreto del cliente va aca." },
          { icon: "shield-check", title: "Titulo de muestra", copy: "Copy de muestra: el dato concreto del cliente va aca." },
        ],
      })}

      <p class="demo-tag">benefit-strip (row, sin icono) — boldflavor-cpg-landing</p>
      ${renderBenefitStrip({
        layout: "row",
        items: [
          { title: "Claim de muestra" },
          { title: "Claim de muestra" },
          { title: "Claim de muestra" },
        ],
      })}

      <p class="demo-tag">footer-brand — find-realestate · unitedcarriers · lecercle</p>
      ${renderFooterBrand({
        brand: "Marca de muestra",
        statement: "Una linea de cierre con lo que hace la marca y donde opera.",
        groups: [
          {
            title: "Navegacion",
            items: [
              { label: "Inicio", url: "#top" },
              { label: "Servicios", url: "#top" },
              { label: "Contacto", url: "#top" },
            ],
          },
          {
            title: "Contacto",
            items: [
              { label: "hola@ejemplo.test", url: "mailto:hola@ejemplo.test" },
              { label: "Direccion de muestra" },
            ],
          },
        ],
        legal: "Linea legal de muestra — el titular y el ano los pone el cliente.",
      })}
    </main>
    ${renderMotionScript()}
  </body>
</html>
`;

function PAGE_CSS(): string {
  return `
    *{box-sizing:border-box}
    body{margin:0;background:var(--color-bg);color:var(--color-fg);font-family:var(--font-body)}
    h1,h2,h3,p{margin:0}
    a{color:inherit;text-decoration:none}
    .demo-head{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:64px 0 8px}
    .demo-kicker{color:var(--color-primary);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .demo-head h1{margin-top:12px;font-family:var(--font-heading);font-size:clamp(2rem,4vw,3rem);line-height:1.02}
    .demo-lede{margin-top:14px;max-width:60ch;color:color-mix(in srgb,var(--color-fg) 68%,var(--color-bg));line-height:1.6}
    .demo-tag{width:min(1120px,calc(100% - 32px));margin:56px auto 0;padding-bottom:6px;border-bottom:1px dashed color-mix(in srgb,var(--color-fg) 22%,transparent);color:color-mix(in srgb,var(--color-fg) 55%,var(--color-bg));font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem}
  `.trim();
}

const outDir = path.join(process.cwd(), "out", "blocks-demo");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "index.html"), page, "utf8");
process.stdout.write(`${path.join(outDir, "index.html")}\n`);
