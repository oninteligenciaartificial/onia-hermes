import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio no ofrece un rubro que el alta no pueda entregar.
 *
 * Sergio, 2026-08-21: "aun no terminemos los que ya tenemos" — Veterinaria se
 * sacó de toda la web. El registro entrega CINCO rubros y el sitio vende esos
 * cinco; vender un sexto pierde al lead en el último clic, que es el clic más
 * caro del sitio.
 *
 * Medido en vivo el 2026-09-05 en `app.onia.com.bo/register` (abierto y LEÍDO,
 * no grepeado): clínica dental · comercio/tienda · importadora/distribuidora ·
 * estética y spa · servicios profesionales. Veterinaria NO está, y la pantalla
 * cierra con "¿Otro rubro? Escribinos y lo vemos con vos" — que es justamente
 * cómo se captura la demanda sin prometer.
 *
 * ⚠️ POR QUÉ ESTE GUARD MIRA `/v1`, que el guard hermano excluye.
 *
 * La orden se cumplió en el sitio vivo y NO viajó al archivo de la web vieja.
 * Medido el 2026-09-05 contra producción: `/` `/rubros` `/empezar` `/precios`
 * dan cero, y `onia.com.bo/v1` responde **200** con "veterinaria" cinco veces
 * y `/v1/prueba-gratis` tres. `forma.test.ts` exime `app/v1` y
 * `components/landing-v1` porque son noindex — y ese corte ya falló ABIERTO dos
 * veces en este carril: noindex manda sobre buscadores, no apaga la pantalla.
 * El 2026-09-04 `/v1/comparativa` sirvió un día de más la frase de obra que se
 * había barrido de su gemela por el mismo motivo. Una página que devuelve 200
 * es superficie de cliente, la vea Google o no.
 *
 * Por eso los sujetos se derivan del DISCO entero y no hay exentos: un archivo
 * nuevo nace cubierto.
 */

/**
 * Los cinco que el alta entrega. Se guardan por raíz porque cada superficie los
 * escribe a su manera ("Dental" / "Clínica dental", "Comercio" / "Comercio /
 * tienda"), y lo que importa es el rubro, no su rótulo.
 */
const RUBROS_DEL_ALTA = [
  /dental/i,
  /comercio/i,
  /importadora/i,
  /est[eé]tica/i,
  /servicios/i,
] as const;

/**
 * Vocabulario de rubros que el alta NO entrega hoy.
 *
 * Es una lista enumerada y por lo tanto incompleta a propósito: sólo puede
 * fallar dejando pasar un rubro que nadie previó, nunca borrando uno legítimo.
 * Se amplía el día que aparezca otro. Veterinaria es la que motivó el guard.
 */
const RUBROS_AJENOS = [
  /veterinari/i,
  /farmacia/i,
  /restaurante|gastronom/i,
  /hotel|hospedaje/i,
  /gimnasio/i,
  /inmobiliaria/i,
] as const;

/**
 * Un archivo "publica la lista" cuando nombra al menos tres de los cinco: con
 * menos puede estar hablando de un rubro suelto (una página dedicada, un
 * ejemplo) y no enumerando la oferta.
 */
const MINIMO_PARA_SER_LISTA = 3;

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: `app/` y todo lo compartido. Sin exentos — ver cabecera. */
const SRC = dirname(dirname(AQUI));

function fuentesDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return fuentesDelSitio(ruta);
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [ruta];
  });
}

/**
 * Los comentarios se sacan ANTES de mirar. El guard castiga OFRECER el rubro,
 * no nombrarlo: este archivo y la cabecera de `empezar/page.tsx` explican en
 * prosa cuál fue el bug, y un guard que se dispara con la bitácora de su propio
 * error es un guard que alguien apaga.
 */
function soloCodigo(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("el sitio ofrece los rubros que el alta entrega", () => {
  const archivos = fuentesDelSitio(SRC);
  const rotulo = (f: string) => f.slice(SRC.length + 1);

  it("encuentra las páginas del sitio", () => {
    // si el walk se rompe, los expects de abajo pasan sobre una lista vacía
    expect(archivos.length).toBeGreaterThan(5);
  });

  /**
   * El anti-regresión que importa. Sin esto alguien vuelve a exentar el archivo
   * de la web vieja —suena inofensivo, "es noindex"— y el guard queda verde
   * sobre las tres superficies que HOY sirven el defecto en producción.
   */
  it("mira también /v1, que responde 200 aunque sea noindex", () => {
    const relativos = archivos.map(rotulo);
    for (const afuera of [
      join("app", "v1", "page.tsx"),
      join("app", "v1", "prueba-gratis", "page.tsx"),
      join("components", "landing-v1", "how-it-works.tsx"),
      join("components", "landing-v1", "features.tsx"),
    ]) {
      expect(relativos, `el walk no llega a ${afuera}`).toContain(afuera);
    }
  });

  it.each(archivos.map((f) => [rotulo(f), f]))(
    "%s no ofrece un rubro que el alta no entrega",
    (_rotulo, ruta) => {
      const codigo = soloCodigo(readFileSync(ruta, "utf8"));
      const cuantosDelAlta = RUBROS_DEL_ALTA.filter((r) =>
        r.test(codigo),
      ).length;
      if (cuantosDelAlta < MINIMO_PARA_SER_LISTA) return;

      const ajenos = RUBROS_AJENOS.flatMap(
        (r) => codigo.match(new RegExp(r.source, "gi")) ?? [],
      );
      expect(
        ajenos,
        "enumera la oferta de rubros e incluye uno que el registro no ofrece: " +
          "el lead lo elige acá y no lo encuentra al registrarse",
      ).toEqual([]);
    },
  );
});
