import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { GRUPO, nombresConChatbot, planesPublicados, traeOTraen } from "@/lib/pricing";

/**
 * Ningún plan que el sitio PUBLICA CON PRECIO queda fuera de la respuesta «¿quién lo trae adentro?».
 *
 * 🔴 **EL DEFECTO, medido el 2026-09-19 contra `onia.com.bo` servida.** El catálogo publicado del
 * producto (`onia-platform/lib/plan-catalogo.ts`, ref `origin/master`) trae `whatsappIncluded:
 * true` en DOS planes: `clinic` y `enterprise`. Este sitio vende los dos — `clinic` es la tarjeta
 * «Completo» y `enterprise` es `GRUPO`, que se publica con su monto (Bs 2.900/mes, Bs 29.000 al
 * año) en una sección entera de `/precios`, en una línea de la home, en `/v1`, y que el
 * recomendador de `/v1/empezar` le propone a todo equipo de 15+. Pero `nombresConChatbot()` tenía
 * su universo puesto en `PLANES` —la escalera comprable en línea— así que contestaba «Completo» a
 * secas, y las cuatro superficies que la interpolan remataban con
 *
 *     «… ya trae el chatbot de WhatsApp incluido. **En los demás planes va aparte, Bs 390/mes**»
 *
 * Grupo / Empresarial es uno de "los demás planes". Al cliente del plan más caro le cobrábamos de
 * nuevo lo que ya paga adentro, en la FAQ de la home (que viaja también en el JSON-LD, o sea a
 * Google), en la FAQ de `/v1`, en el copy del add-on de la home y en el de `/precios`.
 *
 * 🔴 **POR QUE NINGUN GATE LO VEIA, incluido el que existe para esto.** `scripts/inclusion-chatbot.mjs`
 * cruza el catálogo del producto contra los textos del sitio y SI veía a `enterprise` — lo
 * degradaba a `AVISO` con el motivo «el sitio no lo nombra en ningún lado: no miente, pero no lo
 * está vendiendo». El motivo era falso y por eso absolvía: su lista de planes vendidos sale de
 * `PLANES_EN_ORDEN`, que empareja sitio↔producto por las CUATRO tarjetas del checkout, y el sitio
 * llama a `enterprise` «Grupo / Empresarial» y no «Empresa». Una exención cuyo motivo suena cierto
 * tapa el agujero igual.
 *
 * **QUE AFIRMA ESTE GATE, y por qué no es tautológico.** No compara `nombresConChatbot()` contra
 * la lista que `nombresConChatbot()` usa — eso serían dos lecturas del mismo espejo. Deriva el
 * universo del DISCO: cada literal de `src/lib/pricing.ts` que declara un monto mensual y el
 * booleano del chatbot es un plan publicado, los cuente quien los cuente. El plan que alguien
 * agregue mañana con su precio entra solo, y si `planesPublicados()` no lo toma, esto se pone
 * rojo antes de que la frase le mienta a nadie.
 *
 * La mitad del verbo va acá y no en una revisión a ojo por la misma razón: un sujeto plural con
 * «ya trae» en singular deja ambiguo si el segundo plan también lo trae, que es exactamente el
 * dato que la frase está contestando.
 */

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const FUENTE = path.join(AQUI, "pricing.ts");

/**
 * Los planes que el FUENTE publica con precio, leídos del texto.
 *
 * Un plan publicado es un literal con monto mensual en dígitos (la interfaz declara
 * `mensual: number`, que no es un monto) y su `chatbotIncluido`.
 *
 * ⚠️ El booleano se busca en el literal ENTERO —llaves balanceadas hacia atrás y hacia
 * adelante—, no «el primero después del monto». Esa versión ingenua fue lo primero que se
 * escribió y salió mal en el único sujeto que importa: `GRUPO` declara `chatbotIncluido` ARRIBA
 * de `mensual`, así que quedaba leído como `false` y el gate se ponía rojo contra el producto
 * sano. El orden de las llaves de un objeto no es un dato: preguntarle al literal sí.
 */
function planesPublicadosSegunElDisco(fuente = fs.readFileSync(FUENTE, "utf8")) {
  return [...fuente.matchAll(/^\s*mensual: (\d[\d_]*),/gm)].map((m) => {
    const literal = literalQueContiene(fuente, m.index ?? 0);
    return {
      mensual: Number(m[1]),
      chatbotIncluido: /\bchatbotIncluido: true\b/.test(literal),
      declaraElBooleano: /\bchatbotIncluido: (true|false)\b/.test(literal),
    };
  });
}

/** El `{ … }` que contiene esa posición, balanceando llaves en las dos direcciones. */
function literalQueContiene(fuente: string, pos: number): string {
  let nivel = 0;
  let abre = -1;
  for (let i = pos; i >= 0; i -= 1) {
    if (fuente[i] === "}") nivel += 1;
    else if (fuente[i] === "{") {
      if (nivel === 0) {
        abre = i;
        break;
      }
      nivel -= 1;
    }
  }
  if (abre === -1) return "";
  nivel = 0;
  for (let i = abre; i < fuente.length; i += 1) {
    if (fuente[i] === "{") nivel += 1;
    else if (fuente[i] === "}") {
      nivel -= 1;
      if (nivel === 0) return fuente.slice(abre, i + 1);
    }
  }
  return fuente.slice(abre);
}

describe("ningún plan publicado queda fuera de la respuesta sobre el chatbot", () => {
  it("el universo de planesPublicados() es el de los planes con precio del disco", () => {
    const delDisco = planesPublicadosSegunElDisco();
    const delModulo = planesPublicados();

    expect(
      delDisco.length,
      "el lector quedó sin sujetos: si cambió la forma de los literales, se arregla el lector",
    ).toBeGreaterThanOrEqual(2);
    // Un literal con precio al que el lector no le encuentra el booleano no se puede juzgar, y
    // callarlo sería contarlo como «no lo trae»: el falso verde exacto que este gate evita.
    for (const p of delDisco) {
      expect(
        p.declaraElBooleano,
        `el plan de Bs ${p.mensual}/mes no declara chatbotIncluido en su literal: no se puede juzgar`,
      ).toBe(true);
    }
    expect(
      delModulo.length,
      `src/lib/pricing.ts publica ${delDisco.length} planes con precio (montos: ` +
        `${delDisco.map((p) => p.mensual).join(", ")}) y planesPublicados() devuelve ` +
        `${delModulo.length}: el que falta no va a entrar en «los demás planes»`,
    ).toBe(delDisco.length);
  });

  it("todo plan publicado que trae el chatbot adentro queda NOMBRADO", () => {
    const traenSegunElDisco = planesPublicadosSegunElDisco().filter((p) => p.chatbotIncluido);
    const frase = nombresConChatbot();

    expect(traenSegunElDisco.length, "ningún plan declara el chatbot adentro: no hay sujeto").toBeGreaterThan(0);

    for (const plan of planesPublicados().filter((p) => p.chatbotIncluido)) {
      expect(
        frase,
        `"${plan.nombre}" trae el chatbot pagado adentro y nombresConChatbot() no lo nombra: ` +
          `las frases que siguen con «en los demás planes va aparte» le cobran Bs 390/mes otra vez`,
      ).toContain(plan.nombre);
    }
    expect(
      planesPublicados().filter((p) => p.chatbotIncluido).length,
      "el disco y el módulo no coinciden en cuántos planes traen el chatbot adentro",
    ).toBe(traenSegunElDisco.length);
  });

  /**
   * CASO ANCLA. El sujeto que el gate existe para no perder tiene que estar DENTRO del universo:
   * sin esto, un lector que se quedara sin ver a `GRUPO` haría pasar en verde a las dos
   * afirmaciones de arriba, que se cumplen solas sobre un universo recortado.
   */
  it("Grupo / Empresarial —que se publica con precio y no se compra en línea— está en el universo", () => {
    expect(GRUPO.mensual).toBeGreaterThan(0);
    expect(planesPublicados().map((p) => p.nombre)).toContain(GRUPO.nombre);
    expect(
      GRUPO.chatbotIncluido ? nombresConChatbot() : GRUPO.nombre,
      "Grupo trae el chatbot adentro (whatsappIncluded del catálogo publicado) y nadie lo nombra",
    ).toContain(GRUPO.nombre);
  });

  it("el verbo concuerda con cuántos planes lo traen", () => {
    const cuantos = planesPublicados().filter((p) => p.chatbotIncluido).length;
    expect(
      traeOTraen(),
      `${cuantos} plan(es) lo traen adentro: «${nombresConChatbot()} ya ${traeOTraen()}» no concuerda`,
    ).toBe(cuantos > 1 ? "traen" : "trae");
  });
});
