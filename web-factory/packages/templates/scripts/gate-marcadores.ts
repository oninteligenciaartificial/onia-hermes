/**
 * Gate de marcadores: mide el diametro RENDERIZADO de cada punto de dato del
 * panel y lo compara contra el piso de 8px que fijo W4.
 *
 * Por que en el navegador y no en el test unitario: el test de `dashboard.test.ts`
 * mira el ATRIBUTO `r`, y el atributo esta en unidades del viewBox, no en pixeles.
 * Los SVG del panel se dibujan con `preserveAspectRatio="xMidYMid meet"` dentro
 * de cajas con `aspect-ratio`, asi que el dibujo se escala con el ancho de su
 * tarjeta: el mismo `r` mide distinto en cada breakpoint. El punto del sparkline
 * del KPI pasaba el test unitario con `r=3` y medIa 5,03px en pantalla — bajo el
 * piso — porque su caja se achica a ~0,84 del viewBox.
 *
 * Se mide sobre el artefacto REAL: llama al mismo `generateSite` que usa la
 * fabrica (y que usa el global-setup de e2e), no a un HTML armado a mano, para
 * que el gate no pueda divergir de lo que se publica.
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { chromium, type Page } from "playwright";

import { generateSite } from "../../../generate/generate";

/** Piso de W4: un punto de dato mas chico que esto no se puede señalar ni tocar. */
const PISO_PX = 8;

const SLUGS = ["dashboard-demo", "dashboard-edge"] as const;
const VIEWPORTS = [
  { nombre: "1440x900", width: 1440, height: 900 },
  { nombre: "390x844", width: 390, height: 844 },
] as const;
const TEMAS = ["light", "dark"] as const;

const rootDir = path.resolve(fileURLToPath(new URL("../../..", import.meta.url)));

/** `diametro` es lo que quedo PINTADO; `declarado` es lo que dice la geometria.
 *  Que difieran es la firma del recorte contra el borde del SVG. */
type Marcador = { svg: string; diametro: number; declarado: number };

/** Los marcadores se eligen por ROL (`data-wf-marker`) y no por forma. Con un
 *  selector de forma (`circle[fill]`) el gate falla ABIERTO: el dia que un punto
 *  se dibuja como trazo en vez de circulo — que es justo el arreglo del punto del
 *  KPI — deja de estar en la lista, nadie lo mide y el gate pasa en verde
 *  midiendo los otros. Por eso ademas se cuenta cuantos hay: ver mas abajo. */
async function medirMarcadores(page: Page): Promise<Marcador[]> {
  return page.evaluate(() => {
    /* Se mide CONTANDO PIXELES PINTADOS, no con getBoundingClientRect(). El
       bounding box de un SVG ignora el trazo cuando lleva
       `vector-effect="non-scaling-stroke"`: sobre el punto del KPI devuelve
       0.008 x 0 px mientras en pantalla hay un disco de 8px perfectamente
       visible. Un gate que le creyera daria ROJO eterno sobre un panel sano —
       la misma familia de falso positivo que ya costo tres dias con el
       rasterizador del canario.

       `elementFromPoint` prueba contra la forma REALMENTE pintada (el area de
       impacto de un trazo es el trazo), asi que sirve para las dos formas y
       ademas es la propiedad que el piso de W4 protege: que al punto se lo
       pueda señalar. Se cuentan pixeles enteros; medir `ultimo - primero` da
       uno de menos (7 en vez de 8) y ese error hunde justo al que cumple. */
    /* Se cuentan PIXELES PINTADOS con `elementFromPoint`, no el bounding box.
       El box declara la geometria aunque el SVG despues RECORTE el dibujo
       contra su borde: midiendo el box, un punto que en pantalla se ve como un
       gajo de 3px se reporta como 8px y el gate da verde sobre el defecto.
       `elementFromPoint` prueba contra lo que quedo realmente pintado, que es
       ademas la propiedad que el piso de W4 protege: que al punto se lo pueda
       señalar. Se cuentan pixeles enteros porque `ultimo - primero` da uno de
       menos y hunde justo al que cumple por poco. */
    const medidas: Marcador[] = [];

    for (const marcador of document.querySelectorAll("svg [data-wf-marker]")) {
      // `elementFromPoint` solo ve la ventana: sin traer el marcador al centro,
      // todo lo que quedo bajo el pliegue mide 0 y el gate inventa un rojo.
      marcador.scrollIntoView({ block: "center", inline: "center" });

      const caja = marcador.getBoundingClientRect();
      const cx = caja.left + caja.width / 2;
      const cy = caja.top + caja.height / 2;

      let ancho = 0;
      let alto = 0;
      for (let paso = -25; paso <= 25; paso += 1) {
        if (document.elementFromPoint(Math.floor(cx) + paso + 0.5, cy) === marcador) ancho += 1;
        if (document.elementFromPoint(cx, Math.floor(cy) + paso + 0.5) === marcador) alto += 1;
      }

      medidas.push({
        svg: marcador.closest("svg")?.getAttribute("class") ?? "(sin clase)",
        diametro: Math.min(ancho, alto),
        declarado: Math.min(caja.width, caja.height),
      });
    }

    return medidas;
  });
}

/** Cuantos marcadores aporta cada SVG, para poder notar que uno dejo de marcarlos. */
function censoPorSvg(marcadores: Marcador[]): Map<string, number> {
  const censo = new Map<string, number>();
  for (const marcador of marcadores) {
    censo.set(marcador.svg, (censo.get(marcador.svg) ?? 0) + 1);
  }
  return censo;
}

async function main(): Promise<void> {
  for (const slug of SLUGS) {
    await generateSite(slug, { rootDir, template: "dashboard" });
  }

  const navegador = await chromium.launch();
  const fallos: string[] = [];
  const peorPorSvg = new Map<string, number>();
  const censoPorPanel = new Map<string, Map<string, number>>();
  let medidos = 0;

  try {
    for (const slug of SLUGS) {
      const url = pathToFileURL(path.join(rootDir, "out", slug, "index.html")).href;

      for (const viewport of VIEWPORTS) {
        for (const tema of TEMAS) {
          const page = await navegador.newPage({
            viewport: { width: viewport.width, height: viewport.height },
          });
          await page.goto(url);
          await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), tema);
          // Con `scroll-behavior: smooth` el scrollIntoView ANIMA y la medicion
          // sale a mitad de camino: el marcador todavia no esta donde se lo mide.
          await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
          // El layout ya esta resuelto; un frame alcanza para que el
          // aspect-ratio de las cajas se aplique antes de medir.
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));

          const marcadores = await medirMarcadores(page);
          const caso = `${slug} ${viewport.nombre} ${tema}`;

          // Un gate de tamaño se satisface BORRANDO lo que mide, asi que el
          // recuento va aparte: el DOM no cambia entre anchos ni temas, de modo
          // que si un caso trae menos marcadores que el primero del panel es que
          // alguien dejo de marcarlos y el resto de las medidas no valen nada.
          const censo = censoPorSvg(marcadores);
          const esperado = censoPorPanel.get(slug);
          if (esperado === undefined) {
            censoPorPanel.set(slug, censo);
            if (!censo.has("wf-kpi-spark")) {
              fallos.push(`${caso}: el sparkline del KPI no expone marcadores (data-wf-marker)`);
            }
          } else {
            for (const [svg, cuantos] of esperado) {
              if ((censo.get(svg) ?? 0) !== cuantos) {
                fallos.push(
                  `${caso}: <${svg}> trae ${censo.get(svg) ?? 0} marcadores y en el primer caso traia ${cuantos}`,
                );
              }
            }
          }

          if (marcadores.length === 0) {
            fallos.push(`${caso}: no se midio NI UN marcador (el selector quedo ciego)`);
          }

          for (const marcador of marcadores) {
            medidos += 1;
            const previo = peorPorSvg.get(marcador.svg);
            if (previo === undefined || marcador.diametro < previo) {
              peorPorSvg.set(marcador.svg, marcador.diametro);
            }
            if (marcador.diametro < PISO_PX) {
              // Se nombra el recorte aparte: "mide 3px" manda a agrandar el
              // punto, y si esta recortado agrandarlo lo empeora.
              const recorte =
                marcador.declarado - marcador.diametro > 1.5
                  ? ` — RECORTADO: la geometria declara ${marcador.declarado.toFixed(2)}px`
                  : "";
              fallos.push(
                `${caso}: <${marcador.svg}> pinta ${marcador.diametro.toFixed(2)}px (piso ${PISO_PX})${recorte}`,
              );
            }
          }

          await page.close();
        }
      }
    }
  } finally {
    await navegador.close();
  }

  console.log(`Marcadores medidos: ${medidos} (${SLUGS.length} paneles x ${VIEWPORTS.length} anchos x ${TEMAS.length} temas)`);
  for (const [svg, peor] of [...peorPorSvg].sort((a, b) => a[1] - b[1])) {
    const marca = peor < PISO_PX ? "✗" : "✓";
    console.log(`  ${marca} ${svg.padEnd(28)} peor diametro ${peor.toFixed(2)}px`);
  }

  // Un gate que no encuentra sujetos tiene que gritar, no aprobar: sin esto
  // basta con renombrar una clase para que quede verde midiendo nada.
  if (medidos === 0) {
    console.error("\n✗ El gate no midio ningun marcador.");
    process.exit(1);
  }

  if (fallos.length > 0) {
    console.error(`\n✗ ${fallos.length} marcador(es) bajo el piso de ${PISO_PX}px:`);
    // Una linea por caso: el peor por SVG esconde en que breakpoint pasa.
    for (const fallo of [...new Set(fallos)]) console.error(`  ${fallo}`);
    process.exit(1);
  }

  console.log(`\n✓ Todos los marcadores llegan al piso de ${PISO_PX}px.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
