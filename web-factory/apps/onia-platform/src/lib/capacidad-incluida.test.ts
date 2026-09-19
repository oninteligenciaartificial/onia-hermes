import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CAPACIDADES_INCLUIDAS,
  PLANES,
  nombresConChatbot,
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
  /**
   * El cuarto booleano, 2026-09-18 — el caso que esta bitácora anunció ("cuando el catálogo gane
   * el cuarto booleano, el sujeto aparece solo") y que efectivamente apareció solo: agregar
   * `coadministradores` a `CAPACIDADES_INCLUIDAS` no compiló hasta declararlo acá.
   *
   * Se nombra ancho a propósito —cualquier mención de un administrador—, no sólo la frase de hoy:
   * lo que se prohíbe es tipear el plan junto a la afirmación, y una redacción nueva ("tu socio
   * entra como administrador desde Completo") tiene que caer adentro igual.
   */
  coadministradores: /\badministrador(?:es|a)?\b|\bcoadmin/i,
};

/**
 * Las palabras que convierten una mención en una afirmación de INCLUSIÓN por plan.
 *
 * ⚠️ `desde el plan …` / `a partir del plan …` entraron el 2026-09-17, y hasta ese día eran el
 * OTRO filtro a mano que tapaba el mismo defecto: aun viendo `plan("pro")` como sujeto, las tres
 * `description` falsas no afirmaban «incluidos» ni «vienen desde» — decían «desde el plan Pro»,
 * la forma más corta de decirlo, y quedaban absueltas. Dos predicados escritos a dedo, cada uno
 * dejando pasar lo que el otro no miraba.
 */
const AFIRMA_INCLUSION =
  /incluid[oa]s?|viene[n]?\s+(?:desde|en|con)|adentro\s+del\s+plan|ya\s+trae|desde\s+el\s+plan|a\s+partir\s+del\s+plan/i;

/** Los nombres de plan, como los lee el cliente. Salen del dato, no tipeados. */
const NOMBRES_DE_PLAN = PLANES.map((p) => p.nombre);

/**
 * Los campos de un plan que son una CIFRA, derivados del catálogo y no tipeados.
 *
 * Pedirle a un plan su monto (`plan("basico").mensual`) cotiza un precio — y esas cifras ya las
 * cruza `scripts/precios-fuente.mjs` contra el producto, cada vuelta. Pedirle su `nombre` es otra
 * cosa: pone el nombre de un plan CONCRETO en la pantalla del lead. Sin esta distinción el
 * barrido acusaba al `Desde Bs …` que abre la misma frase, porque la ventana los junta; y un
 * carve-out por archivo habría tapado el defecto real que vivía dos renglones después.
 */
const CAMPOS_DE_CIFRA = Object.entries(PLANES[0])
  .filter(([, valor]) => typeof valor === "number")
  .map(([campo]) => campo)
  .join("|");

/**
 * Las TRES formas de señalar un plan concreto a mano. Las tres son la misma decisión tipeada; la
 * segunda y la tercera apenas la esconden un escalón más adentro.
 *
 * ⚠️ **Corregido el 2026-09-17: este gate nació viendo sólo la primera y firmó verde tres
 * superficies vivas.** Su propia bitácora ya decía que lo prohibido es «TIPEAR cualquier nombre
 * de plan junto a la capacidad», pero el barrido buscaba el literal `\bPro\b`, así que
 * `plan("pro").nombre` —que produce exactamente ese texto en pantalla— era invisible. Medido
 * sobre `onia.com.bo` SERVIDA ese día, las tres decían «desde el plan Pro» (Bs 890) con el
 * Crece (Bs 550) trayendo `agentesIncluidos: true` desde la escalera C:
 *
 *   - `/v1`, `description` — la que viaja al preview de WhatsApp.
 *   - `/v1/modulos/dental`, `description` y `openGraph.description`.
 *
 * Y las tres vivían en páginas cuyo CUERPO decía «vienen desde Crece», derivado y correcto: la
 * misma pantalla se contradecía consigo misma, y la mitad falsa es justo la que no se ve
 * renderizada. Interpolar el nombre no es derivarlo — la pregunta es de dónde sale el ID.
 *
 * ⚠️ **La tercera entró el 2026-09-17 con `NOMBRE_DE_PLAN`**, el mapa que dejó de tipear los
 * nombres en `lib/pricing.ts` para que el sitio deje de llamar «Pro» y «Full» a lo que el
 * checkout cobra como «Profesional» y «Completo». Es una vía NUEVA de escribir el mismo defecto
 * —interpolar `NOMBRE_DE_PLAN.pro` pinta el mismo texto que `plan("pro").nombre`— y si el
 * barrido no la conoce, el gate se apaga solo justo donde su sujeto se mudó. Una cura que crea
 * una forma nueva de nombrar tiene que enseñársela, en la misma vuelta, a los gates de la clase.
 */
function referenciasAUnPlan(plan: (typeof PLANES)[number]): RegExp[] {
  return [
    new RegExp(`\\b${plan.nombre}\\b`, "g"),
    new RegExp(`plan\\(\\s*["'\`]${plan.id}["'\`]\\s*\\)\\s*\\.\\s*(?!${CAMPOS_DE_CIFRA})\\w`, "g"),
    new RegExp(`NOMBRE_DE_PLAN\\.${plan.id}\\b`, "g"),
  ];
}

/**
 * Menciones que NO afirman desde qué plan viene la capacidad. Cada entrada se RE-MIDE contra el
 * archivo: si su fragmento dejó de estar donde dice, el gate se pone rojo — una excusa que sobra
 * termina bendiciendo lo que ya no existe.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; fragmento: string; motivo: string }> = [
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

    for (const plan of PLANES) {
      for (const buscador of referenciasAUnPlan(plan)) {
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
              plan: plan.nombre,
              contexto: ventana.replace(/\s+/g, " ").trim(),
            });
          }
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

  it("el barrido reconoce las DOS formas de tipear un plan, no sólo el nombre literal", () => {
    // Caso ancla contra la regresión que este gate ya tuvo: durante cuatro días buscó únicamente
    // `\bPro\b` y firmó verde tres `description` vivas que decían «desde el plan Pro» vía
    // `plan("pro").nombre`. Si alguien vuelve a simplificar `referenciasAUnPlan`, esto se pone
    // rojo ANTES de que el falso verde llegue a producción.
    const pro = PLANES.find((p) => p.id === "pro")!;
    const conIdTipeado = `Agentes con IA, desde el plan \${plan("pro").nombre}.`;
    // El nombre literal se DERIVA del plan: tipearlo acá ataba el caso al nombre de ese día
    // («Pro»), y dejaba al gate sin ancla el día que ese plan pasó a llamarse «Profesional».
    const conNombreTipeado = `Agentes con IA, incluidos desde ${pro.nombre}.`;
    const conMapaDeNombres = "Agentes con IA, incluidos desde ${NOMBRE_DE_PLAN.pro}.";
    const soloElPrecio = `Agentes con IA. Desde Bs \${bs(plan("basico").mensual)}/mes.`;

    const caza = (texto: string) =>
      referenciasAUnPlan(pro).some((re) => {
        re.lastIndex = 0;
        return re.test(texto);
      });

    expect(caza(conIdTipeado), "`plan(\"pro\").nombre` tiene que ser sujeto").toBe(true);
    expect(caza(conNombreTipeado), "el nombre literal tiene que seguir siendo sujeto").toBe(true);
    expect(
      caza(conMapaDeNombres),
      "`NOMBRE_DE_PLAN.pro` pinta el mismo texto en pantalla: es sujeto",
    ).toBe(true);

    // Y la otra dirección: pedirle el MONTO a un plan no es nombrarlo. Sin esto, el gate se
    // vuelve ruidoso contra el `Desde Bs …` que abre casi todas estas frases y termina exento
    // por archivo, que es como esta familia deja de mirar el defecto real.
    const basico = PLANES.find((p) => p.id === "basico")!;
    const cazaBasico = referenciasAUnPlan(basico).some((re) => {
      re.lastIndex = 0;
      return re.test(soloElPrecio);
    });
    expect(cazaBasico, "cotizar un precio no es atribuir una capacidad a un plan").toBe(false);
    expect(CAMPOS_DE_CIFRA.split("|")).toContain("mensual");
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

/**
 * El hermano SIMÉTRICO del gate de arriba: no tipear el plan es media verdad; la otra mitad es
 * no NEGARLO con un universal.
 *
 * 🔴 **POR QUE NINGUN GATE PODIA VER ESTO.** El gate de arriba prohíbe escribir el nombre de un
 * plan junto a una capacidad, y `scripts/inclusion-chatbot.mjs` cruza el espejo contra el ref
 * publicado del producto. Las dos preguntas se contestan sobre frases que NOMBRAN un plan. Una
 * frase que dice «cualquier plan» no nombra ninguno: es invisible para los dos, y afirma lo
 * contrario que el catálogo sin usar una sola palabra prohibida.
 *
 * Medido el 2026-09-18 MIRANDO `onia.com.bo` servida a 390 px:
 *
 *   - portada, sección del chatbot: «El asistente contesta al instante … Se suma a cualquier plan.»
 *   - `lib/pricing.ts`, `copy` del add-on — el mismo texto que pinta `/precios` y `/chatbot`.
 *   - portada y `/precios`, el kicker que rotula la sección de add-ons entera.
 *
 * …con `whatsappIncluded: true` en Full y Grupo desde la escalera C (12-sep). Al dueño de un
 * Completo (Bs 1.290) le ofrecía pagar Bs 390 por lo que su plan ya trae, y al que evaluaba subir
 * de Profesional (Bs 890) le escondía el mejor argumento de la escalera: subiendo Bs 400 deja de
 * pagar 390.
 *
 * El gate pregunta por la FORMA, no por el texto viejo: «se suma / se agrega / se prende» + «a
 * cualquier plan / a todos los planes». Prohibir el literal de hoy se apaga solo el día que
 * alguien lo escriba con otras palabras.
 */
const SE_SUMA = /\bse\s+(?:suma|suman|agrega|agregan|a[ñn]ade|a[ñn]aden|prende|prenden|contrata|contratan)\b/i;

/** «a cualquier plan», «en todos los planes», «sobre cualquiera de los planes». */
const A_CUALQUIER_PLAN =
  /\b(?:a|en|sobre|con)\s+(?:cualquier(?:a\s+de\s+los)?|todos?\s+los|cada\s+uno\s+de\s+los)\s+(?:plan|planes)\b/i;

/** Cuánto texto ANTES del universal cuenta como la misma afirmación. */
const VENTANA_UNIVERSAL = 90;

/** `true` si al menos una capacidad del catálogo viene incluida en algún plan. */
function hayInclusionPorPlan(planes: readonly (typeof PLANES)[number][] = PLANES): boolean {
  return (Object.keys(CAPACIDADES_INCLUIDAS) as CapacidadIncluida[]).some(
    (c) => primerPlanCon(c, planes) !== null,
  );
}

/** Las frases que afirman que algo se suma a CUALQUIER plan. Vacío = ninguna. */
function niegaLaInclusion(fuentes: readonly string[] = FUENTES): Hallazgo[] {
  if (!hayInclusionPorPlan()) return [];
  const hallazgos: Hallazgo[] = [];

  for (const ruta of fuentes) {
    const codigo = sinComentarios(readFileSync(ruta, "utf8"));
    const buscador = new RegExp(A_CUALQUIER_PLAN.source, "gi");
    let m: RegExpExecArray | null;
    while ((m = buscador.exec(codigo)) !== null) {
      const antes = codigo.slice(Math.max(0, m.index - VENTANA_UNIVERSAL), m.index + m[0].length);
      if (!SE_SUMA.test(antes)) continue;
      hallazgos.push({
        archivo: relative(SRC, ruta),
        linea: codigo.slice(0, m.index).split("\n").length,
        capacidad: "chatbot",
        plan: "cualquiera",
        contexto: antes.replace(/\s+/g, " ").trim(),
      });
    }
  }

  return hallazgos;
}

describe("«se suma a cualquier plan»: el universal que la inclusión por plan vuelve falso", () => {
  it("el detector caza la frase que estaba viva, y deja pasar la que sí es cierta", () => {
    const viva = "y pasa a una persona lo que necesite decisión. Se suma a cualquier plan.";
    const kicker = "<Kicker>Se suma a cualquier plan</Kicker>";
    const otraForma = "El chatbot se agrega en todos los planes.";
    // La que SÍ es cierta y vive hoy en `landing-v1/chatbot-cta.tsx`: gratis en todos no afirma
    // que se sume. Sin esta dirección el gate se vuelve ruidoso y termina exento por archivo.
    const legitima = "El botón de WhatsApp de tu web va gratis en cualquier plan.";
    // Y la cura: nombra la inclusión y sólo después dice que se suma. No lleva universal.
    const curada = "Viene incluido en Full y Grupo; sobre los demás planes se suma aparte.";

    const caza = (texto: string) => {
      const re = new RegExp(A_CUALQUIER_PLAN.source, "gi");
      const m = re.exec(texto);
      if (!m) return false;
      return SE_SUMA.test(texto.slice(Math.max(0, m.index - VENTANA_UNIVERSAL), m.index + m[0].length));
    };

    expect(caza(viva), "la frase medida en producción tiene que ser sujeto").toBe(true);
    expect(caza(kicker), "el kicker rotula la sección entera: también es sujeto").toBe(true);
    expect(caza(otraForma), "el gate pregunta por la FORMA, no por el literal de hoy").toBe(true);
    expect(caza(legitima), "«va gratis en cualquier plan» no afirma que se sume").toBe(false);
    expect(caza(curada), "la cura derivada no puede acusarse a sí misma").toBe(false);
  });

  it("si ningún plan trae la capacidad adentro, el universal es cierto y el gate se apaga solo", () => {
    // El modo de falla de esta familia: un gate que sigue rojo cuando la respuesta correcta pasó
    // a ser la frase que prohíbe. La condición sale del catálogo, no de una fecha.
    // Los campos se APAGAN derivados del mapa, no tipeados uno por uno: con los tres escritos a
    // mano, el cuarto booleano (`coadministradores`, 2026-09-18) dejó este fixture representando
    // un escenario que ya no era "ningún plan la trae" — y el caso se puso rojo con el gate sano.
    // Un fixture con su propia lista de la misma cosa que el producto enumera envejece con él.
    const sinInclusion = PLANES.map((p) => ({
      ...p,
      ...Object.fromEntries(
        Object.values(CAPACIDADES_INCLUIDAS).map((campo) => [campo, false]),
      ),
    }));
    expect(hayInclusionPorPlan(sinInclusion)).toBe(false);
    expect(hayInclusionPorPlan()).toBe(true);
  });

  it("ninguna superficie dice que algo se suma a CUALQUIER plan", () => {
    const hallazgos = niegaLaInclusion();
    const detalle = hallazgos
      .map(
        (h) =>
          `\n  ${h.archivo}:${h.linea} — el chatbot viene incluido en ${nombresConChatbot()}: ` +
          `decírselo a «cualquier plan» le cobra de nuevo a quien ya lo paga.` +
          `\n    …${h.contexto.slice(0, 190)}…`,
      )
      .join("");
    expect(hallazgos, `lo que un plan ya trae adentro no «se suma»:${detalle}`).toEqual([]);
  });
});
