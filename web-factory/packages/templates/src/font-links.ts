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

export function renderFontLinks(tipografia: TipografiaCliente): string {
  const familias = [
    ...new Set([tipografia.heading, tipografia.body].map((familia) => familia.trim()).filter(Boolean)),
  ];
  if (familias.length === 0) return "";
  // Un <link> POR familia y rango variable 300..900: los templates piden pesos
  // altos (hero 820) que una escalera estatica 400-700 no trae. Si una familia
  // es solo-estatica, css2 devuelve 400 y muere SOLO ese link — la otra familia
  // y el stack de fallback siguen vivos.
  const links = familias
    .map(
      (familia) =>
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(familia).replace(/%20/g, "+")}:wght@300..900&display=swap">`,
    )
    .join("\n    ");
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${links}`;
}
