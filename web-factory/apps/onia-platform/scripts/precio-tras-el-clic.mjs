#!/usr/bin/env node
/**
 * El precio ANUAL que ve un lead sólo existe DESPUES de un clic. Esto lo mide.
 *
 * POR QUE EXISTE. `precios-vivos.mjs` barre 24 pantallas y cruza cada monto contra la
 * fuente — pero lee el HTML SERVIDO. La banda de precios de la home nace en "Mensual", y
 * el numero grande que decide la compra (320/550/890/1.290) se REEMPLAZA por el anual
 * (3.200/5.500/8.900/12.900) recien cuando alguien aprieta "Anual". Medido el 2026-09-27
 * contra produccion: antes del clic el DOM tiene 320@61px, despues 3.200@61px. Ningun gate
 * del carril apretaba ese boton.
 *
 * Y no es solo el monto: el toggle pinta ADEMAS un equivalente mensual DERIVADO
 * ("Bs 267 por mes") que no esta declarado en ninguna fuente — se calcula. Un derivado sin
 * gate es la forma mas barata de publicar un precio inventado: nadie lo escribio mal, se
 * calculo mal. Si manana `anual/12` se vuelve `anual/10`, el sitio ofrece Bs 320 por mes
 * para el plan Basico y las 24 pantallas de `precios-vivos` siguen en VERDE, porque el
 * numero ofensor no esta en el HTML que ellas leen.
 *
 * ESTO ES EL SEGUNDO TURNO. El primero —la pantalla como llega— ya tiene dueño. El dinero
 * se pierde en el segundo: el estado al que el lead llega apretando algo.
 *
 * COMO NO FALLA EN VERDE:
 *  - Los montos esperados salen del DISCO (`FUENTES_DE_PRECIO`, sin comentarios), no de una
 *    lista escrita aca: cambiar un precio en la fuente mueve el gate solo. Son DOS archivos
 *    y no uno porque el add-on se pinta con el mismo tamaño de letra que un plan (medido:
 *    `390@58px` al lado de `1.290@61px`): un lead no distingue escalera de add-on, ve cinco
 *    numeros grandes. Dejar el add-on afuera hacia que la primera corrida VIVA acusara
 *    `Bs 390` como precio inventado — asi es como un gate nuevo se gana fama de ruidoso y
 *    termina salteado.
 *  - Exige HABER ENCONTRADO el toggle y exige que el clic CAMBIE algo. Un boton que
 *    desaparece, o que deja de responder, es rojo — no "no habia nada que comparar", que
 *    es como esta familia de gates miente.
 *  - No reintenta una RESPUESTA (un 404/429 es el servidor contestando). Si `fetch`/`goto`
 *    RECHAZA, sale 2 = NO MEDIDO: no pudo preguntar, no miente.
 *
 * Uso:
 *   node scripts/precio-tras-el-clic.mjs                       # produccion
 *   node scripts/precio-tras-el-clic.mjs --base=http://127.0.0.1:3987
 *   node scripts/precio-tras-el-clic.mjs --out=/tmp/wv-anual   # deja la captura
 *
 * Sale 0 si el segundo turno es fiel a la fuente, 1 si publica un precio que nadie cobra,
 * y 2 si no pudo medir.
 */
import { mkdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { sinComentarios } from "./monto-en-el-codigo.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

const arg = (nombre, porDefecto) => {
  const hit = process.argv.find((a) => a.startsWith(`--${nombre}=`));
  return hit ? hit.slice(nombre.length + 3) : porDefecto;
};

const base = arg("base", "https://onia.com.bo").replace(/\/$/, "");
const out = arg("out", "/tmp/wv-tras-el-clic");

/**
 * La escalera declarada, leida del espejo de precios de ESTE sitio.
 *
 * Se lee el archivo y no se importa: es TypeScript y esto es un `.mjs` que corre sin
 * compilar. `sinComentarios` es el mismo recorte que usa `precios-vivos.mjs`, y es lo que
 * evita que un `// anual: 9900` de una nota vieja entre como si fuera un precio vigente.
 */
export const FUENTES_DE_PRECIO = [
  join("src", "lib", "pricing.ts"),
  join("src", "content", "chatbot-precios.ts"),
];

export function escaleraDeclarada(
  texto = FUENTES_DE_PRECIO.map((f) => readFileSync(join(APP, f), "utf8")).join("\n"),
) {
  const limpio = sinComentarios(texto);
  const pares = [...limpio.matchAll(/mensual:\s*(\d+)\s*,[\s\S]{0,200}?anual:\s*(\d+)\s*,/g)];
  return pares.map(([, mensual, anual]) => ({
    mensual: Number(mensual),
    anual: Number(anual),
  }));
}

/** Bs 3.200 -> 3200. El sitio separa los miles con punto; la fuente no. */
export const aNumero = (texto) => Number(String(texto).replace(/\./g, "").replace(/,/g, "."));

/**
 * El equivalente mensual que el sitio muestra junto al anual.
 *
 * Es un DERIVADO: no existe en ninguna fuente, se calcula. La unica division que hace
 * honesta la frase "por mes" sobre un total anual es entre 12.
 */
export const porMesDeUnAnual = (anual) => Math.round(anual / 12);

/**
 * El veredicto, puro: recibe lo declarado y lo que se vio en pantalla, devuelve las fallas.
 * Separado del navegador a proposito — asi el test lo ejerce sin abrir produccion.
 */
export function fallasDelSegundoTurno({ declarada, mensualesVistos, anualesVistos, porMesVistos }) {
  const fallas = [];
  const declaradosMensuales = declarada.map((p) => p.mensual);
  const declaradosAnuales = declarada.map((p) => p.anual);

  if (!declarada.length) {
    fallas.push("no encontre NI UN plan declarado en src/lib/pricing.ts: sin sujetos no hay veredicto");
    return fallas;
  }
  if (!mensualesVistos.length || !anualesVistos.length) {
    fallas.push(
      `el toggle no cambio nada: mensual=[${mensualesVistos.join(", ")}] anual=[${anualesVistos.join(", ")}]. ` +
        "Un boton que no responde publica el precio equivocado sin que nada se ponga rojo.",
    );
    return fallas;
  }

  for (const visto of mensualesVistos) {
    if (!declaradosMensuales.includes(visto)) {
      fallas.push(`Bs ${visto} se muestra como precio MENSUAL y no lo cobra ningun plan de pricing.ts`);
    }
  }
  /**
   * Tras el clic NO se exige que TODO monto sea anual: el add-on se cobra por mes y sigue
   * diciendo "390 Bs / mes" con el toggle en Anual — es correcto, y abajo aclara su total
   * del año. Exigirle que cambiara habria dado un rojo sobre copy sano.
   *
   * Lo que sí se exige son las dos cosas que importan: que ningun monto grande quede fuera
   * de la fuente, y —por separado, abajo— que el clic haya cambiado algo. Un gate que
   * confunde "no cambia porque no corresponde" con "no cambia porque esta roto" acaba
   * apagado.
   */
  for (const visto of anualesVistos) {
    if (!declaradosAnuales.includes(visto) && !declaradosMensuales.includes(visto)) {
      fallas.push(`Bs ${visto} se muestra tras el clic en Anual y no lo cobra ningun plan de pricing.ts`);
    }
  }
  const mismos = [...mensualesVistos].sort().join(",") === [...anualesVistos].sort().join(",");
  if (mismos) {
    fallas.push(
      `el clic en "Anual" no cambio ni un monto (sigue mostrando ${mensualesVistos.join(", ")}): ` +
        "el lead no puede llegar al precio anual y el descuento no existe en pantalla",
    );
  }
  for (const visto of porMesVistos) {
    const legitimos = declaradosAnuales.map(porMesDeUnAnual);
    if (!legitimos.includes(visto)) {
      fallas.push(
        `"Bs ${visto} por mes" no es el doceavo de ningun precio anual declarado ` +
          `(los honestos son ${legitimos.join(", ")}): el sitio ofrece una mensualidad que nadie cobra`,
      );
    }
  }
  return fallas;
}

/** Los montos que el lead ve GRANDES — los que deciden la compra, no la letra chica. */
const montosGrandes = (pagina) =>
  pagina.evaluate(() => {
    const vistos = [];
    document.querySelectorAll("*").forEach((n) => {
      if (n.children.length) return;
      const t = (n.textContent || "").trim();
      if (!/^[\d][\d.,]*$/.test(t)) return;
      if (parseFloat(getComputedStyle(n).fontSize) < 30) return;
      vistos.push(t);
    });
    return [...new Set(vistos)];
  });

const porMesALaVista = (pagina) =>
  pagina.evaluate(() =>
    [...new Set((document.body.innerText.match(/Bs\s*([\d.,]+)\s*por mes/g) || []))].map((s) =>
      s.replace(/[^\d.,]/g, ""),
    ),
  );

if (import.meta.url === `file://${process.argv[1]}`) {
  const require = createRequire(join(APP, "package.json"));
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.error("NO PUDE MEDIR: playwright no resuelve desde esta app.");
    process.exit(2);
  }

  const declarada = escaleraDeclarada();
  mkdirSync(out, { recursive: true });

  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({
    viewport: { width: 1366, height: 900 },
    timezoneId: "America/La_Paz",
    // Se pide ACA y no con un `addStyleTag` despues del `goto`: la hoja inyectada llega
    // cuando la pantalla ya empezo a pintar, y lo que se fotografia es el estado a mitad
    // de camino — la misma firma que un bug real.
    reducedMotion: "reduce",
  });
  const pagina = await contexto.newPage();

  try {
    await pagina.goto(`${base}/`, { waitUntil: "load", timeout: 60000 });
  } catch (e) {
    await navegador.close();
    console.error(`NO PUDE MEDIR: ${base}/ no contesto — ${e.message}`);
    process.exit(2);
  }

  // El scroll suave y las transiciones fotografian estados a mitad de camino: la misma
  // firma que un bug real. Se apagan ANTES de tocar nada (2026-09-03).
  await pagina.addStyleTag({
    content: "html{scroll-behavior:auto!important}*{animation:none!important;transition:none!important}",
  });

  const mensualesVistos = (await montosGrandes(pagina)).map(aNumero);

  const toggle = pagina.locator("button,[role=button],label").filter({ hasText: /anual/i }).first();
  let habiaToggle = true;
  try {
    await toggle.click({ timeout: 15000 });
  } catch {
    habiaToggle = false;
  }
  await pagina.waitForTimeout(1000);

  const anualesVistos = habiaToggle ? (await montosGrandes(pagina)).map(aNumero) : [];
  const porMesVistos = habiaToggle ? (await porMesALaVista(pagina)).map(aNumero) : [];
  await pagina.screenshot({ path: join(out, "anual.png") });
  await navegador.close();

  console.log(`Base: ${base}  ·  planes declarados en pricing.ts: ${declarada.length}`);
  if (!habiaToggle) {
    console.error(
      "ROJO: no encontre el boton 'Anual' en la banda de precios de la home. " +
        "El lead no puede llegar al precio anual, o el gate dejo de saber donde esta.",
    );
    process.exit(1);
  }
  console.log(`  mensual, antes del clic : ${mensualesVistos.join(", ")}`);
  console.log(`  anual,  despues del clic: ${anualesVistos.join(", ")}`);
  console.log(`  "por mes" derivado      : ${porMesVistos.join(", ")}`);

  const fallas = fallasDelSegundoTurno({ declarada, mensualesVistos, anualesVistos, porMesVistos });
  if (fallas.length) {
    console.error(`\nROJO — el segundo turno publica ${fallas.length} precio(s) que nadie cobra:`);
    for (const f of fallas) console.error(`  · ${f}`);
    console.error(`\nCaptura: ${join(out, "anual.png")}`);
    process.exit(1);
  }
  console.log(
    `\nVERDE: el toggle responde y los ${anualesVistos.length} precios anuales + los ` +
      `${porMesVistos.length} equivalentes mensuales salen de pricing.ts. Captura: ${join(out, "anual.png")}`,
  );
}
