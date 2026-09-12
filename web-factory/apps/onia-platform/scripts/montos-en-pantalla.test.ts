import { describe, expect, it } from "vitest";
import { montosVisibles } from "./montos-en-pantalla.mjs";

/**
 * QUÉ CUIDA: que el lector de montos vea las dos formas en que el sitio escribe un
 * precio, y que sepa cuál de ellos es un precio de plan.
 *
 * Los casos no son inventados: son el `innerText` real de producción medido el
 * 2026-09-12, incluido el salto de línea que `innerText` mete entre el número y su
 * unidad cuando viven en spans distintos.
 */
describe("montos en pantalla", () => {
  it("ve el precio de plan con la moneda DETRÁS y partido en dos nodos", () => {
    // La tarjeta de /precios, tal cual: <span>750</span><span>Bs / mes</span>
    const { todos, periodicos } = montosVisibles("Pro\n750\nBs / mes\nTodo lo del Básico");
    expect(todos, "la forma «750 Bs / mes» es como el sitio pinta sus planes").toContain(750);
    expect(periodicos).toContain(750);
  });

  it("ve el precio con la moneda ADELANTE, que es la otra forma viva", () => {
    const { todos, periodicos } = montosVisibles("El semanal existe en Básico (Bs 89) y en Pro (Bs 199).");
    expect(todos).toContain(89);
    expect(todos).toContain(199);
    // Sin periodicidad pegada: son montos citados en prosa, no tarjetas de plan.
    expect(periodicos.size).toBe(0);
  });

  it("lee los miles con punto y la periodicidad abreviada", () => {
    const { todos, periodicos } = montosVisibles("7.500 Bs/año · 199 Bs/sem");
    expect(todos).toEqual(new Set([7500, 199]));
    expect(periodicos).toEqual(new Set([7500, 199]));
  });

  it("no cuenta como precio de plan un monto citado en prosa", () => {
    // El ruido que hizo ilegible la primera corrida del barrido: /comparativa cita
    // costos ajenos y ahorros calculados. Son ciertos y no son precios de Onia.
    const { todos, periodicos } = montosVisibles("Ahorrás Bs 1.058 y arrancás con Bs 0 de instalación.");
    expect(todos).toEqual(new Set([1058, 0]));
    expect(periodicos.size, "un ahorro no es un precio de plan").toBe(0);
  });

  it("no inventa montos donde no hay moneda", () => {
    const { todos } = montosVisibles("Hasta 1.500 fichas de clientes · 800 recordatorios al mes");
    expect(todos.size, "«1.500 fichas» es un límite del plan, no un precio").toBe(0);
  });
});
