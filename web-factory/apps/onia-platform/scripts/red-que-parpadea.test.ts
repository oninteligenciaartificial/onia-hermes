import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { INTENTOS, esParpadeo, traer } from "./red-que-parpadea.mjs";

/**
 * Ningun medidor vivo de este carril se rinde en el primer pedido.
 *
 * QUE SE ROMPIO, medido el 2026-09-27 01:0x La Paz desde nodo-casa, corriendo los once
 * medidores del carril en fila:
 *
 *   rubros:vivos exit=2 — NO PUDE MEDIR: el alta (https://app.onia.com.bo/register)
 *                         no contesto — fetch failed.
 *
 * Noventa segundos despues el MISMO comando salio `VERDE: los 5 rubros que entrega el alta
 * son los 5 que vende el sitio`, y `curl` al mismo URL contestaba `200` en 0,93 s. El alta
 * estaba viva: el gate se rindio en el primer intento.
 *
 * POR QUE ES UNA CLASE Y NO UN OLVIDO. El `exit 2` es honesto —no pudo preguntar, no
 * miente—, pero el carril PIERDE la medicion y nadie se entera, porque la vuelta siguiente
 * sale verde. Un `NO MEDIDO` intermitente es peor que uno permanente: el permanente se ve
 * siempre igual, el intermitente se lee como "el ambiental de siempre" y se saltea. Y los dos
 * gates que mas expuestos estan son justo los que hacen cumplir las dos reglas escritas de
 * Sergio Urcullo —`obra:viva` (la venta no exhibe obra) y `titular:sistema` (la home vende el
 * sistema, no el bot)— porque barren 24 pantallas cada uno: 24 pedidos por corrida es 24
 * veces la exposicion de un pedido suelto.
 *
 * COMO NO FALLA EN VERDE. Los sujetos salen del DISCO: cualquier `scripts/*.mjs` que pida a
 * la red nace cubierto, y eximirlo cuesta escribir su motivo a la vista. Ademas se exige que
 * el barrido haya ENCONTRADO sujetos: si el glob queda vacio (se renombro la carpeta, cambio
 * la extension), "ninguno sin cura" se leeria como sano, y asi es exactamente como esta
 * familia de gates miente.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const CURA = "red-que-parpadea.mjs";

/**
 * Lo que puede pedirle a la red sin pasar por la cura, con su motivo. De a UNO y por nombre:
 * eximir por categoria tapa un arbol entero la proxima vez y el gate sale verde igual.
 */
const EXENTOS: Record<string, string> = {
  [CURA]:
    "es la cura: su `pedir = deps.fetch ?? fetch` ES el unico fetch pelado que debe quedar " +
    "en scripts/. Lo cubren los casos de esta misma suite, con un fetch de mentira.",
  "captura-viva.mjs":
    "su fetch NO corre en este proceso: viaja como texto a `docker exec <contenedor> node -e`, " +
    "donde este modulo no existe (el contenedor no monta scripts/). La cura del autoSelectFamily " +
    "va INLINE en ese programa; el reintento no, porque el gate ya es tri-estado y un null suyo " +
    "sale NO MEDIDO, nunca verde.",
  "intake-vivo.mjs":
    "mismo caso que captura-viva.mjs: el fetch viaja como texto a `docker exec ... node -e` y " +
    "corre dentro del contenedor, donde este modulo no existe. Cura inline en el programa; su " +
    "`catch(() => 0)` ya significa NO PUDE MEDIR, no un veredicto.",
};

/**
 * El corazon, puro: dados los archivos y sus fuentes, cuales piden a la red sin la cura.
 *
 * ⚠️ Los COMENTARIOS se quitan ANTES de buscar. Sin eso el gate se lee a si mismo al reves:
 * todos estos scripts explican en su cabecera por que usan `fetch`, asi que un `grep` del
 * literal los declararia a todos culpables — y peor, un script ya curado que MENCIONE `fetch`
 * en una nota seguiria saliendo rojo para siempre. Medido el 2026-09-24 en este mismo carril
 * con `barra-sobre-hero-se-lee.test.ts`, que partia menu.tsx por `<dialog` y cortaba en el
 * comentario que explicaba `<dialog>`: el sujeto real quedaba del lado que no se medía.
 */
export function sinComentarios(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/** ¿El codigo (sin comentarios) llama a `fetch(` pelado? `deps.fetch` y `.fetch` no cuentan. */
export function pideALaRed(codigo: string): boolean {
  return /(^|[^.\w])fetch\s*\(/.test(codigo);
}

export function sinCura(
  archivos: { nombre: string; fuente: string }[],
  exentos: Record<string, string>,
): string[] {
  return archivos
    .filter(({ nombre }) => !(nombre in exentos))
    .filter(({ fuente }) => {
      const codigo = sinComentarios(fuente);
      if (!pideALaRed(codigo)) return false;
      return !codigo.includes(CURA);
    })
    .map(({ nombre }) => nombre);
}

const scriptsDelDisco = () =>
  readdirSync(AQUI)
    .filter((n) => n.endsWith(".mjs"))
    .map((nombre) => ({ nombre, fuente: readFileSync(join(AQUI, nombre), "utf8") }));

describe("el corazon, sin tocar la red", () => {
  it("un comentario que nombra fetch no hace culpable a nadie", () => {
    const soloComentario = { nombre: "x.mjs", fuente: "/* usa fetch(url) a proposito */\nexport const a = 1;\n" };
    expect(sinCura([soloComentario], {})).toEqual([]);
  });

  it("un fetch de verdad sin la cura sale nombrado", () => {
    const pelado = { nombre: "y.mjs", fuente: "const r = await fetch(url);\n" };
    expect(sinCura([pelado], {})).toEqual(["y.mjs"]);
  });

  it("el mismo fetch con la cura importada no sale", () => {
    const curado = {
      nombre: "z.mjs",
      fuente: `import { traer } from "./${CURA}";\nconst r = await traer(url);\n`,
    };
    expect(sinCura([curado], {})).toEqual([]);
  });

  it("una URL en un comentario de linea no arrastra el // de https://", () => {
    // El regex de comentarios de linea no debe comerse el resto de una URL.
    const conUrl = { nombre: "w.mjs", fuente: 'const u = "https://onia.com.bo/x";\nawait fetch(u);\n' };
    expect(sinCura([conUrl], {})).toEqual(["w.mjs"]);
  });
});

describe("esParpadeo distingue no-pude-preguntar de me-contestaron", () => {
  it("un fallo de transporte es parpadeo", () => {
    expect(esParpadeo(new TypeError("fetch failed"))).toBe(true);
  });

  it("el tope del llamador NO es parpadeo: reintentarlo falsea la medicion de tiempo", () => {
    const suyo = new Error("The operation was aborted");
    suyo.name = "AbortError";
    expect(esParpadeo(suyo)).toBe(false);
    const tope = new Error("timeout");
    tope.name = "TimeoutError";
    expect(esParpadeo(tope)).toBe(false);
  });
});

describe("traer reintenta el parpadeo y nada mas", () => {
  const sinEsperar = { dormir: async () => {}, avisar: () => {} };

  it("el pedido que parpadea una vez y despues contesta, se rescata", async () => {
    let n = 0;
    const falso = async () => {
      n += 1;
      if (n === 1) throw new TypeError("fetch failed");
      return { ok: true, status: 200 } as unknown as Response;
    };
    const r = await traer("https://x", {}, { ...sinEsperar, fetch: falso });
    expect(r.status).toBe(200);
    expect(n).toBe(2);
  });

  it("avisa cuando rescata: un rescate mudo vuelve invisible una red que falla 2 de 3", async () => {
    const dichas: string[] = [];
    let n = 0;
    const falso = async () => {
      n += 1;
      if (n === 1) throw new TypeError("fetch failed");
      return { ok: true, status: 200 } as unknown as Response;
    };
    await traer("https://x", {}, { ...sinEsperar, avisar: (l: string) => dichas.push(l), fetch: falso });
    expect(dichas.join("\n")).toMatch(/intento 2 de 3/);
  });

  it("una RESPUESTA no se reintenta: un 404 es el servidor contestando, no un parpadeo", async () => {
    let n = 0;
    const falso = async () => {
      n += 1;
      return { ok: false, status: 404 } as unknown as Response;
    };
    const r = await traer("https://x", {}, { ...sinEsperar, fetch: falso });
    expect(r.status).toBe(404);
    expect(n).toBe(1);
  });

  it("el tope del llamador no se reintenta", async () => {
    let n = 0;
    const falso = async () => {
      n += 1;
      const e = new Error("abortada");
      e.name = "AbortError";
      throw e;
    };
    await expect(traer("https://x", {}, { ...sinEsperar, fetch: falso })).rejects.toThrow();
    expect(n).toBe(1);
  });

  it("si parpadea siempre, tira con los intentos en el mensaje para que el NO MEDIDO diga por que", async () => {
    let n = 0;
    const falso = async () => {
      n += 1;
      throw new TypeError(`fetch failed ${n}`);
    };
    await expect(traer("https://x", {}, { ...sinEsperar, fetch: falso })).rejects.toThrow(
      /3 intento\(s\)[\s\S]*fetch failed 1[\s\S]*fetch failed 3/,
    );
    expect(n).toBe(INTENTOS);
  });
});

describe("los medidores vivos del carril, derivados del disco", () => {
  it("el barrido encuentra sujetos (si no, 'ninguno sin cura' seria un verde mudo)", () => {
    expect(scriptsDelDisco().length).toBeGreaterThan(10);
  });

  it("todo script que le pide a la red pasa por la cura", () => {
    const culpables = sinCura(scriptsDelDisco(), EXENTOS);
    expect(
      culpables,
      `estos scripts le piden a la red con \`fetch\` pelado: un parpadeo los manda a NO MEDIDO ` +
        `y el carril pierde la medicion sin que nada se ponga rojo. Importa ` +
        `{ traer } de ./${CURA} y usalo, o eximilo por nombre en EXENTOS con su motivo. ` +
        `Sujetos: ${culpables.join(", ")}`,
    ).toEqual([]);
  });

  it("cada exento tiene un motivo escrito, no una linea vacia", () => {
    for (const [nombre, motivo] of Object.entries(EXENTOS)) {
      expect(motivo.length, `${nombre} esta exento sin motivo`).toBeGreaterThan(40);
    }
  });

  it("no hay exento fantasma: eximir un archivo que ya no existe tapa al que lo reemplace", () => {
    const enDisco = new Set(scriptsDelDisco().map((a) => a.nombre));
    for (const nombre of Object.keys(EXENTOS)) {
      expect(enDisco.has(nombre), `${nombre} esta exento y no existe en disco`).toBe(true);
    }
  });
});
