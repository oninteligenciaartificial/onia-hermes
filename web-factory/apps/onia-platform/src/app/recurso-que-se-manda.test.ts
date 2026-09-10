import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CARPETA_DE_RECURSOS,
  RECURSOS_QUE_SE_MANDAN,
} from "@/lib/recursos-que-se-mandan";

/**
 * Un archivo que el sitio SIRVE pero que ninguna página enlaza no puede
 * romperse en silencio.
 *
 * El motivo entero —y la medición que lo abrió— está en
 * `src/lib/recursos-que-se-mandan.ts`. En una línea: los dos PDF de
 * `public/recursos/` son imanes de leads que manda un workflow de n8n por DM, no
 * un botón del sitio, así que los tres gates de enlaces del repo son ciegos a
 * ellos por construcción: los tres derivan sus sujetos de las PÁGINAS.
 *
 * El sujeto de acá es el DISCO, en las dos direcciones, que es lo que impide que
 * esto se vuelva una lista de inclusión —la forma en que esta familia de gates
 * ya falló abierto varias veces en este proyecto—:
 *
 *   disco → registro : un PDF nuevo que nadie declara pone esto en rojo. Sin
 *                      este lado, alguien deja un archivo en `public/recursos/`,
 *                      lo empieza a mandar, y nace sin vigilancia.
 *   registro → disco : borrar o RENOMBRAR un archivo declarado pone esto en
 *                      rojo. Éste es el que ataja el fallo que ya pasó — el DM
 *                      sale igual y el lead abre un 404.
 *
 * ⚠️ **Lo que este gate NO puede ver, dicho acá para que nadie lo dé por
 * cubierto:** si el material de afuera cambia la URL que manda (otro nombre de
 * archivo, otra carpeta), el disco y el registro siguen coincidiendo y esto pasa
 * en VERDE. Ese cruce necesita leer `hermes-content/`, que no está en todos los
 * worktrees —sparse-checkout, o el árbol de la app copiado solo—, y exigirlo acá
 * sería un rojo por AMBIENTE, que traba el merge de los quince carriles. Va
 * aparte, en `npm run recursos:vivos`, que sale 2 = NO MEDIDO en vez de 1 cuando
 * no alcanza el material.
 *
 * Validado por MUTACIÓN el 2026-09-08, las dos direcciones y por su propia razón:
 * renombrar `lista-por-donde-empezar.pdf` deja el registro huérfano (rojo) y de
 * paso agrega un archivo no declarado (rojo), y son dos casos distintos.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/app` → `src/` → la raíz de la app, donde vive `public/`. */
const PUBLIC = join(AQUI, "..", "..", "public");
const RECURSOS = join(PUBLIC, CARPETA_DE_RECURSOS);

/**
 * Lo que hay HOY en el disco. No se filtra por extensión: si mañana el imán es
 * un `.xlsx` o un `.png`, tiene que entrar igual — filtrar por `.pdf` sería la
 * lista de inclusión de vuelta, un nivel más abajo.
 */
function archivosEnDisco(): string[] {
  if (!existsSync(RECURSOS)) return [];
  return readdirSync(RECURSOS, { withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

describe("los recursos que se mandan por fuera del sitio no se rompen callados", () => {
  it("la carpeta que sirve los imanes de leads existe y no está vacía", () => {
    // Si el build deja de copiar `public/recursos/`, o alguien la mueve, los DM
    // de Lucía empiezan a entregar 404 sin una sola señal. Este caso es el piso:
    // sin él, los dos cruces de abajo comparan dos conjuntos vacíos y pasan.
    expect(
      existsSync(RECURSOS) && statSync(RECURSOS).isDirectory()
        ? null
        : `No existe ${RECURSOS}. Los PDF que el workflow de n8n le manda a un ` +
          `lead los sirve esta app: sin esa carpeta, el DM entrega un 404.`,
    ).toBeNull();

    expect(
      archivosEnDisco().length > 0
        ? null
        : `public/${CARPETA_DE_RECURSOS}/ está vacía y el registro declara ` +
          `${RECURSOS_QUE_SE_MANDAN.length} recurso(s) que se siguen mandando.`,
    ).toBeNull();
  });

  it("todo archivo servido está declarado, con quién lo manda", () => {
    const declarados = new Set(RECURSOS_QUE_SE_MANDAN.map((r) => r.archivo));
    const huerfanos = archivosEnDisco().filter((a) => !declarados.has(a));

    expect(
      huerfanos.length === 0
        ? null
        : `Hay ${huerfanos.length} archivo(s) en public/${CARPETA_DE_RECURSOS}/ que ` +
          `nadie declaró en src/lib/recursos-que-se-mandan.ts: ${huerfanos.join(", ")}. ` +
          `Un archivo que el sitio sirve y ninguna página enlaza sólo lo puede ` +
          `pedir alguien de afuera: declaralo con quién lo manda, o borralo.`,
    ).toBeNull();
  });

  it("todo recurso declarado sigue existiendo con ese nombre exacto", () => {
    const enDisco = new Set(archivosEnDisco());
    const rotos = RECURSOS_QUE_SE_MANDAN.filter((r) => !enDisco.has(r.archivo));

    expect(
      rotos.length === 0
        ? null
        : rotos
            .map(
              (r) =>
                `public/${CARPETA_DE_RECURSOS}/${r.archivo} no está. Lo manda: ` +
                `${r.loManda} El DM sale igual y el lead abre un 404 — ya pasó ` +
                `con la palabra LISTA (ver ONIA_AUTOMATIZACION_MENSAJES_20260818.md).`,
            )
            .join(" · "),
    ).toBeNull();
  });

  it("cada recurso declara quién lo manda, no sólo que existe", () => {
    // Sin esto, el registro se degrada a una lista de nombres: el día que alguien
    // dude si un PDF sigue haciendo falta, no tiene con qué contestar, y lo que
    // no se puede justificar se borra.
    const mudos = RECURSOS_QUE_SE_MANDAN.filter(
      (r) => r.loManda.trim().length < 30 || r.palabra.trim() === "",
    ).map((r) => r.archivo);

    expect(
      mudos.length === 0
        ? null
        : `Estos recursos no dicen quién los manda ni con qué palabra: ` +
          `${mudos.join(", ")}. Una entrada sin eso no se puede auditar.`,
    ).toBeNull();
  });
});
