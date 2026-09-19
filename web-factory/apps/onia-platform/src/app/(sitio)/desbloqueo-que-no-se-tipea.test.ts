import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ADDONS,
  ADDON_DE_LA_CAPACIDAD,
  CAPACIDADES_INCLUIDAS,
  PLANES,
  capacidadesQueExigenSubirDePlan,
  primerPlanCon,
  sinSubirDePlan,
  type CapacidadIncluida,
  type Plan,
} from "@/lib/pricing";

/**
 * Ninguna pantalla TIPEA lo que el sitio promete sobre el MECANISMO de desbloqueo
 * («no hay que saltar de plan», «sin cambiar de plan»): sale del catálogo.
 *
 * 🔴 **EL DEFECTO, medido el 2026-09-18 sobre `onia.com.bo` SERVIDA** (captura leída, no un
 * `grep`). La sección de add-ons de la portada rotulaba *«Sobre el plan encendés lo que te
 * falta»* y debajo, en el lead, afirmaba **«No hay que saltar de plan para desbloquear una
 * sola»**. Es falso desde la escalera C: de las cuatro capacidades de `CAPACIDADES_INCLUIDAS`
 * sólo dos se compran sueltas —chatbot (Bs 390) y reservas (Bs 150 en Básico)—; los **agentes**
 * exigen saltar al Crece (Bs 550) y el **segundo administrador**, al Completo (Bs 1.290), y no
 * existe add-on de ninguno de los dos. La escalera de la MISMA pantalla, tres secciones más
 * arriba, lo dice con todas las letras. O sea que la pantalla se contradecía sola, y el lead que
 * necesitaba una de esas dos se iba al plan de entrada creyendo que después la prendía aparte.
 *
 * 🔴 **POR QUE NINGUN GATE PODIA VERLO.** Es la tercera forma de la misma familia y la más
 * escurridiza:
 *
 *   - los cruces de precio (`scripts/precios-fuente.mjs`) validan MONTOS, y acá no hay ninguno;
 *   - `lib/capacidad-incluida.test.ts` prohíbe TIPEAR un nombre de plan junto a la capacidad, y
 *     esta frase no nombra ni un plan ni una capacidad;
 *   - `(sitio)/prueba-vs-plan.test.ts` cierra el alcance total dicho sobre el TODO («el sistema
 *     completo») y sobre las PARTES («todos los módulos»). Éste se dice sobre el **mecanismo**,
 *     en abstracto — ningún sustantivo del catálogo aparece en la oración.
 *
 * TRES DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **Se prohíbe la FORMA, no el literal viejo.** «No digas *saltar de plan*» se apagaría solo
 *     el día que la respuesta correcta vuelva a ser ésa (y volverá, si alguna vez todo se compra
 *     suelto). Lo que se prohíbe es TIPEAR la afirmación: el texto sale de `sinSubirDePlan()`,
 *     que lo deriva, y el universal reaparece solo cuando vuelve a ser cierto (caso 5).
 *  2. **Los sujetos se caminan del DISCO** (`src/` entero), no de una lista de pantallas: una
 *     página nueva que afirme lo mismo nace cubierta. Se camina la carpeta y no `git ls-files`
 *     porque el archivo recién escrito y sin commitear es justo el sujeto que hay que cazar.
 *  3. **Marcar una capacidad como «se compra suelta» no la absuelve** (caso 4): el nombre que se
 *     declare en `ADDON_DE_LA_CAPACIDAD` tiene que existir de verdad en `ADDONS`, la carta que
 *     el lead ve. Sin eso, el Record sería una lista de excusas escrita a mano — la falla que
 *     este gate existe para impedir, un escalón más arriba.
 *
 * Se mide sobre el código SIN COMENTARIOS: si no, esta misma bitácora —que cita la frase falsa
 * para que se entienda— pondría el gate rojo, y borrar el registro es como falla esta familia.
 * Y por lo mismo, acá la forma prohibida nunca se escribe entera: se arma por concatenación.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` entero: el copy de venta vive en `app/`, `components/`, `lib/` y `content/`. */
const SRC = join(AQUI, "..", "..");

/** El único archivo autorizado a redactarla: el que la deriva. */
const DUEÑA = join("lib", "pricing.ts");

const VERBOS = ["saltar", "saltarte", "cambiar", "cambiarte", "subir", "subirte", "pasar", "pasarte"];
/** Armada por concatenación a propósito: escrita entera, este archivo se acusaría solo. */
const FORMA = new RegExp(`\\b(?:${VERBOS.join("|")})\\s+de\\s+` + "plan", "i");

function archivosDeVenta(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    // La convención `__loquesea__` la usan los gates que siembran su sujeto y lo borran en el
    // finally: un archivo que desaparece mientras lo leés no es superficie de cliente.
    if (/^__.+__$/.test(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === ".next") continue;
      archivosDeVenta(ruta, acc);
    } else if (/\.(ts|tsx)$/.test(entrada.name)) {
      acc.push(ruta);
    }
  }
  return acc;
}

/** Comentarios en blanco conservando los saltos de línea: las bitácoras acusan y absuelven. */
function sinComentarios(codigo: string): string {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

/** Un catálogo de juguete: cuatro planes, la capacidad en los tres más caros. */
function planesDeJuguete(): readonly Plan[] {
  return PLANES;
}

describe("la promesa sobre el mecanismo de desbloqueo se deriva, no se tipea", () => {
  it("1. hoy hay capacidades que SOLO se consiguen subiendo de plan — el universal sería falso", () => {
    const exigen = capacidadesQueExigenSubirDePlan();
    expect(exigen.length).toBeGreaterThan(0);

    // Cruce contra OTRA función del archivo, no contra la misma cuenta: si una capacidad exige
    // subir, el plan más barato con ella no puede ser el más barato de la escalera.
    const masBarato = [...PLANES].sort((a, b) => a.mensual - b.mensual)[0];
    for (const capacidad of exigen) {
      expect(ADDON_DE_LA_CAPACIDAD[capacidad]).toBeNull();
      expect(primerPlanCon(capacidad)).not.toBe(masBarato.nombre);
    }
  });

  it("2. con eso, la cláusula que se publica NO afirma el universal", () => {
    expect(capacidadesQueExigenSubirDePlan().length).toBeGreaterThan(0);
    expect(sinSubirDePlan()).not.toMatch(FORMA);
  });

  it("3. ninguna pantalla del sitio la tipea — sujetos caminados del disco", () => {
    const universo = archivosDeVenta(SRC);
    const sujetoConocido = join("app", "(sitio)", "page.tsx");
    // Ancla: si el caminador dejara de llegar a la portada, este gate se apagaría en silencio.
    expect(universo.map((f) => relative(SRC, f))).toContain(sujetoConocido);

    const tipean = universo
      .filter((f) => relative(SRC, f) !== DUEÑA)
      .filter((f) => FORMA.test(sinComentarios(readFileSync(f, "utf8"))))
      .map((f) => relative(SRC, f));

    expect(tipean, `lo tipean en vez de leerlo de sinSubirDePlan(): ${tipean.join(", ")}`).toEqual([]);
  });

  it("4. la dueña SI la redacta, y toda capacidad marcada como suelta tiene add-on en la carta", () => {
    // Su mitad simétrica: si la frase desapareciera de la dueña, el caso 3 quedaría verde para
    // siempre sobre un sitio que ya no promete nada.
    expect(FORMA.test(sinComentarios(readFileSync(join(SRC, DUEÑA), "utf8")))).toBe(true);

    const enLaCarta = ADDONS.map((a) => a.nombre);
    const capacidades = Object.keys(CAPACIDADES_INCLUIDAS) as CapacidadIncluida[];
    for (const capacidad of capacidades) {
      const addon = ADDON_DE_LA_CAPACIDAD[capacidad];
      if (addon === null) continue;
      expect(enLaCarta, `"${addon}" se declara comprable suelto y no está en ADDONS`).toContain(addon);
    }
  });

  it("5. el universal vuelve SOLO el día que todo se compre suelto (el caso inalcanzable hoy)", () => {
    const todoSuelto = Object.fromEntries(
      (Object.keys(CAPACIDADES_INCLUIDAS) as CapacidadIncluida[]).map((c) => [c, ADDONS[0].nombre]),
    ) as Record<CapacidadIncluida, string | null>;

    expect(capacidadesQueExigenSubirDePlan(planesDeJuguete(), todoSuelto)).toEqual([]);
    expect(sinSubirDePlan(planesDeJuguete(), todoSuelto)).toMatch(FORMA);
  });
});
