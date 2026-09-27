import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Ningún comentario de la portada TIPEA en qué número de sección vive un bloque:
 * el número sale del `page.tsx`, que es el único que lo sabe.
 *
 * **POR QUÉ EXISTE — costó una vuelta entera el 2026-09-27.** El comentario de
 * `hero.test.ts` decía, como explicación de por qué el hero no puede nombrar al
 * asistente: *"el asistente sigue teniendo su sección propia más abajo (6 ·
 * CHATBOT), que es donde le toca vender"*. Era cierto cuando se escribió. Ese día
 * la sección 6 era RUBROS y el chatbot era la 2 — y no por un descuido: lo movió
 * `a847d9aa`, *"veredicto de Sergio 11-sep — chatbot protagonista"*, que es una
 * decisión suya POSTERIOR a la regla del 3-sep que el mismo comentario cita.
 *
 * El daño no es cosmético y está medido: esta vuelta midió producción (el bloque
 * del add-on a 1.295 px, el primer bloque del sistema recién a 3.194 px), leyó ese
 * comentario como estado presente y estuvo a punto de reordenar la portada para
 * "restituir" un orden que Sergio había descartado. Lo único que lo frenó fue el
 * `git log` de la línea. **Un ejemplo congelado en pasado se lee como presente y
 * manda al revés** — es la falla que `CLAUDE.md` §2 documenta con el alta, que se
 * leyó cerrada cinco días después de haberse abierto.
 *
 * Por eso el arreglo no es corregir el 6 por un 2: sería el mismo fósil con otro
 * número, listo para mentir en el próximo `veredicto de Sergio`. Lo que se prohíbe
 * es TIPEAR el par número-nombre; quien necesite nombrar una sección la nombra por
 * su NOMBRE, que es estable, y el número lo deriva el que lo necesite.
 *
 * Lo que NO hace: opinar sobre el orden. Dónde va el chatbot lo decide Sergio
 * Urcullo y hoy está decidido. Esto sólo impide que un comentario afirme un orden
 * que el archivo contradice.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const PORTADA = readFileSync(join(AQUI, "page.tsx"), "utf8");

/**
 * El mapa real, derivado del disco: `{/* 2 · CHATBOT — PROTAGONISTA` → 2, "CHATBOT".
 *
 * El nombre corta en el primer guión largo, filete o cierre de comentario, que es
 * donde el archivo deja de nombrar la sección y empieza a explicarla.
 */
function seccionesDeLaPortada(src: string): Map<number, string> {
  const mapa = new Map<number, string>();
  for (const m of src.matchAll(/\{\/\*\s*(\d+)\s*·\s*([^—─*\n]+)/g)) {
    mapa.set(Number(m[1]), m[2].trim());
  }
  return mapa;
}

/**
 * Los archivos que pueden citar una sección: los tests de esta carpeta y la
 * portada misma. Se DERIVAN del directorio — una lista escrita a mano dejaría al
 * test nuevo fuera del gate, que es exactamente cómo nace el próximo fósil.
 *
 * Este archivo se excluye por una razón que no es comodidad: su JSDoc cita el
 * `6 · CHATBOT` de arriba a propósito, como la evidencia de qué salió mal. Es la
 * única cita del repo que tiene que poder estar equivocada.
 */
const YO = "seccion-citada-no-se-tipea.test.ts";
function archivosQueCitan(): string[] {
  return readdirSync(AQUI).filter(
    (f) => (f.endsWith(".test.ts") || f === "page.tsx") && f !== YO,
  );
}

/** Una cita coincide si un nombre es prefijo del otro: `LO QUE SE SUMA` vale por `LO QUE SE SUMA AL PLAN`. */
function mismaSeccion(citado: string, real: string): boolean {
  const a = citado.toUpperCase();
  const b = real.toUpperCase();
  return a.startsWith(b) || b.startsWith(a);
}

describe("el número de sección de la portada no se tipea", () => {
  const secciones = seccionesDeLaPortada(PORTADA);

  /**
   * Instrumento antes que veredicto: si la regex deja de casar con los
   * comentarios del archivo, el mapa sale vacío y todo lo de abajo pasa en verde
   * sin haber mirado nada. Ese es el falso verde de esta familia.
   */
  it("deriva el mapa de secciones del page.tsx", () => {
    expect(
      secciones.size,
      "no se derivó ninguna sección: la regex ya no casa con los comentarios de page.tsx",
    ).toBeGreaterThanOrEqual(8);
    expect([...secciones.values()], "el mapa salió con nombres vacíos").not.toContain("");
  });

  it("ningún comentario afirma un número que el page.tsx contradice", () => {
    const fosiles: string[] = [];

    for (const archivo of archivosQueCitan()) {
      const src = readFileSync(join(AQUI, archivo), "utf8");
      // El número de sección va SIN cero a la izquierda (`2 · CHATBOT`), y las tarjetas
      // de adentro van CON él (`02 · RECUPERAR`, en panel-de-cuenta-vs-plan.test.ts). Sin
      // esta distinción el gate acusaba una tarjeta de ser una sección mal citada: un rojo
      // por el motivo equivocado, que es un verde futuro.
      for (const m of src.matchAll(/\b([1-9]\d*)\s*·\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{2,})/g)) {
        const numero = Number(m[1]);
        const citado = m[2].trim();
        const real = secciones.get(numero);

        // Citado con su nombre correcto: es el propio `page.tsx` o una cita sana.
        if (real && mismaSeccion(citado, real)) continue;

        const dondeEsta = [...secciones.entries()].find(([, n]) => mismaSeccion(citado, n));
        fosiles.push(
          dondeEsta
            ? `${archivo}: dice «${numero} · ${citado}» y ${citado} es la sección ${dondeEsta[0]} ` +
              `(la ${numero} es ${real ?? "inexistente"}). Nombrala sin el número.`
            : `${archivo}: dice «${numero} · ${citado}» y la portada no tiene ninguna sección ` +
              `llamada así (la ${numero} es ${real ?? "inexistente"}).`,
        );
      }
    }

    expect(fosiles, `citas de sección que el page.tsx desmiente:\n  ${fosiles.join("\n  ")}`).toEqual(
      [],
    );
  });
});
