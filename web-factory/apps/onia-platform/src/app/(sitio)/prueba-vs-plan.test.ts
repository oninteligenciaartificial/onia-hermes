import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PLANES, PRUEBA } from "@/lib/pricing";

/**
 * La PRUEBA entrega un plan; la tarjeta vende otro. Eso se dice ANTES de pagar.
 *
 * Medido el 2026-09-06. `onia-platform/lib/subscription/plan-state.ts` fija
 * `TRIAL_PLAN = "professional"` (= Pro) y `app/api/auth/register/route.ts:272`
 * da de alta **toda** cuenta con ese plan: apriete el lead la tarjeta que
 * apriete, sus 14 días corren con el Pro. La tabla de precios no lo decía.
 *
 * Lo que le pasaba a quien elige el Básico —el plan más barato, o sea el
 * camino más transitado—:
 *  1. aprieta «Empezar» en Básico;
 *  2. usa 14 días con Pro: agentes de IA, reservas online, reportes completos,
 *     1.500 fichas y 5 usuarios;
 *  3. paga Bs 320;
 *  4. se le apagan los agentes, las reservas y los reportes, y los topes bajan
 *     a 300 fichas y 2 usuarios.
 * Y si durante la prueba cargó más de 300 fichas, `checkPatientLimit`
 * (`lib/plan-limits.ts:208`) deja de dejarlo crear: *«Tu plan permite hasta 300
 * pacientes activos. Tienes 800»*. La decepción llega **después de cobrar**,
 * que es el peor momento en el que puede llegar.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que hace nueva a esta clase:
 *  - no sobra ninguna palabra → invisible a `obra.test.ts`, `forma.test.ts`,
 *    `hueco-declarado.test.ts`;
 *  - los montos salen bien de la fuente → `precios.test.ts` y
 *    `precios-addons.test.ts` pasan en verde sobre el defecto;
 *  - no niega nada ni promete gente → invisible a `hueco-declarado.test.ts` y
 *    a `promesa-humana.test.ts`;
 *  - no le falta el límite a ninguna capacidad → invisible a
 *    `limite-que-corta.test.ts`.
 * Los ejes que la casa ya vigila son lo que SOBRA, lo que FALTA en cobertura y
 * la capacidad sin su límite. Éste es un cuarto: **lo que la prueba entrega no
 * es lo que la tarjeta vende**, y el desajuste sólo se descubre pagando.
 *
 * LO QUE LO MANTUVO ESCONDIDO, y por eso el caso `TIPEADA_A_MANO` existe: el
 * texto honesto **ya estaba escrito** en la fuente (`PRUEBA.copy`, que dice
 * «corriendo con el plan Pro completo»), y una sola pantalla lo leía
 * (`/empezar`). La tabla de precios —donde el lead ELIGE— tipeaba a mano
 * «corriendo con este mismo plan», y como esa nota se pintaba únicamente en la
 * tarjeta destacada, que es justo el Pro, el literal a mano era **cierto donde
 * se veía**. Un defecto que sólo miente en las tarjetas donde nadie lo escribió
 * no lo encuentra ningún barrido de literales: hay que preguntar por el par
 * (plan, nota).
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");

/**
 * Sujetos derivados del DISCO, no de una lista escrita a mano: así una pantalla
 * nueva nace cubierta y hay que excluirla a la vista. Es la corrección que ya
 * pagamos dos veces (`compartir.test.ts` sacaba sus rutas del sitemap;
 * `precios.test.ts` tenía cuatro raíces a mano y dejaba `app/v1/**` afuera).
 */
const EXENTOS = [
  join("lib", "pricing.ts"), // la fuente: acá SÍ vive el texto
];

function tsxDelSitio(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    if (entrada === "node_modules" || entrada.startsWith(".")) continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      tsxDelSitio(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada)) continue;
    if (/\.test\.tsx?$/.test(entrada)) continue;
    if (EXENTOS.some((e) => ruta.endsWith(e))) continue;
    acc.push(ruta);
  }
  return acc;
}

const PANTALLAS = tsxDelSitio(SRC);

/** Comentarios fuera: el que explica el defecto no puede DISPARAR el gate. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
}

describe("la prueba entrega un plan y la tarjeta vende otro: se dice antes de pagar", () => {
  it("hay pantallas que auditar (si esto da 0, el barrido se quedó sin sujetos)", () => {
    expect(PANTALLAS.length).toBeGreaterThan(10);
  });

  /**
   * Caso 1 — el texto de la prueba NO se tipea a mano en ninguna pantalla.
   * `PRUEBA` es la fuente; una copia a mano es libre de decir otra cosa, y eso
   * es exactamente lo que pasó.
   */
  it("ninguna pantalla tipea a mano la nota de la prueba", () => {
    const A_MANO = /\b\d+\s+d[ií]as\s+de\s+prueba\b|corriendo\s+con\s+este\s+mismo\s+plan/i;
    const culpables = PANTALLAS.filter((ruta) =>
      A_MANO.test(sinComentarios(readFileSync(ruta, "utf8"))),
    ).map((ruta) => relative(SRC, ruta));

    expect(
      culpables,
      `Estas pantallas escriben la nota de la prueba a mano en vez de leerla de ` +
        `PRUEBA (src/lib/pricing.ts). Una copia a mano puede contradecir a la ` +
        `fuente sin que nada se ponga rojo: ${culpables.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 2 — CADA plan comprable dice con qué plan corre su prueba.
   * El botón arranca la misma prueba en las tres tarjetas, así que las tres
   * tienen que decirlo; hoy la nota vivía detrás de `plan.destacado &&`.
   */
  it("cada plan tiene su nota de prueba, no sólo el destacado", () => {
    const sinNota = PLANES.filter((p) => !PRUEBA.notaPorPlan[p.id]).map((p) => p.nombre);

    expect(
      sinNota,
      `Estos planes no dicen con qué plan corre la prueba, y su botón arranca ` +
        `la misma prueba que el resto: ${sinNota.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 3 — «este mismo plan» sólo lo puede decir el plan que de verdad corre.
   * Es el par (plan, nota): el literal es copy legítimo en la tarjeta del Pro y
   * mentira en las otras dos, así que ningún barrido de literales lo puede
   * juzgar sin mirar de quién es la tarjeta.
   */
  it("sólo el plan que corre la prueba puede decir «este mismo plan»", () => {
    const mentirosos = PLANES.filter(
      (p) =>
        /este mismo plan/i.test(PRUEBA.notaPorPlan[p.id] ?? "") &&
        p.nombre !== PRUEBA.planQueCorre,
    ).map((p) => p.nombre);

    expect(
      mentirosos,
      `La prueba corre con el plan ${PRUEBA.planQueCorre}. Estas tarjetas dicen ` +
        `«este mismo plan» y no son ése: ${mentirosos.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 4 — el plan que NO corre la prueba nombra al que sí.
   * No alcanza con no mentir: si el lead va a recibir 14 días de otro nivel,
   * la tarjeta que está mirando tiene que nombrarlo.
   */
  it("el plan que no corre la prueba nombra al que sí", () => {
    const mudos = PLANES.filter((p) => {
      if (p.nombre === PRUEBA.planQueCorre) return false;
      const nota = PRUEBA.notaPorPlan[p.id] ?? "";
      return !nota.includes(PRUEBA.planQueCorre);
    }).map((p) => p.nombre);

    expect(
      mudos,
      `La prueba corre con ${PRUEBA.planQueCorre}. Estas tarjetas no lo nombran, ` +
        `así que su lead se entera al pagar: ${mudos.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 5 — el CAMINO, no sólo el dato.
   *
   * Este caso existe porque los cuatro de arriba no alcanzaban, y se descubrió
   * MUTANDO: con `notaPorPlan` completo y correcto, volver a envolver la nota
   * en `{plan.destacado && (…)}` dejaba dos tarjetas mudas otra vez y los 734
   * tests pasaban en VERDE. Es la trampa que la casa ya pagó tres veces
   * (`/requerimientos`, `/empresa`, `/rrhh`): **permiso concedido, camino
   * ausente**. Un gate que verifica el dato no ve la pantalla.
   *
   * Lo ideal sería renderizar el componente, pero el entorno de test de esta
   * app no procesa JSX (`rolldown` sin plugin de React), así que se mide la
   * estructura: dentro del pie de la tarjeta y ANTES del botón no puede haber
   * ninguna condición — ahí va la nota, y va para las tres. El botón sí usa
   * `destacado` para su etiqueta y su estilo, y queda fuera de la ventana.
   */
  it("la nota se pinta en las tres tarjetas, no detrás de una condición", () => {
    const pricing = readFileSync(
      join(SRC, "components", "landing-v1", "pricing.tsx"),
      "utf8",
    );

    const pie = pricing.match(/styles\.planCta[\s\S]*?<a\b/)?.[0];

    expect(
      pie,
      "No encontré el pie de la tarjeta (styles.planCta … <a). Si lo renombraste, " +
        "actualizá este gate: sin la ventana no mide nada y se queda ciego callado.",
    ).toBeDefined();

    expect(
      /destacado/.test(pie ?? ""),
      "La nota de la prueba está condicionada dentro del pie de la tarjeta. El " +
        "botón de los tres planes arranca la misma prueba: si la nota sólo se " +
        "pinta en el destacado, las otras dos tarjetas vuelven a callar que la " +
        `prueba corre con ${PRUEBA.planQueCorre} y su lead se entera al pagar.`,
    ).toBe(false);

    expect(
      /notaPorPlan\[plan\.id\]/.test(pie ?? ""),
      "El pie de la tarjeta no lee PRUEBA.notaPorPlan[plan.id].",
    ).toBe(true);
  });

  /**
   * ANCLA — un caso que YA cumple hoy.
   * La memoria de la casa (2026-09-06): un test de guarda escrito sólo contra
   * el caso que falla queda de adorno el día que alguien recorta el árbol. Si
   * `/empezar` deja de leer `PRUEBA.copy`, este caso lo dice.
   */
  it("/empezar sigue leyendo el copy de la prueba desde la fuente", () => {
    const empezar = readFileSync(join(SRC, "app", "(sitio)", "empezar", "page.tsx"), "utf8");
    expect(empezar).toMatch(/PRUEBA\.copy/);
  });

  /** El copy de la fuente nombra el plan que corre: si no, todo lo de arriba miente. */
  it("PRUEBA.copy nombra el plan con el que corre", () => {
    expect(PRUEBA.copy).toContain(PRUEBA.planQueCorre);
  });

  /**
   * Caso 6 — «el sistema completo» dejó de ser un adjetivo el 2026-09-12.
   *
   * Los cinco casos de arriba miran la TARJETA, donde el lead elige. Éste mira
   * la PROSA, que es donde el mismo desajuste volvió a entrar por otra puerta.
   *
   * QUÉ PASÓ. La escalera C (2026-09-12) metió un cuarto escalón y lo llamó
   * **Completo** (`NOMBRE_DE_PLAN.full`, Bs 1.290) — el único, con Empresa, que
   * trae el chatbot de WhatsApp adentro (`whatsappIncluded`). Desde ese día,
   * «usás el sistema completo esos 14 días» no es un adjetivo: nombra un plan,
   * y nombra justo el que la prueba NO da. La prueba corre con
   * `TRIAL_PLAN = "professional"` = Profesional (Bs 890), que lleva el chatbot
   * APARTE, Bs 390/mes.
   *
   * POR QUÉ IMPORTA, medido el 2026-09-18 sobre onia.com.bo servida: la portada
   * le dedica al chatbot una sección entera con su conversación de ejemplo y su
   * H2 («Tu WhatsApp responde las 24 horas»), y dos preguntas más abajo la misma
   * pantalla dice «Completo ya trae el chatbot incluido». El lead que lee
   * «usás el sistema completo» arranca la prueba esperando lo más publicitado
   * del sitio y no lo tiene. El hero de esa misma portada ya lo decía bien
   * («con el plan Profesional»): la pantalla se contradecía sola.
   *
   * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que lo hace una clase y no un typo:
   *  - no cambia ninguna cifra → `precios-fuente.mjs` cruza 40 montos en verde;
   *  - no TIPEA el nombre de un plan junto a una capacidad → invisible a
   *    `capacidad-incluida.test.ts`, que prohíbe exactamente eso;
   *  - «completo» es una palabra corriente del castellano, así que ningún
   *    barrido de nombres de plan la mira;
   *  - los casos 1-5 de este archivo preguntan por el par (plan, nota) de las
   *    tarjetas, y esto vive en la prosa de otras seis pantallas.
   *
   * LA FORMA, no el texto viejo. Se prohíbe el alcance total pegado al
   * SISTEMA; la forma honesta —«el plan <X> completo», que es la que
   * `PRUEBA.copy` ya usaba— no matchea, así que el gate no se apaga solo el día
   * que alguien reescriba la frase.
   *
   * EL ARTÍCULO NO ERA PARTE DE LA PROMESA — ampliado 2026-09-18, medido en
   * `onia.com.bo` servida. Las tres formas de abajo nacieron exigiendo «**el**
   * sistema completo», y un título de preview no lleva artículo: los dos
   * `openGraph.description` del trial decían «**Sistema completo**, sin
   * tarjeta» y el gate los daba por limpios el mismo día que se escribió para
   * esa frase. La mitad que quedó abierta es la peor de las dos: el `<head>`
   * no lo ve ninguna captura ni ningún barrido del cuerpo, y es exactamente lo
   * que se pinta en el preview de WhatsApp —por donde en Bolivia se comparte
   * todo— y en el resultado de Google. El lead lee «Sistema completo» ANTES de
   * abrir la página, que es donde decide si la abre.
   *
   * Por eso el artículo es opcional: lo que promete de más es el sustantivo
   * con su alcance, no el determinante que lo precede.
   */
  /**
   * El tope se DERIVA del precio, no del orden del arreglo ni de un id a mano:
   * es la misma lección que ya pagó `escalonAnterior` cuando entró el Crece.
   */
  const PLAN_TOPE = PLANES.reduce((a, b) => (b.mensual > a.mensual ? b : a));

  const ALCANCE_TOTAL_DEL_SISTEMA = [
    /\bsistema\s+(completo|entero)\b/i,
    /\bplataforma\s+completa\b/i,
    /\btodo\s+el\s+sistema\b/i,
    /\blo\s+us[áa]s?\s+completo\b/i,
  ];

  it("ninguna pantalla promete «el sistema completo»: la prueba entrega un plan, no todos", () => {
    const culpables = PANTALLAS.filter((ruta) => {
      const codigo = sinComentarios(readFileSync(ruta, "utf8"));
      return ALCANCE_TOTAL_DEL_SISTEMA.some((forma) => forma.test(codigo));
    }).map((ruta) => relative(SRC, ruta));

    expect(
      culpables,
      `Un plan se llama «${PLAN_TOPE.nombre}» y la prueba NO lo da: corre ` +
        `con ${PRUEBA.planQueCorre}. Estas pantallas prometen el alcance total ` +
        `del sistema sin decir de qué plan hablan, así que prometen el de ` +
        `arriba: ${culpables.join(", ")}. La forma honesta es «el plan ` +
        `\${PRUEBA.planQueCorre} completo» (la que usa PRUEBA.copy).`,
    ).toEqual([]);
  });

  /**
   * Caso 7 — la MISMA promesa, dicha sobre las PARTES en vez de sobre el todo.
   *
   * El caso 6 prohíbe el alcance total del SISTEMA («el sistema completo»,
   * «toda la plataforma»). Su hermana se escribe cuantificando los PEDAZOS —
   * «con todos los módulos encendidos»— y no matchea ninguna de sus cuatro
   * formas: no dice «sistema», no dice «plataforma», no tipea un plan y no
   * mueve una cifra. O sea que pasaba por el medio de las tres familias de
   * gates de este sitio, igual que su hermana el día que se escribió el 6.
   *
   * MEDIDO el 2026-09-18 sobre producción. `onia.com.bo/empezar` —la última
   * pantalla antes del registro— abría su párrafo principal con «No es una
   * demo recortada: es tu cuenta real, con todos los módulos encendidos», y
   * `/v1/prueba-gratis` repetía la frase palabra por palabra. La prueba corre
   * con `TRIAL_PLAN = "professional"`, y en el catálogo publicado del producto
   * (`onia-platform lib/plan-catalogo.ts`, leído de `origin/master`) ese plan
   * tiene `whatsappIncluded: false` y `multiAdminIncluded: false`. Dos módulos
   * apagados, y ninguno es menor: el chatbot es lo más publicitado del sitio
   * —sección propia en la portada, página propia, Bs 390/mes aparte— y el
   * segundo administrador es lo que el producto EMPEZÓ a cobrar por plan el
   * 2026-09-17 (DG-043). El lead con equipo lee «todos los módulos
   * encendidos», se registra, e invita a alguien: no puede.
   *
   * LA PANTALLA SE CONTRADECÍA SOLA, que es lo que lo vuelve barato de ver y
   * caro de dejar: tres líneas más abajo, el mismo `/empezar` ya dice la
   * versión honesta y ACOTADA —«Todo encendido: caja, inventario,
   * contabilidad, la cola de agentes y la agenda …»—, que enumera y por eso no
   * promete de más. El daño no es el adjetivo: es el cuantificador.
   *
   * LA FORMA, no el texto viejo. Se prohíbe el universal aplicado a las partes
   * del sistema. Las dos salidas honestas siguen pasando: ENUMERAR lo que se
   * enciende, o NOMBRAR el plan («el plan ${PRUEBA.planQueCorre} completo»).
   * Por eso tampoco toca a `full`, cuyo salto de valor ES «Todo incluido»: ese
   * plan sí los trae todos, y prohibir el texto viejo en vez de la forma
   * apagaría el gate justo el día que la respuesta correcta sea esa.
   */
  const ALCANCE_TOTAL_DE_LAS_PARTES = [
    /\btod[oa]s\s+l[oa]s\s+(m[oó]dulos|funciones|funcionalidades|herramientas|capacidades|add-?ons)\b/i,
  ];

  it("ninguna pantalla promete «todos los módulos»: la prueba enciende los de un plan", () => {
    const culpables = PANTALLAS.filter((ruta) => {
      const codigo = sinComentarios(readFileSync(ruta, "utf8"));
      return ALCANCE_TOTAL_DE_LAS_PARTES.some((forma) => forma.test(codigo));
    }).map((ruta) => relative(SRC, ruta));

    expect(
      culpables,
      `La prueba corre con ${PRUEBA.planQueCorre}, que NO enciende todos los ` +
        `módulos: el chatbot de WhatsApp y el segundo administrador los trae ` +
        `${PLAN_TOPE.nombre}. Estas pantallas prometen el alcance total sobre ` +
        `las partes: ${culpables.join(", ")}. Las dos salidas honestas son ` +
        `ENUMERAR lo que se enciende, o nombrar el plan.`,
    ).toEqual([]);
  });

  /**
   * TRIPWIRE del caso 6 — la regla de arriba se apoya en dos hechos del
   * producto, y los dos pueden cambiar. No se apaga sola en silencio: si
   * cambian, este caso se pone rojo y alguien decide.
   */
  it("sigue habiendo un plan por encima del que corre la prueba", () => {
    expect(
      PLAN_TOPE.nombre,
      "La prueba ya entrega el plan más caro. Si es a propósito, «el sistema " +
        "completo» volvió a ser cierto y el caso 6 sobra: borralo con este " +
        "comentario. Mientras no lo sea, dejarlo es lo que evita que la prosa " +
        "prometa el nivel de arriba.",
    ).not.toBe(PRUEBA.planQueCorre);
  });
});
