import { describe, expect, it } from "vitest";

import { recomendar, type Rubro, type Tiene } from "./recommend";
import { buildWaText } from "./whatsapp";

/**
 * La salida del asistente no le hace decir al lead que Onia está a medio hacer.
 *
 * `buildWaText` arma el mensaje de WhatsApp prellenado, que es la ÚNICA salida
 * real del wizard: el lead aprieta el botón y ese texto viaja tal cual al
 * teléfono de Sergio. No es una etiqueta en pantalla — es lo que el lead
 * *afirma sobre su propio negocio*, con su nombre arriba.
 *
 * El defecto que lo trajo: para todo rubro que no fuera dental, la rama de
 * abajo devolvía
 *
 *     "Hola, vengo del asistente de Onia. Mi rubro: una tienda o comercio
 *      (todavía en construcción). … Anótenme para que me avisen cuando esté."
 *
 * Dos veces obra a la vista —"en construcción" es literal de la regla de Sergio
 * del 2026-08-20— y en el peor lugar posible: puesta en boca del lead, al final
 * del embudo, convirtiendo a alguien que llenó cuatro pasos en un pedido de
 * lista de espera. *"Hace escapar a los clientes porque hacen creer que el
 * sistema no funciona."*
 *
 * Y encima se contradecía con la pantalla de esa MISMA rama: `NOTA_PROXIMAMENTE`
 * (`data.ts`) ya decía *"Este rubro lo armamos con vos, sobre el motor que ya
 * corre. Seguí: registramos tu caso y te contactamos con la propuesta armada."*
 * La pantalla prometía un motor andando y el mensaje que se enviaba desde esa
 * pantalla pedía que le avisaran cuando estuviera listo.
 *
 * ⚠️ **El gate recorre los rubros de la propia unión `Rubro` y arma la
 * recomendación con `recomendar()`**, no con un objeto a mano. Con un fixture
 * inventado, el día que `esRubroDisponible` cambie el gate seguiría midiendo la
 * rama que ya no existe y pasaría en verde sobre la nueva. Y con una lista de
 * rubros escrita acá, un rubro nuevo nacería sin gate.
 *
 * ⚠️ Esto NO toca la honestidad fiscal (`en trámite de homologación ante el
 * SIN`), que es deliberada y vive en el cuerpo de las páginas: ahí Onia declara
 * un límite legal real, y taparlo sería fabricar. Lo que acá está prohibido es
 * anunciar que el PRODUCTO está a medio construir.
 */

/** Los rubros de la unión `Rubro`, para que uno nuevo nazca cubierto. */
const RUBROS: Rubro[] = ["dental", "comercio", "servicios", "proveedores", "estetica"];

/** Frases que le dicen al lead "esto no está listo". */
const OBRA: { patron: RegExp; porque: string }[] = [
  { patron: /en construcci[oó]n/i, porque: "obra explícita, y es el literal de la regla" },
  { patron: /\bmuy pronto\b/i, porque: 'la banda de módulos tenía CINCO "muy pronto"' },
  { patron: /pr[oó]ximamente/i, porque: "es 'muy pronto' con otro traje" },
  { patron: /\bbeta\b/i, porque: "beta = 'todavía se rompe'" },
  { patron: /en desarrollo/i, porque: "lo que no está listo no se nombra" },
  { patron: /cuando est[eé]\b/i, porque: "pide lista de espera: admite que hoy no está" },
  { patron: /avisen cuando/i, porque: "convierte un lead caliente en un anotado" },
  { patron: /todav[ií]a no est[aá]/i, porque: "anuncia el hueco en boca del lead" },
];

describe("el mensaje que envía el asistente no exhibe obra", () => {
  it("los patrones detectan de verdad", () => {
    // Sin este ancla, romper un patrón dejaría el `it.each` de abajo pasando en
    // verde sobre cualquier cosa. Es el texto EXACTO que estuvo vivo.
    const vivo =
      "Hola, vengo del asistente de Onia. Mi rubro: una tienda o comercio " +
      "(todavía en construcción). Equipo: trabajo solo. Hoy tengo: nada todavía. " +
      "Anótenme para que me avisen cuando esté.";
    const pegan = OBRA.filter((f) => f.patron.test(vivo)).map((f) => f.patron.source);
    expect(pegan, "el gate dejó de reconocer el defecto que lo hizo nacer").toContain(
      "en construcci[oó]n",
    );
    expect(pegan, "el gate dejó de ver el pedido de lista de espera").toContain("avisen cuando");
  });

  it.each(RUBROS)("el mensaje de %s no anuncia que Onia está a medio hacer", (rubro) => {
    // El caso más desnudo: alguien que no tiene nada todavía. Es el que más
    // necesita creer que el sistema existe.
    const rec = recomendar(rubro, "solo", new Set<Tiene>(["nada"]), "");
    const texto = buildWaText(rubro, "solo", ["nada"], "", rec);
    const encontradas = OBRA.filter((f) => f.patron.test(texto));
    expect(
      encontradas.map((f) => `${f.patron.source} — ${f.porque}`),
      `el mensaje prellenado de "${rubro}" le hace decir al lead que Onia no está ` +
        `terminada. Ese texto sale del teléfono del lead con su nombre arriba:\n\n  ${texto}\n`,
    ).toEqual([]);
  });

  /**
   * Acá había un caso que forzaba a mano la rama sin plan (`{...rec, plan:
   * null}`) para vigilar el texto dormido que nadie podía ver. Ya no se puede
   * escribir: el 2026-09-06 `plan` dejó de ser nullable y la rama se eliminó
   * junto con el resto de la maquinaria de "próximamente" del wizard.
   *
   * El caso hacía lo correcto con lo que había, pero la lección de esa vuelta
   * fue que vigilar un texto invisible es la respuesta cara: se pudre igual
   * —hay que acordarse de auditarlo— y el arreglo siguiente lo hereda ya
   * aprobado. Lo barato es que el estado no pueda existir. Lo que queda de
   * guardia es el tipo, más `obra-en-la-pantalla.test.ts`, que falla si alguien
   * vuelve a listar un rubro no entregable.
   */
  it("todo rubro del wizard tiene plan: la rama sin plan no existe", () => {
    for (const rubro of RUBROS) {
      const rec = recomendar(rubro, "solo", new Set<Tiene>(["nada"]), "");
      expect(
        rec.plan?.nombre,
        `${rubro} se quedó sin plan: vuelve a hacer falta una rama para el ` +
          `rubro que no se puede contratar, y ahí es donde se pudre el texto`,
      ).toBeTruthy();
    }
  });
});
