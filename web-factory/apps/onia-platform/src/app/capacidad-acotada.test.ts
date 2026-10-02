import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALCANCE_AGENTE_COTIZACIONES,
  ALCANCE_AGENTE_STOCK,
  ALCANCE_CLINICO,
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_FICHA,
  ALCANCE_POR_DATOS,
  ALCANCE_POR_RUBRO,
} from "@/lib/pricing";

/**
 * Toda MENCIÓN de una capacidad acotada por rubro dice a qué rubros llega —
 * en cualquier superficie de venta, no sólo en la línea de un plan.
 *
 * 🔴 **Por qué ningún gate podía ver esto.** El eje (capacidad, RUBRO) ya tenía
 * dos instrumentos y los dos preguntan por la PANTALLA:
 *
 *  - `app/(sitio)/capacidad-por-rubro.test.ts` deriva sus sujetos de las líneas
 *    de `PLANES`. La página que VENDE la capacidad la describe rol por rol,
 *    fuera de `PLANES`, así que esas menciones no son sujeto de nadie.
 *  - `scripts/capacidad-por-rubro.mjs` cruza «¿el pack declara esta pantalla en
 *    su nav?». `/agents` está en el nav de los SIETE packs, así que da verde.
 *
 * Y el corte del Recall no es la pantalla: el rubro SÍ llega a `/agents`, lo que
 * le falta son los DATOS que el rol lee (`patient` + `appointment`). Con el
 * corte adentro de una pantalla que todos alcanzan, ninguno de los dos podía
 * siquiera expresar la pregunta. Medido el 2026-09-10: `onia.com.bo/agentes`
 * (200) le vendía el Recall a comercio y a importadora —2 de los 5 rubros que el
 * alta ofrece— con su propio comentario afirmando «Nada de esto es promesa:
 * existe», y el producto ya lo acotaba desde el 08-sep (`64279ff`), con el
 * arreglo gemelo hecho en la pantalla donde el cliente paga
 * (`lib/subscription/plan-display.ts`).
 *
 * TRES DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **El sujeto es la MENCIÓN, derivada del disco** (todo `src/`), no la línea
 *     de un plan: una página nueva que nombre la capacidad nace cubierta.
 *  2. **Cada capacidad exige SU PROPIA constante de alcance**, no cualquiera. En
 *     el `incluye` del Pro, «Agente Recall» y «Reportes completos» son bullets
 *     vecinos con alcances DISTINTOS: aceptar cualquiera dejaría que la salvedad
 *     del vecino absuelva a la de al lado, que es exactamente cómo un gate de
 *     esta casa se apagó con su propio arreglo (`promesa-fiscal.test.ts`).
 *  3. **Se exige el IDENTIFICADOR, no la frase tipeada.** Dos copias del mismo
 *     hecho es como llegó a haber cuatro precios vivos del mismo chatbot: el
 *     alcance se lee de `lib/pricing.ts` o no se escribe.
 *
 * Se mide sobre el código SIN COMENTARIOS: un gate que busca su literal en el
 * archivo entero se absuelve con la bitácora que explica por qué el literal va
 * —pasa en verde con el arreglo arrancado—, y al revés castiga a la bitácora que
 * narra el defecto y obliga a borrarla.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..");

/** Cuánto texto alrededor de la mención cuenta como «al lado». */
const VENTANA_ADELANTE = 320;
const VENTANA_ATRAS = 80;

/**
 * Las capacidades acotadas, cada una con la constante que dice SU alcance.
 * Los nombres salen del dato; lo único escrito acá es qué array usa qué frase,
 * y cada array tiene exactamente una.
 */
const ACOTADAS = [
  ...ALCANCE_POR_RUBRO.map((c) => ({
    capacidad: c.capacidad,
    constante: "ALCANCE_CLINICO",
    frase: ALCANCE_CLINICO,
  })),
  ...ALCANCE_POR_DATOS.map((c) => ({
    capacidad: c.capacidad,
    constante: "ALCANCE_CON_FICHA",
    frase: ALCANCE_CON_FICHA,
  })),
  /*
   * Los otros agentes que el producto acota por rubro (29-sep-2026, cuando los
   * agentes pasaron a nombrarse por lo que hacen). El porqué de cada corte vive
   * junto a las constantes en `lib/pricing.ts`. «Recuerda cobros» no entra:
   * corre en todos los rubros.
   */
  { capacidad: "Confirma citas", constante: "ALCANCE_CON_AGENDA", frase: ALCANCE_CON_AGENDA },
  { capacidad: "Reprograma", constante: "ALCANCE_CON_AGENDA", frase: ALCANCE_CON_AGENDA },
  { capacidad: "Avisa stock bajo", constante: "ALCANCE_AGENTE_STOCK", frase: ALCANCE_AGENTE_STOCK },
  {
    capacidad: "Sigue cotizaciones",
    constante: "ALCANCE_AGENTE_COTIZACIONES",
    frase: ALCANCE_AGENTE_COTIZACIONES,
  },
];

/**
 * Menciones que NO son una promesa al lead. Cada entrada se RE-MIDE: si su
 * fragmento dejó de estar donde dice, el gate se pone rojo — una excusa que
 * sobra es como una lista blanca queda bendiciendo lo que ya no existe.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [
  // Vacío desde el 2026-09-29. Las cinco excusas que había eximían «Recall» en
  // `landing-v1/` y `v1/modulos/dental`: el agente ya no se llama así en la
  // venta, y esas páginas redirigen a la portada (308, `next.config.ts`).
];

/** Quita comentarios respetando comillas: `https://` no es un comentario. */
function sinComentarios(fuente: string): string {
  let salida = "";
  let i = 0;
  let comilla: string | null = null;

  while (i < fuente.length) {
    const c = fuente[i];
    const par = fuente.slice(i, i + 2);

    if (comilla) {
      if (c === "\\") {
        salida += fuente.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === comilla) comilla = null;
      salida += c;
      i += 1;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      comilla = c;
      salida += c;
      i += 1;
      continue;
    }

    if (par === "//") {
      const fin = fuente.indexOf("\n", i);
      i = fin === -1 ? fuente.length : fin;
      continue;
    }

    if (par === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
      // Se reemplaza por espacios: así las distancias de la ventana no se
      // encogen y un bloque largo no acerca artificialmente a dos menciones.
      const hasta = fin === -1 ? fuente.length : fin + 2;
      salida += " ".repeat(hasta - i);
      i = hasta;
      continue;
    }

    salida += c;
    i += 1;
  }

  return salida;
}

function fuentesDeVenta(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      fuentesDeVenta(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    acc.push(ruta);
  }
  return acc;
}

const FUENTES = fuentesDeVenta(SRC);

type Mencion = {
  archivo: string;
  capacidad: string;
  constante: string;
  linea: string;
  ventana: string;
};

/** Toda mención viva, ya sin comentarios ni la línea que DEFINE el dato. */
function mencionesVivas(): Mencion[] {
  const salida: Mencion[] = [];

  for (const ruta of FUENTES) {
    const limpio = sinComentarios(readFileSync(ruta, "utf8"));

    for (const acotada of ACOTADAS) {
      let desde = 0;
      for (;;) {
        const i = limpio.indexOf(acotada.capacidad, desde);
        if (i === -1) break;
        desde = i + acotada.capacidad.length;

        const arranqueLinea = limpio.lastIndexOf("\n", i) + 1;
        const finLinea = limpio.indexOf("\n", i);
        const linea = limpio.slice(arranqueLinea, finLinea === -1 ? limpio.length : finLinea);

        // La declaración del propio dato no es una promesa al lead.
        if (/capacidad:\s*["'`]/.test(linea)) continue;

        salida.push({
          archivo: relative(SRC, ruta),
          capacidad: acotada.capacidad,
          constante: acotada.constante,
          linea: linea.trim(),
          ventana: limpio.slice(Math.max(0, i - VENTANA_ATRAS), i + VENTANA_ADELANTE),
        });
      }
    }
  }

  return salida;
}

const exenta = (m: Mencion) =>
  EXENTOS.some((e) => m.archivo.endsWith(e.archivo) && m.linea.includes(e.fragmento));

describe("una capacidad acotada por rubro dice a qué rubros llega, la nombre quien la nombre", () => {
  it("hay algo que vigilar: el dato declara capacidades acotadas y el sitio las nombra", () => {
    // Ancla. Sin esto, vaciar `ALCANCE_POR_DATOS` —o que el barrido deje de
    // encontrar archivos— dejaría el gate verde sin haber medido nada, que es
    // como esta familia de gates falla ABIERTO.
    expect(ACOTADAS.length, "no hay ninguna capacidad acotada declarada").toBeGreaterThan(0);
    expect(FUENTES.length, "el barrido de src/ encontró casi nada").toBeGreaterThan(50);
    expect(
      mencionesVivas().length,
      "ninguna superficie nombra una capacidad acotada: el barrido no está midiendo",
    ).toBeGreaterThan(3);
  });

  it("cada mención lleva SU constante de alcance al lado", () => {
    const mudas = mencionesVivas()
      .filter((m) => !exenta(m))
      .filter((m) => !m.ventana.includes(m.constante));

    expect(
      mudas.map((m) => `${m.archivo} — «${m.capacidad}» sin ${m.constante}: ${m.linea}`),
      "una superficie de venta nombra una capacidad que el producto acota por rubro y no dice a cuáles llega",
    ).toEqual([]);
  });

  it("la salvedad del vecino no absuelve: cada capacidad exige la suya", () => {
    // El `incluye` del Pro tiene «Agente Recall» y «Reportes completos» como
    // bullets vecinos con alcances distintos. Si el gate aceptara cualquier
    // constante, cada uno taparía al otro.
    const constantes = new Set(ACOTADAS.map((a) => a.constante));
    expect(constantes.size, "todas las capacidades comparten una sola frase de alcance").toBeGreaterThan(1);

    for (const m of mencionesVivas().filter((x) => !exenta(x))) {
      const ajenas = [...constantes].filter((c) => c !== m.constante);
      const soloAjena = m.ventana.includes(m.constante) === false && ajenas.some((c) => m.ventana.includes(c));
      expect(soloAjena, `${m.archivo}: «${m.capacidad}» quedaría absuelta por el alcance de otra capacidad`).toBe(false);
    }
  });

  it("el alcance se LEE de pricing.ts: no se tipea la frase a mano", () => {
    const aMano = mencionesVivas()
      .filter((m) => !exenta(m))
      .filter((m) => !m.ventana.includes(m.constante))
      .filter((m) => {
        const frase = ACOTADAS.find((a) => a.constante === m.constante)?.frase ?? "";
        return frase.length > 0 && m.ventana.includes(frase);
      });

    expect(
      aMano.map((m) => `${m.archivo}: ${m.linea}`),
      "la frase del alcance está tipeada a mano en vez de leerse de la constante",
    ).toEqual([]);
  });

  it("ninguna excusa sobra: cada exento sigue existiendo donde dice", () => {
    const sobrantes = EXENTOS.filter(
      (e) => !mencionesVivas().some((m) => m.archivo.endsWith(e.archivo) && m.linea.includes(e.fragmento)),
    );

    expect(
      sobrantes.map((e) => `${e.archivo}: «${e.fragmento}» — ${e.motivo}`),
      "un exento dejó de existir: la excusa quedó bendiciendo algo que ya no está",
    ).toEqual([]);
  });
});
