/**
 * LA PORTADA NO LE DICE DOS VECES LO MISMO AL LEAD.
 *
 * Nace del 2026-09-18, MIRANDO `onia.com.bo/` renderizada: las secciones 2 y 3
 * —«Tu WhatsApp responde las 24 horas.» (1.086 px) y «Cerrás vos. El negocio
 * no.» (2.157 px)— repetían los MISMOS tres momentos, palabra por palabra:
 *
 *     23:40    Preguntan el precio. Contesta el asistente.
 *     Domingo  Reservan solos por tu agenda pública, si trabajás con citas.
 *     07:00    Los recordatorios y los avisos de pago quedan escritos.
 *
 * Vivían en DOS constantes gemelas de dos archivos distintos (`MOMENTOS` en
 * `page.tsx` y `MOMENTOS_NOCHE` en `noche.tsx`), así que ningún gate de texto
 * las cruzaba: cada archivo, leído solo, era correcto. El lead scrolleaba
 * 1.000 px para leer lo mismo — y los dos primeros tercios del scroll inicial,
 * la parte más cara de la página, se iban en decirlo dos veces.
 *
 * Nadie lo decidió: las dos piezas se aprobaron POR SEPARADO (la noche con la
 * v4, el 07-sep; la línea del día el 11-sep) y `noche.tsx` copió los momentos
 * de la home — su propio comentario lo dice, «los tres momentos que la home ya
 * tiene aprobados». Aprobar dos piezas nunca es aprobar su suma.
 *
 * EL SUJETO ES LA CLASE, NO ESOS TRES ÍTEMS: cualquier oración de contenido
 * que la portada escriba en dos de sus archivos. El universo se camina del
 * DISCO (el grafo de lo que `page.tsx` compone), nunca de una lista a mano —
 * una lista a mano falla abierto justo en la sección que se agregue mañana.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Una oración más corta que esto es un rótulo o un botón, no contenido. */
const LARGO_DE_ORACION = 35;

/**
 * Los archivos que la portada COMPONE: `page.tsx` y todo `.tsx` que importe de
 * esta misma carpeta, transitivamente. Derivado del grafo real, así que una
 * sección nueva entra al gate el día que la portada la monta.
 */
function grafoDeLaPortada(): Map<string, string> {
  const vistos = new Map<string, string>();
  const pendientes = ["page.tsx"];

  while (pendientes.length > 0) {
    const archivo = pendientes.shift()!;
    if (vistos.has(archivo)) continue;
    const ruta = join(AQUI, archivo);
    if (!existsSync(ruta)) continue;
    const fuente = readFileSync(ruta, "utf8");
    vistos.set(archivo, fuente);

    for (const m of fuente.matchAll(/from\s+"\.\/([\w-]+)"/g)) {
      const hermano = `${m[1]}.tsx`;
      if (!vistos.has(hermano) && existsSync(join(AQUI, hermano))) {
        pendientes.push(hermano);
      }
    }
  }
  return vistos;
}

/**
 * Las oraciones de contenido de un archivo: literales entre comillas dobles o
 * backticks. La interpolación `${…}` se colapsa a «·» — si no, dos copias de la
 * misma frase con el mismo helper adentro se leerían como distintas.
 */
function oracionesDe(fuente: string): Set<string> {
  const sinComentarios = fuente
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

  const out = new Set<string>();
  for (const m of sinComentarios.matchAll(/"([^"\\]{20,300})"|`([^`\\]{20,300})`/g)) {
    const crudo = m[1] ?? m[2] ?? "";
    const frase = crudo
      .replace(/\$\{[^}]*\}/g, "·")
      .replace(/\s+/g, " ")
      .trim();
    // Contenido, no una clase de CSS ni una ruta ni un import.
    if (frase.length < LARGO_DE_ORACION) continue;
    if (!/\s/.test(frase)) continue;
    if (/^[/@.]|^https?:|^[\w-]+\/[\w-]+$/.test(frase)) continue;
    if (!/[a-záéíóúñ]\s+[a-záéíóúñ]/i.test(frase)) continue;
    out.add(frase);
  }
  return out;
}

/**
 * Repeticiones legítimas, con su motivo. Se re-miden en CADA corrida: si una
 * deja de repetirse, el gate lo denuncia, para que la excusa no sobreviva a su
 * causa. Hoy está vacía: la portada no repite ninguna oración.
 */
const REPETICIONES_CON_MOTIVO: { frase: string; motivo: string }[] = [];

/**
 * LOS TITULARES, que es por donde el defecto volvió a entrar.
 *
 * Medido el 2026-09-24 MIRANDO `onia.com.bo/` renderizada a 1440×900: la
 * tarjeta «Trabajan de noche, no deciden solos» (3.793 px) y el titular de la
 * sección de abajo «Trabajan de noche. No *deciden* solos.» (4.311 px) caen a
 * 518 px — o sea DENTRO DEL MISMO VIEWPORT, sin scrollear. Las dos dibujan
 * además el mismo panel (`panel: "agentes"`), y entre las dos el lead lee la
 * misma salvaguarda cinco veces («Vos aprobás» · «Nada sale sin que lo mires» ·
 * «aprobás lo que sirve» · «La decisión sigue siendo tuya» · «Nada se manda
 * hasta que lo aprobás»).
 *
 * EL GATE DE ARRIBA ESTABA VERDE, y por TRES cegueras independientes —vale
 * nombrarlas porque son la clase, no este par:
 *  1. Cruza `archivos.length > 1`: dos copias en el MISMO archivo no se ven.
 *     Acá las dos viven en `page.tsx` (líneas 323 y 507).
 *  2. Sólo mira literales entre comillas o backticks. Un titular JSX es texto
 *     desnudo y encima partido por `<em>` — no es un literal, es invisible.
 *  3. Compara por igualdad exacta: «…, no deciden solos» y «…. No deciden
 *     solos.» son cadenas distintas. Una coma esconde la repetición entera.
 *
 * Por eso este sujeto es OTRO —los titulares— y se compara por ESQUELETO (sin
 * puntuación ni tildes ni caso), que es lo que un lead reconoce como "ya leí
 * esto". Derivado del disco, igual que el grafo: un titular nuevo entra solo.
 */

/** Colapsa `{…}` aunque venga anidado, hasta que no queden llaves. */
function sinInterpolaciones(jsx: string): string {
  let previo = jsx;
  for (let i = 0; i < 10; i++) {
    const paso = previo.replace(/\{[^{}]*\}/g, "·");
    if (paso === previo) break;
    previo = paso;
  }
  return previo;
}

/**
 * Los titulares de un archivo: los `<h1>`/`<h2>`/`<h3>` y los `titulo:` de las
 * tres tareas, que la portada renderiza como titular de tarjeta.
 */
function titularesDe(fuente: string): string[] {
  const sinComentarios = fuente
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

  const out: string[] = [];
  for (const m of sinComentarios.matchAll(
    /<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/g,
  )) {
    out.push(sinInterpolaciones(m[2]).replace(/<[^>]+>/g, ""));
  }
  for (const m of sinComentarios.matchAll(/\b(?:nombre|titulo):\s*"([^"\\]{8,140})"/g)) {
    out.push(m[1]);
  }

  return out
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter((t) => /[a-záéíóúñ]/i.test(t.replace(/·/g, "")));
}

/** Lo que el lead reconoce como "ya leí esto": sin puntuación, tildes ni caso. */
function esqueletoDeTitular(titular: string): string {
  return titular
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ·\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Más corto que esto es un rótulo suelto, no un titular que se pueda repetir. */
const LARGO_DE_TITULAR = 12;

describe("la portada no le dice dos veces lo mismo al lead", () => {
  const grafo = grafoDeLaPortada();

  it("el grafo de la portada sale del disco y trae sus componentes", () => {
    // La portada corta ya no monta noche.tsx; sí compone el panel desde ui.tsx.
    expect(grafo.has("page.tsx")).toBe(true);
    expect(grafo.has("ui.tsx")).toBe(true);
    expect(grafo.size).toBeGreaterThan(1);
  });

  it("ninguna oración de contenido aparece en dos archivos de la portada", () => {
    const dondeVive = new Map<string, string[]>();
    for (const [archivo, fuente] of grafo) {
      for (const frase of oracionesDe(fuente)) {
        dondeVive.set(frase, [...(dondeVive.get(frase) ?? []), archivo]);
      }
    }

    const exentas = new Set(REPETICIONES_CON_MOTIVO.map((r) => r.frase));
    const repetidas = [...dondeVive.entries()]
      .filter(([frase, archivos]) => archivos.length > 1 && !exentas.has(frase))
      .map(([frase, archivos]) => `«${frase}» en ${archivos.join(" + ")}`);

    expect(repetidas).toEqual([]);
  });

  it("el sujeto de los titulares no está vacío ni recortado", () => {
    // Caso ancla, igual que el del grafo: un extractor que devuelve cero
    // titulares —una etiqueta renombrada, un `<Titulo>` propio— deja el gate
    // mudo firmando verde, que es el modo en que este archivo ya falló.
    const titulares = [...grafo.values()].flatMap(titularesDe);
    expect(titulares.length).toBeGreaterThanOrEqual(8);
    // Las dos formas tienen que estar vivas: h2 de sección y titulo de tarea.
    expect(titulares).toContain("Todo el negocio, en una pantalla.");
    expect(titulares).toContain("Ves cómo va el día.");
  });

  it("ningún titular repite a otro, ni siquiera dentro del mismo archivo", () => {
    const dondeVive = new Map<string, string[]>();
    for (const [archivo, fuente] of grafo) {
      for (const titular of titularesDe(fuente)) {
        const clave = esqueletoDeTitular(titular);
        if (clave.replace(/·/g, "").trim().length < LARGO_DE_TITULAR) continue;
        dondeVive.set(clave, [
          ...(dondeVive.get(clave) ?? []),
          `«${titular}» (${archivo})`,
        ]);
      }
    }

    const repetidos = [...dondeVive.values()]
      .filter((apariciones) => apariciones.length > 1)
      .map((apariciones) => apariciones.join(" == "));

    expect(repetidos).toEqual([]);
  });

  it("las repeticiones exentas siguen existiendo (una excusa no sobrevive a su causa)", () => {
    const todas = new Map<string, number>();
    for (const [, fuente] of grafo) {
      for (const frase of oracionesDe(fuente)) {
        todas.set(frase, (todas.get(frase) ?? 0) + 1);
      }
    }
    const muertas = REPETICIONES_CON_MOTIVO.filter(
      (r) => (todas.get(r.frase) ?? 0) < 2,
    ).map((r) => r.frase);

    expect(muertas).toEqual([]);
  });
});
