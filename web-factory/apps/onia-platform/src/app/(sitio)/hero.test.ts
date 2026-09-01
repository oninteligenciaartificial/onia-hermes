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

describe("el hero de la portada se DIBUJA, no se captura", () => {
  it("encuentra la sección del hero", () => {
    const hero = seccionHero(PORTADA);
    expect(hero.length).toBeGreaterThan(500);
    // el titular aprobado: si esto no está, el ancla apunta a otra cosa
    expect(hero).toContain("El negocio <em>no</em>");
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
