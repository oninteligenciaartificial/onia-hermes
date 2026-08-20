import { describe, expect, it } from "vitest";
import { renderTwoStepPopup, TWO_STEP_POPUP_CSS, TWO_STEP_POPUP_JS } from "./two-step-popup";

/**
 * Invariantes del bloque: lo que si se rompe convierte el 10/10 en un popup
 * cualquiera, y no lo cazaria ninguna captura de pantalla.
 * El comportamiento (teclado, foco, pasos) vive en tests/e2e/two-step-popup.spec.ts.
 */

const BASE = {
  offer: "10% en tu primera compra",
  question: "¿Que estas buscando?",
  options: [
    { value: "para-mi", label: "Para mi" },
    { value: "para-mi-negocio", label: "Para mi negocio" },
  ],
  action: "/api/leads",
};

describe("two-step-popup", () => {
  it("sin endpoint no renderiza nada: un popup muerto es peor que ninguno", () => {
    expect(renderTwoStepPopup({ ...BASE, action: "  " })).toBe("");
  });

  it("sin opciones no renderiza: sin paso 1 no hay segmentacion, solo friccion", () => {
    expect(renderTwoStepPopup({ ...BASE, options: [] })).toBe("");
  });

  it("el paso 1 se responde con botones, no con campos", () => {
    const html = renderTwoStepPopup(BASE);
    const paso1 = html.slice(html.indexOf('data-wf-pop-panel="1"'), html.indexOf('data-wf-pop-panel="2"'));
    expect(paso1).not.toMatch(/<input|<textarea|<select/);
    expect(paso1.match(/data-wf-pop-value=/g)).toHaveLength(2);
  });

  it("la respuesta del paso 1 y la atribucion viajan al pipeline", () => {
    const html = renderTwoStepPopup({ ...BASE, answerName: "interes", source: "campana-01" });
    expect(html).toContain('name="interes" data-wf-pop-answer');
    expect(html).toContain('name="src" data-wf-pop-src value="campana-01"');
  });

  it("pide WhatsApp, no SMS", () => {
    const html = renderTwoStepPopup(BASE);
    expect(html).toContain('name="whatsapp"');
    expect(html.toLowerCase()).not.toContain("sms");
  });

  it("el correo no bloquea salvo que se pida explicito", () => {
    expect(renderTwoStepPopup(BASE)).toMatch(/name="email"[^>]*>/);
    expect(renderTwoStepPopup(BASE)).not.toMatch(/name="email"[^>]*required/);
    expect(renderTwoStepPopup({ ...BASE, email: "required" })).toMatch(/name="email"[^>]*required/);
    expect(renderTwoStepPopup({ ...BASE, email: "off" })).not.toContain('name="email"');
  });

  it("cada opcion se anuncia con su contexto y el cierre tiene nombre", () => {
    const html = renderTwoStepPopup(BASE);
    expect(html.match(/aria-label="¿Que estas buscando\? /g)).toHaveLength(2);
    expect(html).toContain('aria-label="Cerrar"');
    expect(html).toContain('aria-live="polite"');
  });

  it("el descarte es neutro: nada de confirmshaming", () => {
    const html = renderTwoStepPopup(BASE).toLowerCase();
    for (const frase of ["no gracias", "precio completo", "no quiero ahorrar", "prefiero pagar"]) {
      expect(html).not.toContain(frase);
    }
  });

  it("reduced-motion usa transition: none, NUNCA 0.01ms", () => {
    // Con 0.01ms las propiedades discretas del dialog siguen animando y el
    // dialogo queda abierto en opacity 0: invisible y capturando clics.
    expect(TWO_STEP_POPUP_CSS).toContain("prefers-reduced-motion");
    // Sin comentarios: la hoja EXPLICA la trampa citando 0.01ms, y esa mencion
    // no es una declaracion.
    const reglas = TWO_STEP_POPUP_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(reglas).not.toMatch(/0?\.01ms/);
    const bloque = reglas.slice(reglas.indexOf("prefers-reduced-motion"));
    expect(bloque).toContain("transition: none");
    expect(bloque).toContain("animation: none");
  });

  it("el bloque trae su propio border-box y no depende del reset de la pagina", () => {
    expect(TWO_STEP_POPUP_CSS).toContain("box-sizing: border-box");
  });

  it("el descarte se guarda en cancel (sincrono), no solo en close (encolado)", () => {
    expect(TWO_STEP_POPUP_JS).toContain("addEventListener('cancel',descartar)");
    expect(TWO_STEP_POPUP_JS).toContain("addEventListener('close',descartar)");
  });

  it("nunca dispara al instante", () => {
    expect(renderTwoStepPopup(BASE)).toContain('data-wf-pop-scroll="45"');
    expect(renderTwoStepPopup({ ...BASE, trigger: { scroll: 60, delaySeconds: 30 } })).toContain(
      'data-wf-pop-delay="30"',
    );
  });
});
