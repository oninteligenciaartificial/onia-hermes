/**
 * El wizard no elige planes con el id escrito a mano.
 *
 * Nace del 2026-09-17, MIRANDO la pantalla de resultado de `/v1/empezar` en producción
 * (capturas del recorrido de `precios-vivos.mjs`). Dos defectos vivos, los dos de la misma
 * clase — una lista de planes tipeada que no se enteró de la escalera C (2026-09-12):
 *
 *  1. El downsell decía «hay un plan de entrada de Bs 320/mes … los agentes de IA no vienen
 *     ahí» sobre la tarjeta que le acababa de vender «Agente IA que reprograma». Entre el
 *     Profesional recomendado (890) y ese Básico (320) entró el Crece (550), que SÍ trae los
 *     agentes — y el lead al que le queda grande el 890 nunca se entera de que existe. La
 *     misma tarjeta enlaza «Ver los CUATRO planes» y nombra dos.
 *  2. El plan grupal se llamaba «Grupo clínico» en el título mientras la línea de precio de
 *     abajo, derivada, decía «Grupo / Empresarial». Dos nombres del mismo plan en la misma
 *     tarjeta, y el tipeado con vocabulario dental servido a los cinco rubros: un centro de
 *     estética de 15+ personas leía «Grupo clínico» (visto renderizado).
 *
 * Ningún cruce de precios puede ver esto: los montos SE DERIVAN y por eso son legítimos
 * (`npm run precios:vivos` firmaba verde con las dos cosas vivas). Lo que estaba tipeado era
 * el SUJETO, no la cifra.
 *
 * Por eso el gate no prohíbe el valor viejo —«basico», «Grupo clínico»— sino la FORMA que
 * envejece: que el escalón salga del catálogo y no de un literal. Prohibir el valor viejo se
 * apaga solo el día que la respuesta correcta sea ese valor.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { GRUPO, PLANES, escalonAnterior, plan } from "@/lib/pricing";
import { NOTA_DOWNSELL_PARA, notaDownsell } from "./data";
import { recomendar } from "./recommend";

const AQUI = join(process.cwd(), "src/app/v1/empezar");
const fuente = (f: string) => readFileSync(join(AQUI, f), "utf8");

describe("el escalón de abajo se deriva, no se tipea", () => {
  it("la escalera del catálogo está ordenada por precio y todos tienen un anterior salvo el primero", () => {
    // Anclaje del instrumento: si `escalonAnterior` dejara de derivarse del precio, los casos
    // de abajo pasarían a comparar una lista contra sí misma.
    const porPrecio = [...PLANES].sort((a, b) => a.mensual - b.mensual);
    expect(escalonAnterior(porPrecio[0].id)).toBeNull();
    for (let i = 1; i < porPrecio.length; i++) {
      expect(escalonAnterior(porPrecio[i].id)?.id).toBe(porPrecio[i - 1].id);
    }
  });

  it("el downsell nombra el escalón inmediatamente anterior al plan recomendado", () => {
    // La regla de venta (04-OBJECIONES §4) es «el de abajo es downsell, nunca apertura».
    // Con tres planes eso era el Básico; con la escalera C es el que el catálogo diga.
    for (const recomendado of PLANES) {
      const abajo = escalonAnterior(recomendado.id);
      if (!abajo) continue;
      const nota = notaDownsell(recomendado.id);
      expect(nota, `hay escalón abajo de ${recomendado.id}, tiene que haber texto`).not.toBeNull();
      const texto = nota ?? "";
      expect(texto, `downsell de ${recomendado.id}`).toContain(abajo.nombre);
      // …y con SU precio, no el de otro escalón.
      expect(texto, `precio del downsell de ${recomendado.id}`).toMatch(
        new RegExp(`Bs\\s*${abajo.mensual.toLocaleString("es-BO")}`),
      );
      for (const otro of PLANES) {
        if (otro.id === abajo.id || otro.id === recomendado.id) continue;
        expect(
          texto,
          `el downsell de ${recomendado.id} no puede ofrecer ${otro.id}`,
        ).not.toContain(otro.nombre);
      }
    }
  });

  it("el downsell no le niega al escalón de abajo una capacidad que sí trae", () => {
    // El texto viejo decía «los agentes de IA no vienen ahí» y era cierto del Básico y falso
    // del Crece. Lo que un plan NO trae ya lo declara el catálogo en `sinEsto`.
    for (const recomendado of PLANES) {
      const abajo = escalonAnterior(recomendado.id);
      if (!abajo) continue;
      const nota = notaDownsell(recomendado.id);
      expect(nota, `hay escalón abajo de ${recomendado.id}, tiene que haber texto`).not.toBeNull();
      const texto = (nota ?? "").toLowerCase();
      if (abajo.agentesIncluidos) {
        expect(texto, `downsell de ${recomendado.id}`).not.toMatch(
          /agentes? de ia no vien|sin agentes? de ia/,
        );
      }
      if (abajo.reservasIncluidas) {
        expect(texto, `downsell de ${recomendado.id}`).not.toMatch(
          /reservas? (online )?no vien|sin reservas/,
        );
      }
    }
  });

  it("el recomendador no tipea el nombre de ningún plan del catálogo", () => {
    // El sujeto es el NOMBRE puesto entre comillas, no la mención: el recomendador puede
    // (y debe) nombrar planes, pero pidiéndoselos al catálogo.
    const src = fuente("recommend.ts").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    const nombres = [...PLANES.map((p) => p.nombre), GRUPO.nombre];
    for (const nombre of nombres) {
      expect(src, `"${nombre}" tipeado en recommend.ts`).not.toContain(
        `"${nombre}`,
      );
    }
    // Y la forma que produjo el bug: cualquier literal con «Grupo …» o «Plan …» que no salga
    // del catálogo. `Plan ${...}` interpolado está bien; `"Plan Pro"` no.
    const literalesDePlan = src.match(/["'`](?:Plan|Grupo)\s+[A-Za-zÁÉÍÓÚáéíóú/][^"'`$]*["'`]/g) ?? [];
    expect(literalesDePlan, "nombre de plan tipeado en recommend.ts").toEqual([]);
  });

  it("el plan grupal se llama igual en el título y en la línea de precio", () => {
    // Dos nombres del mismo plan en la MISMA tarjeta es lo que se veía renderizado.
    const rec = recomendar("estetica", "15+", new Set(["nada"]));
    expect(rec.plan.nombre).toBe(GRUPO.nombre);
    expect(rec.plan.nombre).not.toMatch(/cl[ií]nic/i);
  });

  it("ningún plan recomendado a un rubro no-dental trae vocabulario dental en el nombre", () => {
    // El wizard atiende cinco rubros y el vocabulario del resto de la tarjeta ya se deriva.
    const rubros = ["comercio", "servicios", "proveedores", "estetica"] as const;
    const equipos = ["solo", "2-5", "6-15", "15+"] as const;
    for (const rubro of rubros) {
      for (const equipo of equipos) {
        const rec = recomendar(rubro, equipo, new Set(["nada"]));
        expect(
          rec.plan.nombre,
          `plan recomendado a ${rubro} / ${equipo}`,
        ).not.toMatch(/cl[ií]nic|dental|odontolog|paciente/i);
      }
    }
  });

  it("la nota del downsell que consume la pantalla se deriva del plan recomendado", () => {
    // Guarda de cableado: la pantalla tiene que pedirle el texto al plan que recomendó, no a
    // una constante. Una constante suelta vuelve a clavar el escalón el día que entre el quinto.
    const pantalla = fuente("resultado.tsx");
    expect(pantalla).toContain(NOTA_DOWNSELL_PARA);
    expect(pantalla, "el downsell se pide con el plan recomendado").toMatch(
      new RegExp(`${NOTA_DOWNSELL_PARA}\\s*\\(`),
    );
    expect(plan("pro").nombre).toBeTruthy();
  });
});
