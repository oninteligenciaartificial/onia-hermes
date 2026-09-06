import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { RUBRO_OPTIONS } from "./data";

/**
 * El wizard no puede exhibir obra, ni siquiera apagada.
 *
 * Regla dura de la casa (Sergio, 2026-08-20): en la venta está prohibido decir
 * "muy pronto", "próximamente" o listar lo que falta. Lo que no está listo NO
 * SE NOMBRA.
 *
 * ⚠️ POR QUÉ HIZO FALTA OTRO GATE, con dos ya escritos sobre lo mismo.
 *
 * El 2026-09-06 la palabra `PRÓXIMAMENTE` estaba escrita, literal, en el
 * selector de rubros de este wizard (`steps.tsx`), junto a una nota de lista de
 * espera y a una pantalla de resultado que dibujaba los módulos del rubro con
 * tres de cuatro bloques en fantasma. Los 702 tests pasaban en VERDE. Tres
 * cortes distintos la tapaban a la vez, y ninguno estaba mal por su cuenta:
 *
 *   1. `app/obra.test.ts` mira la METADATA de cada página — el `<head>`. Esto
 *      vive en el cuerpo, que ese gate nunca lee.
 *   2. `(sitio)/forma.test.ts` exime `app/v1` por ser noindex. Ese mismo corte
 *      ya falló abierto dos veces en este carril (`/v1/comparativa` el 04-sep,
 *      el `og:image` con "MUY PRONTO" impreso el 05-sep): noindex manda sobre
 *      buscadores, no apaga la pantalla.
 *   3. El barrido de producción (`curl` + `grep` sobre la URL) no la ve porque
 *      esto se pinta del lado del cliente, tras cuatro clics, y SÓLO si un
 *      rubro está marcado como no entregable. Es el mismo escondite donde el
 *      precio de la web vivió doce días equivocado (Bs 790).
 *
 * Lo que este gate agrega no es un patrón más: es el sujeto. La obra no estaba
 * en un texto publicado, estaba en la MAQUINARIA que lo publica — apagada por
 * un dato (`disponible: true` en los cinco rubros) y no por código. Un dato se
 * cambia sin querer: el día que entre el sexto rubro, lo natural es darlo de
 * alta como `disponible: false`, y entonces el sitio muestra el badge, la nota
 * de espera y el ensamblaje fantasma — todos ya aprobados, sin que nada se
 * ponga rojo.
 *
 * La demanda del rubro que no vendemos ya tiene su camino, y es el que la regla
 * manda: "¿Tu rubro no está en la lista? Contanos por WhatsApp" (`steps.tsx`,
 * `ESCAPE_WA_URL`). Capturarla sin admitir nada.
 */

/** Sujeto: el wizard entero, derivado del disco. Ver cabecera para el corte. */
const AQUI = dirname(fileURLToPath(import.meta.url));

function fuentesDelWizard(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return fuentesDelWizard(ruta);
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [ruta];
  });
}

/**
 * Los comentarios se sacan ANTES de mirar. El gate castiga MOSTRAR obra, no
 * contar que alguna vez se mostró: esta cabecera nombra "próximamente" seis
 * veces, y un gate que se dispara con la bitácora de su propio error es un gate
 * que alguien apaga borrando el registro.
 */
function soloCodigo(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const OBRA = [
  { patron: /pr[oó]ximamente/i, porque: "es 'muy pronto' con otro traje" },
  { patron: /\bmuy pronto\b/i, porque: "la frase que originó la regla" },
  { patron: /en construcci[oó]n/i, porque: "obra explícita" },
  { patron: /\bbeta\b/i, porque: "beta = 'todavía se rompe'" },
  { patron: /en desarrollo/i, porque: "lo que no está listo no se nombra" },
  { patron: /lista de espera/i, porque: "promete un futuro en vez de vender hoy" },
  { patron: /\btodav[ií]a no\b/i, porque: "anuncia el hueco en vez de callarlo" },
  { patron: /badge-soon|notaSoon/, porque: "el estilo del cartel de obra" },
] as const;

/** Cómo el sitio escribe las cantidades: "cinco rubros" y "5 rubros". */
const NUMERO = new Map([
  ["un", 1], ["dos", 2], ["tres", 3], ["cuatro", 4], ["cinco", 5],
  ["seis", 6], ["siete", 7], ["ocho", 8], ["nueve", 9], ["diez", 10],
]);

function cantidadesDeRubrosAfirmadas(codigo: string): number[] {
  const re = /\b(un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+rubros\b/gi;
  return [...codigo.matchAll(re)].map((m) => {
    const bruto = m[1].toLowerCase();
    return NUMERO.get(bruto) ?? Number(bruto);
  });
}

describe("el wizard de /empezar no exhibe obra", () => {
  const archivos = fuentesDelWizard(AQUI);
  const rotulo = (f: string) => f.slice(AQUI.length + 1);

  it("encuentra las pantallas del wizard", () => {
    // Sin este ancla, un walk roto deja todos los casos de abajo pasando en
    // verde sobre una lista vacía.
    expect(archivos.length).toBeGreaterThan(3);
  });

  it("los patrones detectan de verdad", () => {
    // El texto EXACTO que estuvo vivo en `steps.tsx` hasta el 2026-09-06. Sin
    // este ancla, vaciar OBRA o romper un patrón deja los casos en verde sobre
    // cualquier cosa — el modo de falla que hizo falso el gate de precios.
    const vivo = '{o.disponible ? "DISPONIBLE" : "PRÓXIMAMENTE"}';
    expect(
      OBRA.filter((f) => f.patron.test(vivo)).map((f) => f.patron.source),
      "el gate dejó de reconocer el defecto que lo hizo nacer",
    ).toContain("pr[oó]ximamente");

    expect(OBRA.length, "la lista de frases de obra se vació").toBeGreaterThan(5);
  });

  it.each(archivos.map((f) => [rotulo(f), f]))(
    "%s no escribe estado de obra",
    (_rot, archivo) => {
      const codigo = soloCodigo(readFileSync(archivo, "utf8"));
      const encontradas = OBRA.filter((f) => f.patron.test(codigo));
      expect(
        encontradas.map((f) => `${f.patron.source} — ${f.porque}`),
        `${rotulo(archivo)} exhibe obra en el cuerpo de la pantalla. No se ve ` +
          `en el HTML servido (se pinta tras varios clics), así que ningún ` +
          `barrido de producción lo caza: sólo este gate.`,
      ).toEqual([]);
    },
  );

  /**
   * El corazón del asunto. El badge, la nota de espera y el ensamblaje fantasma
   * eran ALCANZABLES por dato: bastaba un `disponible: false`. Un rubro que no
   * se puede entregar no se lista — así el estado de obra no tiene cómo
   * renderizarse, y el que busca otro rubro cae en el escape de WhatsApp.
   */
  it("no ofrece un rubro que no se pueda contratar hoy", () => {
    const noEntregables = RUBRO_OPTIONS.filter(
      (o) => (o as { disponible?: boolean }).disponible === false,
    );
    expect(
      noEntregables.map((o) => o.id),
      "el selector volvió a listar un rubro no entregable: eso enciende el " +
        "cartel de obra, la nota de lista de espera y la pantalla de resultado " +
        "con los módulos a medio armar. Lo que no está listo no se nombra.",
    ).toEqual([]);
  });

  /**
   * La cantidad afirmada sobre el propio catálogo. `resultado.tsx` decía "seis
   * rubros" mientras el sitio decía "cinco" en doce lugares y el alta entregaba
   * cinco: una prueba social inflada, en la pantalla del lead más escéptico —
   * el que no encontró su rubro. No es un precio ni un tope de plan, así que
   * ningún gate de cifras lo miraba.
   */
  it("las cantidades de rubros que afirma coinciden con lo que ofrece", () => {
    const reales = RUBRO_OPTIONS.length;
    const desviadas = archivos.flatMap((f) => {
      const codigo = soloCodigo(readFileSync(f, "utf8"));
      return cantidadesDeRubrosAfirmadas(codigo)
        .filter((n) => n !== reales)
        .map((n) => `${rotulo(f)}: dice ${n}, ofrece ${reales}`);
    });
    expect(
      desviadas,
      "el wizard afirma una cantidad de rubros distinta de la que ofrece",
    ).toEqual([]);
  });

  /**
   * FIXTURE, no el árbol vivo. Un caso escrito contra el archivo real pasa en
   * verde con la guarda arrancada el día que el texto vivo deja de disparar el
   * patrón — así nació decorativo un caso de `precios-fuente.test.ts` (06-sep).
   */
  it("el contador de cantidades ve el defecto en su forma real", () => {
    const comoEstaba =
      "se monta sobre el mismo motor que ya corre en producción para seis rubros.";
    expect(cantidadesDeRubrosAfirmadas(comoEstaba)).toEqual([6]);
    expect(cantidadesDeRubrosAfirmadas("los cinco rubros")).toEqual([5]);
    expect(cantidadesDeRubrosAfirmadas("con 5 rubros vivos")).toEqual([5]);
    // No confunde otra cosa contada con rubros contados.
    expect(cantidadesDeRubrosAfirmadas("tres pantallas")).toEqual([]);
  });
});
