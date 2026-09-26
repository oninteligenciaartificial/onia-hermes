import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";
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
 * **Si el árbol no trae `hermes-content/`, este gate se declara NO MEDIDO — no se
 * planta.** Y esa distinción no es una comodidad: plantarse rompió el deploy.
 *
 * Medido el 2026-09-26 03:50 UTC en `/tmp/pub-landing.log` del VPS: el publicador
 * de la landing armó su build, estos tres casos tiraron *«árbol incompleto, este
 * gate NO midió nada»*, el `prebuild` salió 1 y el publicador cortó con `ERR: el
 * build falló, no publico`. **La landing dejó de publicarse.** El árbol del stage
 * está recortado *por diseño*: `build-and-stage.sh` empaqueta sólo
 * `web-factory/apps packages package.json pnpm-lock.yaml …`, así que
 * `hermes-content/` no viaja nunca y este gate iba a fallar en TODOS los builds,
 * no en uno raro.
 *
 * Es el mecanismo que esta app ya tenía escrito dos veces y que este gate no usó:
 * `promesa-inclusion-espejo.test.ts` pregunta por el subárbol hermano antes de
 * comparar, y `recurso-que-se-manda.test.ts` lo dice con todas las letras —*«ese
 * cruce necesita leer `hermes-content/`, que no está en todos los worktrees
 * —sparse-checkout, o el árbol de la app copiado solo—»*.
 *
 * **Lo que NO se ablanda.** El salto vale sólo cuando falta el subárbol ENTERO
 * (stage de publicación, worktree sparse). Si `hermes-content/` está y el archivo
 * puntual no, sigue siendo ROJO: ahí la fuente se movió de verdad, y eso es el
 * defecto que este gate existe para cazar. Un skip que no distingue las dos cosas
 * es el verde permanente que la próxima nadie mira.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

const RELATIVA = join("hermes-content", "deploy", "vps-ops", "bot", "config.mjs");

/**
 * La raíz del monorepo, buscando el subárbol hermano hacia arriba.
 * `null` = árbol recortado (el stage del publicador, o un worktree sparse).
 */
export function raizDelMonorepo(desde: string = AQUI): string | null {
  let dir = desde;
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(dir, "hermes-content"))) return dir;
    const padre = dirname(dir);
    if (padre === dir) return null;
    dir = padre;
  }
  return null;
}

const RAIZ = raizDelMonorepo();
/** ¿Hay con qué cruzar? En el stage de publicación, no — y eso se dice, no se supone. */
const EN_EL_REPO_COMPLETO = RAIZ !== null;

/** Lo que el motor BLOQUEA en el calendario. Es la fuente; la web la sigue. */
function minutosQueReservaElProducto(): number {
  const candidato = join(RAIZ as string, RELATIVA);
  if (!existsSync(candidato)) {
    throw new Error(
      `el árbol trae hermes-content/ pero no ${RELATIVA} — la fuente se movió, este gate NO midió nada`,
    );
  }
  const src = readFileSync(candidato, "utf8");
  const m = /duracionMinutos:\s*(\d+)/.exec(src);
  if (!m) {
    throw new Error(
      "config.mjs del bot ya no declara `duracionMinutos: <n>` — la fuente se movió",
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
  /**
   * Corre en los DOS árboles, y es lo que evita que el salto de arriba se vuelva un
   * verde permanente: si el detector dijera «repo completo» en cualquier parte, los
   * casos de abajo se saltarían para siempre sin que nada lo diga.
   */
  it("el detector de árbol recortado contesta las dos cosas, no siempre la misma", () => {
    expect(raizDelMonorepo(parse(AQUI).root)).toBeNull();
    if (EN_EL_REPO_COMPLETO) {
      expect(existsSync(join(RAIZ as string, "hermes-content"))).toBe(true);
    }
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("CITA_DURACION_MIN sale de la fuente del bot, no de una copia", () => {
    expect(CITA_DURACION_MIN).toBe(minutosQueReservaElProducto());
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("ninguna de las dos frases de WhatsApp nombra otra duración", () => {
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

  it.skipIf(!EN_EL_REPO_COMPLETO)("/contacto no nombra ninguna otra duración de cita", () => {
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
