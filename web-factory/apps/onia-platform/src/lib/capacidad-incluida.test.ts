import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CAPACIDADES_INCLUIDAS,
  PLANES,
  primerPlanCon,
  type CapacidadIncluida,
} from "@/lib/pricing";

/**
 * Ningún texto del sitio TIPEA el nombre del plan desde el que una capacidad viene incluida.
 *
 * 🔴 **POR QUE NINGUN GATE PODIA VER ESTO.** El eje (capacidad, PLAN) ya tenía instrumento:
 * `scripts/precios-fuente.mjs` cruza «primer plan con agentes de IA» y «primer plan con reservas
 * online incluidas» contra el catálogo del producto, cada vuelta. Salía VERDE mientras el defecto
 * estaba vivo, y no por un bug: su detector del lado del sitio lee el campo `incluye` de las
 * tarjetas de `PLANES`, y ahí el dato estaba BIEN. Lo que el gate no podía expresar es que el
 * MISMO hecho se afirma en otras representaciones —el `copy` de un add-on, el H2 de una página
 * propia, una `description` que viaja a Google y a WhatsApp— y ésas no eran sujeto de nadie.
 *
 * Medido el 2026-09-13 sobre `onia.com.bo` SERVIDA, con `reducedMotion`:
 *
 *   - `/precios`, sección de add-ons: «Reservas online … Incluida en Pro y Full» — mientras la
 *     tarjeta del Crece, MAS ARRIBA EN LA MISMA PANTALLA, decía «Reservas online incluidas».
 *   - `/agentes`: «Los agentes vienen incluidos desde el plan Pro» en el H2, otra vez en el
 *     párrafo, otra vez en la `description`, y una cuarta en un comentario del archivo que lo
 *     daba por verificado contra `Pro.incluye`.
 *
 * Las cuatro eran falsas desde la escalera C (2026-09-12), que le dio `agentsIncluded` y
 * `publicBookingIncluded` al plan Crece: al lead se le pedían Bs 890 por lo que ya trae un plan
 * de Bs 550, y encima se le escondía el escalón de entrada que le servía.
 *
 * TRES DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **El sujeto es la MENCIÓN, derivada del disco** (`src/` entero, caminando la CARPETA), no
 *     una lista de pantallas: una página nueva que nombre la capacidad nace cubierta. Se camina
 *     el disco y no `git ls-files` porque el archivo recién escrito y sin commitear es justo el
 *     sujeto que hay que cazar.
 *  2. **Las capacidades salen de `CAPACIDADES_INCLUIDAS`**, que es el mapa del producto. Cuando
 *     el catálogo gane el cuarto booleano, el sujeto aparece solo: una lista escrita a mano acá
 *     sería la misma falla que el gate existe para impedir, un escalón más arriba.
 *  3. **Prohibido el literal, no «el literal equivocado»**. Un gate que exigiera «no digas Pro»
 *     se apaga solo el día que la respuesta correcta pase a ser Pro; y peor, se pone verde
 *     apenas alguien tipee el plan correcto a mano, que es el estado del que venimos. Lo que se
 *     prohíbe es TIPEAR cualquier nombre de plan junto a la capacidad: la respuesta se deriva.
 *
 * Se mide sobre el código SIN COMENTARIOS: si no, esta misma bitácora —que cita las frases
 * falsas para que se entiendan— pondría el gate rojo, y borrar el registro es como falla esta
 * familia.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..");

/** Cuánto texto alrededor del nombre del plan cuenta como «hablando de esta capacidad». */
const VENTANA = 130;

/**
 * Cómo se nombra cada capacidad en el copy. Una capacidad puede decirse de varias formas
 * ("agentes", "Recall"); todas cuentan, porque todas afirman el mismo hecho.
 */
const COMO_SE_DICE: Record<CapacidadIncluida, RegExp> = {
  agentes: /\bagentes?\b|\bRecall\b|\bCobrador\b/i,
  reservas: /reservas?\s+online|link\s+p[úu]blico|agenda\s+p[úu]blica/i,
  chatbot: /\bchatbot\b|\brecepcionista\b/i,
};

/** Las palabras que convierten una mención en una afirmación de INCLUSIÓN por plan. */
const AFIRMA_INCLUSION = /incluid[oa]s?|viene[n]?\s+(?:desde|en|con)|adentro\s+del\s+plan|ya\s+trae/i;

/** Los nombres de plan, como los lee el cliente. Salen del dato, no tipeados. */
const NOMBRES_DE_PLAN = PLANES.map((p) => p.nombre);

/**
 * Menciones que NO afirman desde qué plan viene la capacidad. Cada entrada se RE-MIDE contra el
 * archivo: si su fragmento dejó de estar donde dice, el gate se pone rojo — una excusa que sobra
 * termina bendiciendo lo que ya no existe.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [
  {
    archivo: join("lib", "pricing.ts"),
    fragmento: "El chatbot de WhatsApp — Full ya lo trae incluido",
    motivo:
      "es el `sinEsto` del Pro y lo deriva `nombresConChatbot()` en las superficies que contestan la pregunta; acá el nombre está en la línea que el propio plan declara con `chatbotIncluido`",
  },
];

/**
 * El literal que DECLARA la escalera queda fuera del barrido, y no por ser `lib/pricing.ts`: por
 * su ROL. Ahí cada tarjeta lleva su booleano (`agentesIncluidos`, `chatbotIncluido`…) en la misma
 * llave que su texto, así que el dato no está tipeado a ciegas — está al lado de su fuente. Es
 * además el único bloque con otro instrumento encima: `scripts/precios-fuente.mjs` cruza el
 * `incluye` de estas tarjetas contra el catálogo del producto, cada vuelta.
 *
 * El corte es por BLOQUE y no por archivo a propósito: el bug original (`copy` del add-on de
 * Reservas, «Incluida en Pro y Full») vivía en ESTE MISMO archivo, unas líneas más abajo, y una
 * exención por archivo lo habría dejado pasar. Si el bloque se renombra, el gate se pone rojo en
 * vez de barrer de más: un corte que no encuentra su ancla no puede seguir opinando.
 */
const DECLARA_LA_ESCALERA = {
  archivo: join("lib", "pricing.ts"),
  abre: "const ESCALERA: readonly Plan[] = [",
  cierra: "] as const;",
};

/** Quita comentarios de línea y de bloque respetando comillas: `https://` no es un comentario. */
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
      while (i < fuente.length && fuente[i] !== "\n") i += 1;
      continue;
    }

    if (par === "/*") {
      i += 2;
      // Se conservan los saltos de línea: la línea reportada tiene que seguir siendo la real.
      while (i < fuente.length && fuente.slice(i, i + 2) !== "*/") {
        if (fuente[i] === "\n") salida += "\n";
        i += 1;
      }
      i += 2;
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

interface Hallazgo {
  archivo: string;
  linea: number;
  capacidad: CapacidadIncluida;
  plan: string;
  contexto: string;
}

function tipeanElPlan(): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];

  for (const ruta of FUENTES) {
    const crudo = readFileSync(ruta, "utf8");
    const codigo = sinComentarios(crudo);
    const rel = relative(SRC, ruta);
    const exentosDeAqui = EXENTOS.filter((e) => e.archivo === rel);

    // El tramo que declara la escalera (ver `DECLARA_LA_ESCALERA`), si es este archivo.
    let declaraDesde = -1;
    let declaraHasta = -1;
    if (rel === DECLARA_LA_ESCALERA.archivo) {
      declaraDesde = codigo.indexOf(DECLARA_LA_ESCALERA.abre);
      declaraHasta =
        declaraDesde < 0 ? -1 : codigo.indexOf(DECLARA_LA_ESCALERA.cierra, declaraDesde);
    }
    const declarandoLaEscalera = (i: number) =>
      declaraDesde >= 0 && declaraHasta > declaraDesde && i > declaraDesde && i < declaraHasta;

    for (const plan of NOMBRES_DE_PLAN) {
      const buscador = new RegExp(`\\b${plan}\\b`, "g");
      let m: RegExpExecArray | null;
      while ((m = buscador.exec(codigo)) !== null) {
        if (declarandoLaEscalera(m.index)) continue;
        const desde = Math.max(0, m.index - VENTANA);
        const ventana = codigo.slice(desde, m.index + VENTANA);
        if (!AFIRMA_INCLUSION.test(ventana)) continue;

        for (const capacidad of Object.keys(COMO_SE_DICE) as CapacidadIncluida[]) {
          if (!COMO_SE_DICE[capacidad].test(ventana)) continue;
          if (exentosDeAqui.some((e) => ventana.includes(e.fragmento))) continue;
          hallazgos.push({
            archivo: rel,
            linea: codigo.slice(0, m.index).split("\n").length,
            capacidad,
            plan,
            contexto: ventana.replace(/\s+/g, " ").trim(),
          });
        }
      }
    }
  }

  return hallazgos;
}

describe("desde qué plan viene una capacidad: se deriva, no se tipea", () => {
  it("el barrido tiene sujetos (si no, el verde no significa nada)", () => {
    expect(FUENTES.length).toBeGreaterThan(40);
    expect(NOMBRES_DE_PLAN.length).toBe(PLANES.length);
    expect(Object.keys(COMO_SE_DICE).sort()).toEqual(
      Object.keys(CAPACIDADES_INCLUIDAS).sort(),
    );
  });

  it("cada capacidad del catálogo sabe decir desde qué plan viene", () => {
    for (const capacidad of Object.keys(CAPACIDADES_INCLUIDAS) as CapacidadIncluida[]) {
      const plan = primerPlanCon(capacidad);
      expect(plan, `${capacidad} no tiene ningún plan que la incluya`).toBeTruthy();
      expect(NOMBRES_DE_PLAN).toContain(plan);
    }
  });

  it("`primerPlanCon` responde por PRECIO, no por el orden del array", () => {
    // Un plan nuevo insertado al final pero más barato tiene que ganar: el orden del array no es
    // la escalera, el precio sí.
    const alRevés = [...PLANES].reverse();
    expect(primerPlanCon("agentes", alRevés)).toBe(primerPlanCon("agentes", PLANES));

    const conLaCapacidad = PLANES.filter((p) => p.agentesIncluidos);
    const masBarato = conLaCapacidad.reduce((a, b) => (a.mensual <= b.mensual ? a : b));
    expect(primerPlanCon("agentes")).toBe(masBarato.nombre);
  });

  it("`primerPlanCon` devuelve null si ningún plan la trae (no un texto roto)", () => {
    const ninguno = PLANES.map((p) => ({ ...p, agentesIncluidos: false }));
    expect(primerPlanCon("agentes", ninguno)).toBeNull();
  });

  it("el corte de la escalera encuentra su ancla (si no, barre de más o de menos en silencio)", () => {
    const fuente = readFileSync(join(SRC, DECLARA_LA_ESCALERA.archivo), "utf8");
    const abre = fuente.indexOf(DECLARA_LA_ESCALERA.abre);
    expect(abre, `no está «${DECLARA_LA_ESCALERA.abre}»: el corte por bloque dejó de tener sujeto`).toBeGreaterThan(-1);
    const cierra = fuente.indexOf(DECLARA_LA_ESCALERA.cierra, abre);
    expect(cierra).toBeGreaterThan(abre);

    // …y corta SOLO ese bloque: el `copy` de los add-ons, que es donde vivía el bug original,
    // queda DESPUES del cierre y por lo tanto sigue siendo sujeto del barrido.
    const addons = fuente.indexOf("export const ADDONS");
    expect(addons, "no está `ADDONS`").toBeGreaterThan(-1);
    expect(
      addons,
      "los add-ons quedaron dentro del bloque exento: el defecto que originó este gate volvería a pasar",
    ).toBeGreaterThan(cierra);
  });

  it("cada exención sigue existiendo donde dice (si no, sobra)", () => {
    for (const e of EXENTOS) {
      const fuente = readFileSync(join(SRC, e.archivo), "utf8");
      expect(
        fuente.includes(e.fragmento),
        `la exención de ${e.archivo} cita un fragmento que ya no está: «${e.fragmento}» — ${e.motivo}`,
      ).toBe(true);
    }
  });

  it("ninguna superficie tipea el plan junto a la capacidad", () => {
    const hallazgos = tipeanElPlan();
    const detalle = hallazgos
      .map(
        (h) =>
          `\n  ${h.archivo}:${h.linea} — dice «${h.plan}» sobre ${h.capacidad}. ` +
          `Hoy la respuesta es «${primerPlanCon(h.capacidad)}»: usá primerPlanCon("${h.capacidad}").` +
          `\n    …${h.contexto.slice(0, 190)}…`,
      )
      .join("");
    expect(hallazgos, `el plan desde el que viene una capacidad se DERIVA:${detalle}`).toEqual([]);
  });
});
