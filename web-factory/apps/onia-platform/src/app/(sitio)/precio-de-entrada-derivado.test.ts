import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { PLANES, plan, planDeEntrada } from "@/lib/pricing";

/**
 * QUÉ CUIDA. Que el precio «desde» que publica el sitio salga del plan MÁS
 * BARATO derivado (`planDeEntrada()`), y no de un `plan("basico")` tipeado.
 *
 * POR QUÉ, con su historia. `lib/pricing.ts` ya explica en la cabecera de
 * `planDeEntrada()` por qué esa función existe: *«el día que entre un escalón
 * más abajo —la escalera C metió el Crece en el medio el 2026-09-12— un
 * `"basico"` tipeado sigue compilando y queda anunciando el plan equivocado»*.
 * El 2026-09-19 se aplicó esa cura al hero de la home… y sólo al hero. Medido
 * el 2026-09-26 desde este carril: la home derivaba bien el precio de PANTALLA
 * (`PLAN_DE_ENTRADA.mensual`, `page.tsx:382`) y tipeaba `plan("basico")` para
 * el `description`, el `og:description` y la tarjeta social — o sea las tres
 * superficies que un lead ve ANTES de abrir la página. Las dos habrían
 * discrepado en el mismo `<head>`.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA. Los cuatro gates vivos del carril miran el
 * resultado servido: `precios:vivos` barre el HTML y cruza cada monto contra la
 * fuente, `precios:fuente` cruza las cifras del sitio contra las del producto.
 * Hoy `plan("basico").mensual === planDeEntrada().mensual`, así que los dos
 * salen VERDES — y seguirían saliendo verdes el día que el bug se vuelva
 * visible, porque el monto viejo seguiría siendo un precio real de un plan
 * real. Un gate de RESULTADO no puede ver una premisa que todavía no falló:
 * hace falta uno que mire cómo se DERIVA.
 *
 * Y la tarjeta social es el peor lugar donde tener esto: las 24 superficies de
 * venta comparten UNA sola imagen (medido: mismo md5 en las 24), el precio va
 * horneado en píxeles, y es exactamente lo que ve quien recibe el link por
 * WhatsApp — el canal por el que Sergio Urcullo manda el sitio a un lead. Un
 * número adentro de un PNG no lo ve ningún `grep`, ninguna captura de pantalla
 * y ningún barrido de HTML.
 *
 * LA REGLA QUE FIJA. En superficie de venta, `plan("<id>")` sólo vale para
 * hablar de ESE plan **por su nombre**: si la frase cita `.nombre`, está
 * nombrando un plan concreto y es legítimo (la FAQ de dental dice «el plan
 * Básico (Bs N/mes) … hasta 300 pacientes activos», que es verdad de ese plan y
 * de ningún otro). Si saca un monto sin nombrar el plan, lo está usando como
 * «el más barato» — y eso se deriva, nunca se tipea.
 *
 * ⚠️ Los comentarios se borran ANTES de medir. `v1/precios/page.tsx` y
 * `v1/modulos/dental/page.tsx` explican este mismo bug EN PROSA, citando
 * `plan("basico")` textual; medir sobre el archivo crudo los cuenta como
 * sujetos y el gate acusa a quien documentó la cura.
 */

const aquí = dirname(fileURLToPath(import.meta.url));
const APP = join(aquí, "..");

/** `.tsx` servidos bajo `src/app`, derivados del DISCO y no de una lista. */
function fuentesServidas(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      salida.push(...fuentesServidas(ruta));
    } else if (entrada.name.endsWith(".tsx") && !entrada.name.includes(".test.")) {
      salida.push(ruta);
    }
  }
  return salida;
}

/** Deja el archivo sin comentarios, conservando los saltos de línea. */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_m, antes: string) => antes);
}

type Uso = { archivo: string; linea: number; texto: string; ids: string[] };

function usosQueNoNombranSuPlan(): Uso[] {
  const encontrados: Uso[] = [];
  for (const archivo of fuentesServidas(APP)) {
    sinComentarios(readFileSync(archivo, "utf8"))
      .split("\n")
      .forEach((linea, i) => {
        const ids = [...linea.matchAll(/plan\("([a-z]+)"\)/g)].map((m) => m[1]);
        if (ids.length === 0) return;
        // La frase nombra el plan del que habla → es un plan concreto, no «el
        // más barato». La unidad es la LÍNEA porque así se escriben acá las
        // plantillas de una frase.
        if (/plan\("[a-z]+"\)\.nombre/.test(linea)) return;
        encontrados.push({
          archivo: archivo.slice(APP.length + 1),
          linea: i + 1,
          texto: linea.trim().slice(0, 100),
          ids,
        });
      });
  }
  return encontrados;
}

describe("el precio «desde» se deriva del plan más barato", () => {
  it("ninguna superficie de venta saca un monto de un plan tipeado sin nombrarlo", () => {
    const usos = usosQueNoNombranSuPlan();
    const detalle = usos
      .map((u) => `  ${u.archivo}:${u.linea}  plan("${u.ids.join('","')}")  ${u.texto}`)
      .join("\n");
    expect(
      usos,
      `Estas ${usos.length} línea(s) citan un plan por su id sin nombrarlo: lo están ` +
        `usando como «el más barato». Eso se deriva con planDeEntrada(), que sigue a la ` +
        `escalera; un id tipeado compila igual y anuncia el plan equivocado el día que ` +
        `entre uno más barato.\n${detalle}`,
    ).toEqual([]);
  });

  it("hoy el plan tipeado y el derivado coinciden: el defecto es LATENTE, no visible", () => {
    // Si esto falla, el bug dejó de ser latente y ya hay precios equivocados
    // publicados — incluido el que va horneado en la tarjeta social.
    expect(plan("basico").mensual).toBe(planDeEntrada().mensual);
  });

  it("planDeEntrada() sigue al más barato aunque el piso cambie de plan", () => {
    // El caso que el id tipeado NO sobrevive, y el motivo entero de este gate.
    // Se abarata el plan MÁS CARO por debajo del actual piso en vez de inventar
    // un id: `PlanId` es una unión cerrada —lo cazó `tsc` al escribir esto— y
    // además así se prueba lo que de verdad importa, que `planDeEntrada()` sigue
    // al PRECIO y no a un id. El día que la escalera se reordene, el derivado se
    // mueve solo y un `plan("basico")` tipeado se queda donde estaba.
    const piso = planDeEntrada();
    const másCaro = PLANES.reduce((a, b) => (b.mensual > a.mensual ? b : a));
    expect(másCaro.id).not.toBe(piso.id);

    const reordenada = PLANES.map((p) =>
      p.id === másCaro.id ? { ...p, mensual: piso.mensual - 100 } : p,
    );
    expect(planDeEntrada(reordenada).id).toBe(másCaro.id);
    expect(planDeEntrada(reordenada).mensual).toBe(piso.mensual - 100);
  });
});
