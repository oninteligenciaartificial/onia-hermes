import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CHATBOT_PLAN } from "@/content/chatbot-precios";
import {
  PLANES,
  bs,
  cuentaEnPalabras,
  cuentaVsAddon,
  resultadoSegunCiclo,
} from "@/lib/pricing";

/**
 * La cuenta «este plan trae el chatbot adentro» se hace en el ciclo QUE LA TARJETA MUESTRA.
 *
 * 🔴 **EL DEFECTO, MIRADO el 2026-09-27 en `onia.com.bo` renderizada** (Chromium, clic en
 * «Anual», texto de la tarjeta leído — no un `grep`). Con el interruptor en Anual, la tarjeta
 * del Completo decía las tres cosas a la vez:
 *
 *     12.900  Bs / año
 *     Equivale a Bs 1.075 por mes
 *     Chatbot de WhatsApp incluido (500 conversaciones/mes): Bs 10 más al mes que
 *     Profesional con el add-on aparte.
 *
 * Y en anual la cuenta es OTRA: Profesional 8.900 + chatbot 3.900 = 12.800 contra 12.900, o sea
 * **Bs 100 más al año** — Bs 8 por mes, no Bs 10. El lead que hace la resta con los números que
 * la propia tarjeta le da (1.075 del Completo contra 742 + 325 del Profesional armado) obtiene 8
 * y lee 10. Las dos mitades de la misma tarjeta salían de ciclos distintos: el precio grande y el
 * «equivale a» del ANUAL, la comparación del MENSUAL.
 *
 * 🔴 **POR QUÉ NINGÚN GATE PODÍA VERLO.** Es la misma familia que `cuentaVsAddon` fue escrita
 * para cerrar el 2026-09-19 —el resultado de una cuenta entre montos legítimos, que ningún
 * instrumento de montos suma— y la cura **cubrió un solo ciclo**. Los tres sumandos anuales
 * (8.900, 3.900, 12.900) salen de la fuente, así que `precios:vivos` y `precios:fuente` siguen
 * verdes; `cuenta-vs-addon-no-se-tipea.test.ts` compara contra `plan.resultado`, que es el
 * mensual, o sea que mide la mitad que estaba bien. Y el número ofensor, 10, no es el precio de
 * nada: no está en `subscription-plans.ts` ni en `pricing.ts`, así que no hay con qué cruzarlo.
 *
 * Es el patrón que este carril ya pagó dos veces: **la cura se aplica donde saltó el defecto y no
 * viaja a sus gemelos.** El 2026-09-19 fue el hero contra el `<head>`; acá es el ciclo mensual
 * contra el anual.
 *
 * **Lo que se fija, y por qué es clase y no instancia:** no se prohíbe el literal «al mes» —se
 * exige que la unidad SALGA del ciclo. Un tercer ciclo (el semanal ya existe en `Plan.semanal`)
 * nace obligado a contestar qué dice, en vez de heredar el mensual en silencio.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const TOGGLE = join(AQUI, "..", "app", "(sitio)", "precios-toggle.tsx");

/** Sin comentarios: este archivo explica el bug en prosa citando «al mes», y un guard que se
 *  dispara con la documentación de su propio defecto es un guard que alguien apaga. */
function sinComentarios(src: string): string {
  return src.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
}

describe("la cuenta contra el add-on se hace en el ciclo que se muestra", () => {
  const conAddonAdentro = PLANES.filter((p) => p.chatbotIncluido);

  it("1. hoy el sujeto existe: un plan trae el chatbot adentro y debajo hay uno que no", () => {
    expect(conAddonAdentro.length).toBeGreaterThan(0);
    const cuentas = conAddonAdentro.map((p) => cuentaVsAddon(p)).filter((c) => c !== null);
    expect(cuentas.length).toBeGreaterThan(0);
    // Ancla del ciclo: si el add-on dejara de tener precio anual propio, la cuenta anual no se
    // podría hacer y este gate tiene que decirlo, no pasar en verde.
    expect(CHATBOT_PLAN.anual).toBeGreaterThan(0);
  });

  it("2. la cuenta ANUAL sale de los montos anuales, sumados aparte", () => {
    for (const plan of conAddonAdentro) {
      const cuenta = cuentaVsAddon(plan, undefined, { ciclo: "anual" });
      if (!cuenta) continue;

      // Dos caminos distintos hasta el mismo número: acá se suma con el anual leído de su propia
      // fuente, no se le pregunta al helper por su propio resultado.
      const armadoAparte = cuenta.contra.anual + CHATBOT_PLAN.anual;
      expect(cuenta.ciclo).toBe("anual");
      expect(cuenta.armado).toBe(armadoAparte);
      expect(cuenta.deMas).toBe(plan.anual - armadoAparte);
    }
  });

  it("3. y NO es la cuenta mensual disfrazada: las dos difieren hoy", () => {
    const plan = conAddonAdentro.find((p) => cuentaVsAddon(p) !== null)!;
    const mensual = cuentaVsAddon(plan)!;
    const anual = cuentaVsAddon(plan, undefined, { ciclo: "anual" })!;
    // Si alguien implementa el ciclo anual devolviendo el mensual, esto lo agarra.
    expect(anual.deMas).not.toBe(mensual.deMas);
    expect(anual.armado).not.toBe(mensual.armado);
  });

  it("4. la frase dice la unidad DEL CICLO, y nunca la del otro", () => {
    for (const plan of conAddonAdentro) {
      const anual = cuentaVsAddon(plan, undefined, { ciclo: "anual" });
      if (!anual) continue;
      const dicha = cuentaEnPalabras(anual);
      expect(dicha).toContain("al año");
      expect(dicha, "la cuenta anual sigue hablando en meses").not.toContain("al mes");
      expect(dicha).toContain(bs(Math.abs(anual.deMas)));
      expect(dicha).toContain(anual.contra.nombre);

      // La contracara, que es la que mantiene honesto al gate: el mensual sigue diciendo mes.
      const mensual = cuentaVsAddon(plan)!;
      expect(cuentaEnPalabras(mensual)).toContain("al mes");
      expect(cuentaEnPalabras(mensual)).not.toContain("al año");
    }
  });

  it("5. las tres direcciones también salen del signo en anual", () => {
    const [abajo, arriba] = PLANES;
    const par = [
      { ...abajo, chatbotIncluido: false, anual: 8900 },
      { ...arriba, chatbotIncluido: true, anual: 12900 },
    ] as unknown as typeof PLANES;
    const addon = { mensual: 390, anual: 3900 };

    const caro = cuentaVsAddon(par[1], par, { ciclo: "anual", addon })!;
    expect(caro.deMas).toBe(100);
    expect(cuentaEnPalabras(caro)).toContain("Bs 100 más al año");

    const igual = cuentaVsAddon({ ...par[1], anual: 12800 }, par, { ciclo: "anual", addon })!;
    expect(igual.deMas).toBe(0);
    expect(cuentaEnPalabras(igual)).toContain("lo mismo que");

    const barato = cuentaVsAddon({ ...par[1], anual: 12000 }, par, { ciclo: "anual", addon })!;
    expect(barato.deMas).toBe(-800);
    expect(cuentaEnPalabras(barato)).toContain("Bs 800 menos al año");
  });

  /**
   * El punto 6 es el que cierra la SUPERFICIE: los cinco de arriba pueden estar verdes con la
   * pantalla siguiendo igual de mal, porque una función correcta que nadie llama no arregla nada
   * (`CLAUDE.md`: construido ≠ terminado).
   */
  it("6. la tarjeta con interruptor pide la cuenta del ciclo que está mostrando", () => {
    const src = sinComentarios(readFileSync(TOGGLE, "utf8"));

    // Anclas: si el rediseño renombra la clase o saca el estado, esto se pone rojo diciendo qué
    // pasó, en vez de cumplirse solo (nadie puede incumplir una forma que ya no existe).
    expect(src, "se movió el nodo del resultado: reapuntar este gate").toContain("s.planResult");
    expect(src, "se fue el estado del ciclo: reapuntar este gate").toMatch(/useState\(false\)/);

    const nodo = /className=\{s\.planResult\}>\s*\{([^}]*)\}/.exec(src);
    expect(nodo, "no encontré qué texto pinta el resultado del plan").not.toBeNull();
    const expresion = nodo![1];

    expect(
      expresion,
      `el resultado del plan no depende del ciclo mostrado: pinta \`${expresion.trim()}\``,
    ).toMatch(/anual|ciclo/);
  });

  it("7. el helper de la tarjeta devuelve la frase de cada ciclo", () => {
    const plan = conAddonAdentro.find((p) => cuentaVsAddon(p) !== null)!;
    expect(resultadoSegunCiclo(plan, "mensual")).toBe(plan.resultado);
    expect(resultadoSegunCiclo(plan, "anual")).toContain("al año");

    // Un plan sin cuenta que hacer conserva su resultado de catálogo en los dos ciclos: el helper
    // no puede vaciar la tarjeta de los otros tres escalones.
    const sinCuenta = PLANES.find((p) => cuentaVsAddon(p) === null)!;
    expect(resultadoSegunCiclo(sinCuenta, "mensual")).toBe(sinCuenta.resultado);
    expect(resultadoSegunCiclo(sinCuenta, "anual")).toBe(sinCuenta.resultado);
  });
});
