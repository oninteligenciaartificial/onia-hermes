import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CAPACIDADES_INCLUIDAS,
  PLANES,
  PRUEBA,
  plan,
  planDeEntrada,
} from "@/lib/pricing";

import {
  MODULOS_DE_LA_CUENTA,
  modulosEncendidosEn,
} from "./modulos-de-la-cuenta";

/**
 * El panel «Tu cuenta» no dibuja lo que el plan que está mostrando tiene apagado.
 *
 * Medido el 2026-09-19 sobre `onia.com.bo` SERVIDA (texto renderizado, no el
 * HTML): el panel pintaba «Clientes · Caja · Inventario · Contabilidad ·
 * **Agentes**» rematado con «Encendidos desde el primer día», y en la portada
 * aparece dos veces — en el hero, debajo de «Después, desde Bs 320 al mes», y
 * en «ADENTRO», que ni siquiera habla de la prueba. `agentsIncluded` es
 * **false** en `basic` (ref publicado de `onia-platform/lib/plan-catalogo.ts`):
 * los agentes entran en Crece, Bs 550, y la tarjeta «02 · RECUPERAR» de la
 * misma pantalla los vende como el motivo de subir. La portada se desmentía
 * sola, y la sorpresa le llegaba al que pagó el Básico DESPUÉS de pagar.
 *
 * Por qué ningún gate lo veía: no hay un monto en el panel (los cruces de
 * precio firman verde), no tipea ningún nombre de plan junto a la capacidad
 * (invisible a `capacidad-incluida.test.ts`), no es un cuantificador universal
 * (invisible a `prueba-vs-plan.test.ts`) y el gate de paneles que ya existe
 * —`el-panel-dibuja-lo-que-la-pagina-promete.test.ts`— cruza rubro × panel, y
 * el de la cuenta no es de ningún rubro. El eje es **panel × PLAN**.
 *
 * El gate es de ACUERDO con el catálogo, no de contenido: no exige que diga
 * «Agentes» ni que no lo diga —eso lo decide el producto— sino que lo dibujado
 * esté ENCENDIDO en el plan que se dibuja.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const FUENTE_PANEL = join(AQUI, "ui.tsx");
const FUENTE_PORTADA = join(AQUI, "page.tsx");
const FUENTE_EMPEZAR = join(AQUI, "empezar", "page.tsx");

/**
 * El módulo que trajo el defecto. Si sale del universo, el gate se apagó solo:
 * con los cinco módulos en `exige: null` todos los casos de abajo pasan en
 * verde sin haber mirado un solo plan.
 */
const SUJETO_CONOCIDO = "Agentes";

/**
 * La fuente sin comentarios, conservando los saltos de línea.
 *
 * Los comentarios acusan Y absuelven: la bitácora de `modulos-de-la-cuenta.ts`
 * cita las cinco pastillas viejas por su nombre y nombra «Agentes» media docena
 * de veces. Un gate que la mire queda verde con el panel roto, y obliga a
 * borrar el registro para ponerse rojo: las dos formas en que esta familia
 * falla.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/^\s*\/\/.*$/gm, " ");
}

/** El cuerpo del `case "cuenta":` de `ui.tsx`, hasta el `case` siguiente. */
function ramaDeLaCuenta(): string {
  const fuente = sinComentarios(readFileSync(FUENTE_PANEL, "utf8"));
  const desde = fuente.indexOf('case "cuenta":');
  expect(desde, 'ui.tsx ya no tiene un `case "cuenta":`').toBeGreaterThan(-1);
  const resto = fuente.slice(desde + 'case "cuenta":'.length);
  const hasta = resto.indexOf("case ");
  return hasta === -1 ? resto : resto.slice(0, hasta);
}

describe("el panel de cuenta dibuja sólo lo que el plan enciende", () => {
  it("el módulo que trajo el defecto sigue en el universo, y gateado por una capacidad", () => {
    const sujeto = MODULOS_DE_LA_CUENTA.find((m) => m.nombre === SUJETO_CONOCIDO);
    expect(
      sujeto,
      `«${SUJETO_CONOCIDO}» salió de MODULOS_DE_LA_CUENTA: si el panel dejó de dibujarlo, este gate se quedó sin sujeto y hay que elegir otro`,
    ).toBeDefined();
    expect(
      sujeto?.exige,
      `«${SUJETO_CONOCIDO}» quedó declarado como núcleo (exige: null) y no lo es: el catálogo lo enciende por plan`,
    ).not.toBeNull();
  });

  it("al menos un módulo depende del plan (si no, no hay nada que filtrar)", () => {
    const gateados = MODULOS_DE_LA_CUENTA.filter((m) => m.exige !== null);
    expect(
      gateados.length,
      "ningún módulo del panel depende del plan: el filtro no puede fallar y el gate es decorativo",
    ).toBeGreaterThan(0);
  });

  it("todo módulo dibujado está ENCENDIDO en el plan que se dibuja, plan por plan", () => {
    for (const p of PLANES) {
      const dibujados = modulosEncendidosEn(p.id);
      for (const nombre of dibujados) {
        const modulo = MODULOS_DE_LA_CUENTA.find((m) => m.nombre === nombre);
        if (!modulo || modulo.exige === null) continue;
        // La expectativa NO sale de `modulosEncendidosEn`: se le pregunta al
        // campo del catálogo, que es la otra mitad del cruce. Derivarla del
        // mismo helper que se está midiendo sería tautológico.
        const campo = CAPACIDADES_INCLUIDAS[modulo.exige];
        expect(
          plan(p.id)[campo],
          `el panel dibuja «${nombre}» en el plan ${p.nombre} (Bs ${p.mensual}) y el catálogo lo tiene APAGADO (${campo}: false)`,
        ).toBe(true);
      }
    }
  });

  it("el plan de ENTRADA no dibuja el módulo que no trae", () => {
    const entrada = planDeEntrada();
    const dibujados = modulosEncendidosEn(entrada.id);
    const apagados = MODULOS_DE_LA_CUENTA.filter(
      (m) => m.exige !== null && entrada[CAPACIDADES_INCLUIDAS[m.exige]] !== true,
    ).map((m) => m.nombre);
    for (const nombre of apagados) {
      expect(
        dibujados,
        `el hero cita «desde Bs ${entrada.mensual} al mes» (${entrada.nombre}) y el panel de al lado dibuja «${nombre}», que ese plan no enciende`,
      ).not.toContain(nombre);
    }
  });

  it("la prueba dibuja lo que la prueba enciende (y por eso puede dibujar más)", () => {
    // /empezar habla de la prueba y lo dice: «es tu cuenta real, con el plan
    // Profesional». Ahí el panel puede mostrar lo que ese plan trae — lo que no
    // puede es mostrarlo en la portada, donde el precio a la vista es otro.
    const deLaPrueba = modulosEncendidosEn(PRUEBA.planQueCorreId);
    const deEntrada = modulosEncendidosEn(planDeEntrada().id);
    expect(deLaPrueba.length).toBeGreaterThanOrEqual(deEntrada.length);
  });

  it("sin plan, el panel no se dibuja: tira en vez de prometer de más", () => {
    expect(() => modulosEncendidosEn(undefined)).toThrow(/plan/i);
  });

  it("el panel DERIVA sus pastillas y no vuelve a tipearlas", () => {
    const rama = ramaDeLaCuenta();
    expect(
      rama,
      "el `case \"cuenta\"` de ui.tsx dejó de llamar a modulosEncendidosEn: volvió a decidir por su cuenta qué dibuja",
    ).toContain("modulosEncendidosEn(");
    for (const m of MODULOS_DE_LA_CUENTA) {
      expect(
        rama,
        `«${m.nombre}» quedó escrito a mano dentro del panel: la lista tiene un solo dueño (modulos-de-la-cuenta.ts)`,
      ).not.toContain(`"${m.nombre}"`);
    }
  });

  it("las tres pantallas que lo dibujan declaran con qué plan", () => {
    // El tipo no alcanza: `plan` es opcional para no ensuciar los paneles de
    // rubro, así que un llamador nuevo compila sin pasarlo. Lo caza la baranda
    // del producto al prerenderizar, y esto lo dice antes del build.
    const portada = sinComentarios(readFileSync(FUENTE_PORTADA, "utf8"));
    const empezar = sinComentarios(readFileSync(FUENTE_EMPEZAR, "utf8"));

    for (const [nombre, fuente] of [
      ["(sitio)/page.tsx", portada],
      ["(sitio)/empezar/page.tsx", empezar],
    ] as const) {
      const cuentas = fuente.match(/panel="cuenta"[^/>]*/g) ?? [];
      for (const uso of cuentas) {
        expect(
          uso,
          `${nombre} dibuja el panel de cuenta sin decir de qué plan: el panel prometería lo mismo para todos`,
        ).toMatch(/plan=/);
      }
    }

    // La portada lo dibuja además desde CAPACIDADES, donde el id no es literal.
    expect(
      portada,
      "(sitio)/page.tsx: la entrada de CAPACIDADES con el panel de cuenta perdió su plan",
    ).toMatch(/panel:\s*"cuenta"[\s\S]{0,200}?plan:/);
  });
});
