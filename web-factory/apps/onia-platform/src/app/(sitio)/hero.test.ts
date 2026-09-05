import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El hero de la portada NO lleva capturas del sistema.
 *
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". El hero que aprobó ese día dibuja el día
 * del negocio con divs y color — cero imagen, cero SVG, cero sombra.
 *
 * El guard existe porque la tentación es exactamente la contraria: la columna
 * derecha del hero fue una captura del panel durante toda la v3, y todos los
 * demás bloques de la página siguen usando <Shape src=...>. Copiar el patrón de
 * al lado es el error que va a pasar, y un `grep` a mano no lo va a atrapar
 * seis meses después.
 *
 * Se mira la SECCIÓN, no el archivo: el resto de la portada sí lleva capturas
 * reales y eso está bien. Los comentarios numerados (`1 · HERO`, `2 · BANDA`)
 * son la estructura del archivo y sirven de ancla.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const PORTADA = readFileSync(join(AQUI, "page.tsx"), "utf8");
const CSS = readFileSync(join(AQUI, "sitio.module.css"), "utf8");

function seccionHero(src: string): string {
  const desde = src.indexOf("{/* 1 · HERO");
  const hasta = src.indexOf("{/* 2 ·", desde + 1);
  return src.slice(desde, hasta);
}

/**
 * La sección SIN sus comentarios: lo que un lead ve, no lo que la próxima
 * sesión lee.
 *
 * Existe porque el guard de abajo prohíbe nombrar al asistente en el hero, y
 * el comentario que explica POR QUÉ salió lo nombra cinco veces. Sin esto, el
 * gate obliga a borrar la historia del defecto para pasar en verde — la misma
 * trampa que el barrido de palabras clave de Lucía encontró el 2026-09-04: un
 * gate que no separa la pieza de la prosa hace reescribir la bitácora.
 */
function copyHero(src: string): string {
  return seccionHero(src)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ");
}

describe("el hero de la portada se DIBUJA, no se captura", () => {
  it("encuentra la sección del hero", () => {
    const hero = seccionHero(PORTADA);
    expect(hero.length).toBeGreaterThan(500);
    // el titular vigente: si esto no está, el ancla apunta a otra cosa
    expect(hero).toContain("en <em>una</em> pantalla");
  });

  it.each([
    ["<img", /<img\b/],
    ["<svg", /<svg\b/],
    ["<video", /<video\b/],
    ["<Shape", /<Shape\b/],
    ["background-image", /background-image/],
    ["url(", /\burl\(/],
  ])("no usa %s", (que, patron) => {
    expect(seccionHero(PORTADA), `el hero volvió a usar ${que}`).not.toMatch(
      patron,
    );
  });

  /**
   * La OFERTA es el sistema de gestión; el asistente es un add-on de
   * `lib/pricing.ts` y NUNCA el titular (CLAUDE.md §3, Sergio 2026-09-03:
   * "el sistema no ofrece directamente el bot, ofrece solo el sistema").
   *
   * El hero anterior lo desobedecía entero y nadie lo veía: kicker "Un negocio
   * abre 9 horas", el gráfico grande era el día partido en 9/15 —la escena que
   * hace el asistente, no el plan— y cerraba con "El asistente es la puerta".
   * El add-on de Bs 390 era el argumento y el sistema de Bs 320 el relleno.
   *
   * Se mira la PRIMERA PANTALLA, no la página: el asistente sigue teniendo su
   * sección propia más abajo (6 · CHATBOT), que es donde le toca vender.
   */
  it("el titular vende el SISTEMA, no el asistente", () => {
    const copy = copyHero(PORTADA);
    // el ancla, ya sin comentarios: si esto falla, el filtro se comió el JSX
    expect(copy).toContain("en <em>una</em> pantalla");
    expect(copy, "el hero volvió a titular con el add-on").not.toMatch(
      /asistente|chatbot|\bbot\b|recepcionista/i,
    );
  });

  /**
   * El <head> dice lo mismo que el hero, y por eso se vigila igual.
   *
   * No es simetría de estilo: el título de la pestaña, el snippet de Google y
   * la tarjeta que se ve al compartir el link por WhatsApp son superficie de
   * cliente que NINGUNA captura mira (medido el 2026-09-03 en /terminos: el
   * cartel de borrador se sacó de la pantalla y la meta description lo siguió
   * anunciando). Probando este mismo guard se inyectó "El asistente contesta"
   * en `OG_TITULO` creyendo que iba al h1, y los doce tests pasaron en verde
   * con el bot de titular en lo primero que ve un lead por WhatsApp.
   */
  it("la pestaña, el buscador y el link compartido tampoco titulan con el add-on", () => {
    // sin comentarios, por lo mismo que `copyHero`: el JSDoc de `ADDONS_RESTO`
    // cae dentro del tramo y nombra al chatbot cuatro veces
    const head = PORTADA.slice(
      PORTADA.indexOf("const DESDE_MES"),
      PORTADA.indexOf("const ADDONS_RESTO"),
    ).replace(/\/\*[\s\S]*?\*\//g, " ");
    expect(head.length).toBeGreaterThan(300);
    expect(head).toContain("Todo el negocio");
    expect(head, "el <head> volvió a vender el asistente").not.toMatch(
      /asistente|chatbot|\bbot\b|recepcionista/i,
    );
    // y el precio también acá sale de la fuente, no tipeado
    expect(head).toMatch(/plan\("basico"\)\.mensual/);
  });

  /**
   * El precio de entrada está en la primera pantalla y sale de la FUENTE.
   *
   * Es la mitad que faltaba del punto anterior: sacar al bot del titular sin
   * poner qué se compra deja un hero que no vende nada. Lety y Dapta, miradas
   * el 2026-09-03, ponen las dos un precio o un "empezá gratis" arriba.
   *
   * Interpolado, nunca tipeado: `precios.test.ts` prohíbe el literal en toda
   * la app, y acá se exige además que el hero SÍ traiga el número.
   */
  it("el hero publica el precio de entrada, leído de lib/pricing", () => {
    const hero = seccionHero(PORTADA);
    expect(hero).toMatch(/plan\("basico"\)\.mensual/);
    expect(hero).toMatch(/PRUEBA\.dias/);
  });

  /**
   * La banda del día (9 h / 15 h) es el argumento del ASISTENTE, así que vive
   * en su sección y no en la portada de la oferta. Si vuelve al hero, vuelve
   * el problema entero: es la pieza más grande de la primera pantalla.
   */
  it("la banda del día ya no está en el hero", () => {
    expect(seccionHero(PORTADA)).not.toMatch(/className=\{s\.day\}/);
    // pero sigue viva en la página, con el add-on que la explica
    expect(PORTADA).toMatch(/className=\{s\.day\}/);
  });

  it("las 9 horas y las 15 suman el día entero", () => {
    const vos = Number(/const HORAS_VOS = (\d+)/.exec(PORTADA)?.[1]);
    const onia = Number(/const HORAS_ONIA = (\d+)/.exec(PORTADA)?.[1]);
    // la rejilla del día son 24 columnas: si no suman 24, el corte de las
    // 18:00 deja de caer donde la regla dice que cae
    expect(vos + onia).toBe(24);
    expect(CSS).toContain("repeat(24, minmax(0, 1fr))");
  });

  it("los agentes no mandan nada solos", () => {
    // onia-core/contract.json:838 y app/api/cron/onia-agents/route.ts: todo lo
    // que contacta a un cliente queda en la cola de aprobación. Tres
    // diseñadores prometieron lo contrario acá antes de que existiera el guard.
    // Los tres momentos del bloque verde viven en MOMENTOS, arriba del JSX.
    const momentos = PORTADA.slice(
      PORTADA.indexOf("const MOMENTOS"),
      PORTADA.indexOf("function Lane"),
    );
    expect(momentos).toContain("Vos los aprobás");
    expect(momentos).not.toMatch(
      /te avisa|manda sol|env[ií]a sol|cobra sol|autom[áa]ticamente/i,
    );
  });
});
