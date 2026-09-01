/**
 * Links de Google Fonts a partir de la tipografia del cliente.
 *
 * Vivia dentro de `landing-clinic.ts` como funcion local, asi que el resto de
 * los templates no podia usarla. Consecuencia medida en el dashboard
 * (2026-08-30): el CSS pedia "Onest" y el documento NO emitia ningun <link>, de
 * modo que TODO el panel renderizaba en la fuente del sistema — y cada decision
 * tipografica del template era teorica. Extraida aca para que un template nuevo
 * no pueda olvidarse de cargar la fuente que su propio CSS declara.
 */

export type TipografiaCliente = { heading: string; body: string };

/**
 * Rango de peso REAL de cada familia que enviamos, medido contra la API.
 *
 * Antes se pedia `wght@300..900` para TODAS, con el argumento de que si una
 * familia no lo soportaba "muere SOLO ese link". El argumento era falso en la
 * practica: css2 responde **400** a cualquier eje fuera de rango, y el 2026-08-31
 * eso dejaba sin cargar 2 de las 3 familias que W7 eligio para el panel
 * (Bricolage Grotesque llega a 800, Spline Sans Mono a 700). O sea: el titular y
 * las cifras del panel salian en la fuente del sistema — exactamente el bug que
 * W1 habia arreglado, reintroducido por la ruta del rango.
 *
 * Verificado con `curl` familia por familia, no de memoria:
 *   Onest 100..900 · Bricolage Grotesque 200..800 · DM Sans 100..1000 ·
 *   Spline Sans Mono 300..700.
 */
const RANGO_POR_FAMILIA: Readonly<Record<string, string>> = {
  onest: "100..900",
  "bricolage grotesque": "200..800",
  "dm sans": "100..1000",
  "spline sans mono": "300..700",
};

/** Nombre de familia → segmento de la URL (`DM Sans` → `DM+Sans`). */
function familiaUrl(familia: string): string {
  return encodeURIComponent(familia).replace(/%20/g, "+");
}

/**
 * URL de css2 para una familia. Con rango conocido pide la escalera variable
 * completa; sin conocerlo pide la familia PELADA, que responde 200 para
 * cualquier familia del catalogo y trae la regular. Se degrada el rango de
 * pesos, nunca la familia entera.
 */
export function fontHref(familia: string): string {
  const rango = RANGO_POR_FAMILIA[familia.trim().toLowerCase()];
  const eje = rango ? `:wght@${rango}` : "";
  return `https://fonts.googleapis.com/css2?family=${familiaUrl(familia.trim())}${eje}&display=swap`;
}

export function renderFontLinks(tipografia: TipografiaCliente, extras: string[] = []): string {
  const familias = [
    ...new Set(
      [tipografia.heading, tipografia.body, ...extras].map((familia) => familia.trim()).filter(Boolean),
    ),
  ];
  if (familias.length === 0) return "";
  const links = familias
    .map((familia) => `<link rel="stylesheet" href="${fontHref(familia)}">`)
    .join("\n    ");
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${links}`;
}
