import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { AGENDA_CONSULTA_URL, AGENDA_DEMO_URL, CITA_DURACION_MIN } from "@/lib/site";

/**
 * La cita que la web ofrece dura lo que el producto RESERVA.
 *
 * **Por qué existe.** Medido el 2026-09-25 contra el bot desplegado: `/contacto`
 * vendía *«la consulta comercial de 20 minutos»* y *«la demo de 45 minutos»*, y
 * el motor que atiende esos dos WhatsApp bloquea **30** (`DEMO.duracionMinutos`
 * en `hermes-content/deploy/vps-ops/bot/config.mjs`; `CALCOM_BOT_DURATION_MINUTES`
 * está vacía en el proceso vivo, así que gana el código). El lead aceptaba
 * creyendo 20 y recibía media hora, o pedía 45 y le daban 30.
 *
 * No es un número nuevo: es la MISMA decisión de Sergio Urcullo del 2026-08-06
 * —«30 y 30»— que en su momento se barrió por el guion del bot y dejó la web
 * afuera. El bloque de `config.mjs` lo dice con todas las letras: *«el prospecto
 * aceptaba creyendo una cosa y recibía una invitación que le comía otra»*. Una
 * promesa que cambia se barre en toda la superficie, no sólo donde la estabas
 * tocando — y la web era la mitad que faltaba.
 *
 * **Por qué cruza contra el bot y no contra una constante copiada.** Copiar el
 * 30 acá sería exactamente el defecto que este gate existe para cazar: dos
 * lugares con el mismo hecho, libres de divergir. La fuente es la del motor que
 * hace la reserva; la web la sigue.
 *
 * Si el árbol no trae `hermes-content/` (worktree sparse), el gate **se planta**:
 * un archivo ausente leído como «no hay contradicción» es un verde que no midió
 * nada.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/** `hermes-content/deploy/vps-ops/bot/config.mjs`, buscando la raíz del repo hacia arriba. */
function configDelBot(): string {
  const RELATIVA = join("hermes-content", "deploy", "vps-ops", "bot", "config.mjs");
  let dir = AQUI;
  for (let i = 0; i < 8; i += 1) {
    const candidato = join(dir, RELATIVA);
    if (existsSync(candidato)) return candidato;
    const padre = dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  throw new Error(
    `no encontré ${RELATIVA} subiendo desde ${AQUI} — árbol incompleto, este gate NO midió nada`,
  );
}

/** Lo que el motor BLOQUEA en el calendario. Es la fuente; la web la sigue. */
function minutosQueReservaElProducto(): number {
  const src = readFileSync(configDelBot(), "utf8");
  const m = /duracionMinutos:\s*(\d+)/.exec(src);
  if (!m) {
    throw new Error(
      "config.mjs del bot ya no declara `duracionMinutos: <n>` — árbol incompleto o la fuente se movió",
    );
  }
  return Number(m[1]);
}

/** El texto que el lead ve escrito en su WhatsApp antes de mandarlo. */
function frase(waUrl: string): string {
  const text = new URL(waUrl).searchParams.get("text");
  if (!text) throw new Error(`el enlace no lleva texto pre-escrito: ${waUrl}`);
  return text;
}

const CONTACTO = join(AQUI, "..", "app", "(sitio)", "contacto", "page.tsx");

describe("la duración que promete la web es la que reserva el producto", () => {
  it("CITA_DURACION_MIN sale de la fuente del bot, no de una copia", () => {
    expect(CITA_DURACION_MIN).toBe(minutosQueReservaElProducto());
  });

  it("ninguna de las dos frases de WhatsApp nombra otra duración", () => {
    const reservados = minutosQueReservaElProducto();
    for (const url of [AGENDA_CONSULTA_URL, AGENDA_DEMO_URL]) {
      const texto = frase(url);
      const nombrados = [...texto.matchAll(/(\d+)\s*min/gi)].map((m) => Number(m[1]));
      expect(
        nombrados.filter((n) => n !== reservados),
        `este mensaje promete una duración que el producto no reserva (${reservados} min): «${texto}»`,
      ).toEqual([]);
    }
  });

  it("/contacto no nombra ninguna otra duración de cita", () => {
    if (!existsSync(CONTACTO)) {
      throw new Error(`${CONTACTO} no existe — árbol incompleto, este gate NO midió nada`);
    }
    const reservados = minutosQueReservaElProducto();
    const src = readFileSync(CONTACTO, "utf8");
    const nombradas = [...src.matchAll(/(\d+)\s*minutos/gi)].map((m) => Number(m[1]));
    expect(
      [...new Set(nombradas.filter((n) => n !== reservados))],
      `la página de la cita nombra duraciones que el producto no reserva (${reservados} min). ` +
        "Son las que el lead lee antes de escribir: alinealas o sacá el número.",
    ).toEqual([]);
  });
});
