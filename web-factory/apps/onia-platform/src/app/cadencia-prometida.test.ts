import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Ninguna superficie de venta le promete a los AGENTES una cadencia continua.
 *
 * Los agentes (Recall y Cobrador) NO corren todo el tiempo: los despierta un
 * cron del host, **una vez por día**. Medido en vivo el 2026-09-07 contra el
 * VPS, y el propio comentario del crontab lo dice —
 *
 *     $ crontab -l | grep -i agent
 *     # Corrida diaria agentes ONIA Platform (Recall+Cobrador, C3) 07:00 La Paz (=11:00 UTC)
 *     0 11 * * * /root/bin/run-onia-agents-cron.sh >> /var/log/onia-agents-cron.log 2>&1
 *
 * — así que **«24/7» sobre los agentes exagera 24 veces** lo que el sistema
 * entrega, sobre una capacidad que además se COBRA (los agentes vienen desde el
 * plan Pro, `lib/pricing.ts`).
 *
 * El defecto que lo trajo, medido el 2026-09-07 sobre el árbol:
 *
 *   · `(sitio)/page.tsx` — la banda de prueba de la portada, cuyo propio
 *     comentario dice *«solo hechos verificables, cero logos/testimonios»*,
 *     mostraba `24/7` en tipografía de display con la etiqueta «agentes que
 *     trabajan y esperan tu aprobación».
 *   · `v1/page.tsx` — la `description` del `<head>`, que es lo que lee el
 *     fetcher de WhatsApp al armar la tarjeta del enlace: «agentes que trabajan
 *     24/7 con tu aprobación».
 *
 * Y es, otra vez, **el barrido a medias**: el resto del sitio ya lo contaba
 * bien el mismo día. `/agentes` —la página cuyo trabajo ES explicar los
 * agentes— dice «Corre cada 24 horas» y «Trabajan de noche»; `/nosotros` y
 * `landing-v1/features.tsx` dicen «trabajan de noche». Cinco superficies
 * coherentes y dos que no, incluida la que está en la letra más grande.
 *
 * ⚠️ **Ningún gate de los que ya existen puede ver esto**, y por construcción:
 *   · no sobra ninguna palabra prohibida (no es obra ni autobombo);
 *   · no falta ningún rubro ni capacidad (no es «ofrece de menos»);
 *   · ningún precio se aparta de la fuente;
 *   · `promesa-humana.test.ts` **perdona explícitamente** lo que promete una
 *     máquina, porque «el chatbot contesta al instante» sí se cumple.
 * La clase nueva es **la CADENCIA**: la promesa está bien escrita, es sobre una
 * máquina, y lo que está mal es cada cuánto. El hermano de este defecto ya se
 * había encontrado DENTRO del producto —el panel `/agents` anunciaba «corre
 * cada 1 h» leyendo el intervalo declarado del agente en vez del cron que lo
 * despierta— y se arregló ahí; **la superficie de venta quedó con la misma
 * mentira y nadie la barrió**. Arreglar la instancia y no la clase.
 *
 * ⚠️ **El chatbot NO entra, y la exención es por CONTEXTO, no por archivo.**
 * «Contesta 24/7» es cierto del chatbot: es un webhook, contesta a cualquier
 * hora. Si la exención fuera una lista de archivos, el día que alguien escriba
 * la promesa de los agentes dentro de un archivo del chatbot entraría
 * pre-aprobada — que es como esta familia de gates falla abierto. Acá se mira
 * la VECINDAD, y la promesa es de quien está **más cerca**.
 *
 * ⚠️ La primera versión eximía por mera PRESENCIA del bot en la ventana, y esa
 * rama resultó ser **código muerto**: arrancándola, los diez casos seguían en
 * verde. Los ejemplos del chatbot no la ejercitaban nunca —pasaban por el
 * requisito de que hubiera un agente cerca—, así que el guardia no lo veía
 * ningún caso y, de yapa, dejaba pasar «los agentes trabajan 24/7, y el chatbot
 * también». Lo cazó la mutación, no la lectura: para cada guardia hay que
 * escribir el caso que NINGÚN otro guardia puede ver.
 */

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(AQUI, "..");

/**
 * Lo que se deja afuera, con su motivo a la vista. Vacío a propósito: el sujeto
 * sale del disco, así que un archivo nuevo nace cubierto y sacarlo cuesta
 * escribir acá por qué.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

/**
 * Las formas de decir «todo el tiempo». Van varias a propósito: un gate que
 * persigue UNA sola forma de escribir el defecto cuida medio tema, y la mitad
 * que no cuida es la que se despega.
 */
const CADENCIA_CONTINUA =
  /24\s*\/\s*7|las 24 horas|24 horas al d[ií]a|todo el tiempo|sin parar|a toda hora|sin descanso|de forma continua|permanentemente|todo el d[ií]a/gi;

/** Quién corre una vez por día. */
const AGENTE = /agentes?\b|\bRecall\b|\bCobrador\b/gi;

/** Quién sí contesta a cualquier hora: el webhook del chatbot. */
const BOT = /chatbot|\bbots?\b|whatsapp|asistente|recepcionista/gi;

/**
 * Cuánto texto alrededor cuenta como «al lado». Una persona lee un párrafo, no
 * un archivo: buscar el sujeto en todo el documento haría que cualquier mención
 * lejana del bot absuelva a la promesa —así falla abierto el gate de vecindad,
 * y ya nos pasó en `promesa-fiscal.test.ts`.
 */
const VENTANA = 220;

export interface Hallazgo {
  linea: number;
  cadencia: string;
  contexto: string;
}

/**
 * Quita comentarios CONSERVANDO los saltos de línea, para que el número de
 * línea que reporta el gate no mienta. Se filtra por ESTADO y no por el
 * prefijo de cada línea: el interior de un bloque `/* … *\/` arranca con texto
 * normal, así que un filtro por prefijo acusa a la bitácora que explica el
 * propio defecto — y obedecerlo obliga a borrar el registro de lo que pasó.
 */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

/**
 * Toda cadencia continua que caiga al lado de un agente y NO al lado del bot.
 *
 * Es pura y se exporta para que los casos de abajo la ejerciten con texto
 * armado a mano: un test de guarda escrito sólo contra el árbol vivo pasa en
 * verde aunque le arranquen la guarda, porque el texto de hoy no dispara el
 * patrón. Con fixtures, romper la guarda pone rojo.
 */
export function cadenciaSobreAgentes(fuente: string): Hallazgo[] {
  const texto = sinComentarios(fuente);
  const hallazgos: Hallazgo[] = [];

  for (const m of texto.matchAll(CADENCIA_CONTINUA)) {
    const i = m.index ?? 0;
    const desde = Math.max(0, i - VENTANA);
    const fin = i + m[0].length;
    const ventana = texto.slice(desde, Math.min(texto.length, fin + VENTANA));
    const enVentana = i - desde;

    // De quién es la promesa lo decide el SUJETO que la manda, y en castellano
    // el sujeto va antes de su verbo: «El chatbot contesta 24/7» es del bot
    // aunque dos palabras después nombre a los agentes. Por eso gana el sujeto
    // que está ANTES; sólo si no hay ninguno cuenta el que sigue, que es la
    // forma «número de titular»: `24/7` en la banda y la etiqueta debajo.
    //
    // La exención NO puede ser «el bot aparece en la ventana». Además de dejar
    // pasar «los agentes trabajan 24/7, y el chatbot también», esa rama no la
    // ejercitaba ningún caso —el requisito de que hubiera un agente ya atajaba
    // todos los ejemplos del bot—, así que arrancarla dejaba los diez casos en
    // verde. Un guardia que ningún caso puede ver es un guardia que no está.
    const sujetos = [
      ...[...ventana.matchAll(AGENTE)].map((s) => ({ i: s.index ?? 0, agente: true })),
      ...[...ventana.matchAll(BOT)].map((s) => ({ i: s.index ?? 0, agente: false })),
    ].sort((a, b) => a.i - b.i);

    const antes = sujetos.filter((s) => s.i < enVentana).pop();
    const dueno = antes ?? sujetos.find((s) => s.i >= enVentana);
    if (!dueno?.agente) continue;
    hallazgos.push({
      linea: texto.slice(0, i).split("\n").length,
      cadencia: m[0],
      contexto: ventana.replace(/\s+/g, " ").trim(),
    });
  }
  return hallazgos;
}

function archivosDe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosDe(p));
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

describe("la venta no promete una cadencia que el cron no entrega", () => {
  it("ninguna superficie le pone «todo el tiempo» a los agentes", () => {
    const exentos = new Set(EXENTOS.map((e) => e.archivo));
    const rotos: string[] = [];

    for (const abs of archivosDe(SRC)) {
      const rel = path.relative(SRC, abs);
      if (exentos.has(rel)) continue;
      for (const h of cadenciaSobreAgentes(fs.readFileSync(abs, "utf8"))) {
        rotos.push(`${rel}:${h.linea} — «${h.cadencia}» · ${h.contexto.slice(0, 160)}`);
      }
    }

    expect(
      rotos,
      `Los agentes corren UNA VEZ POR DÍA (cron del VPS: 0 11 * * * run-onia-agents-cron.sh).\n` +
        `Prometer que trabajan todo el tiempo exagera 24 veces algo que se cobra.\n` +
        `El sitio ya lo cuenta bien en /agentes («Corre cada 24 horas», «Revisan tus datos antes de que abras»):\n` +
        `esa es la redacción que va.\n\n${rotos.join("\n")}`,
    ).toEqual([]);
  });

  // La HORA también es cadencia. /agentes decía «Trabajan de noche», el panel
  // dibujado «03:12 · cerrado … escritas de madrugada» y /nosotros «trabajan de
  // noche»: el cron los despierta a las 07:00 La Paz. Corregido el 2026-09-28
  // (condición 8 de la 1.0); /v1 y /servicios quedan afuera: están congelados.
  it("la superficie viva no ubica la corrida de los agentes de noche", () => {
    const vivo = path.join(SRC, "app", "(sitio)");
    const rotos = archivosDe(vivo).flatMap((abs) => {
      const texto = sinComentarios(fs.readFileSync(abs, "utf8"));
      return /trabajan de noche|de madrugada|03:12/i.test(texto) ? [path.relative(SRC, abs)] : [];
    });
    expect(rotos).toEqual([]);
  });

  it("el sujeto sale del disco: si el árbol se recorta, el gate lo dice", () => {
    // Sin esto, alguien puede achicar el recorrido a una carpeta y el gate
    // sigue verde sobre un árbol entero sin vigilar. Ya pasó: `precios.test.ts`
    // declaraba en su comentario que derivaba del disco y sus cuatro raíces
    // escritas a mano dejaban afuera `app/v1/**`, donde vivía el defecto.
    const archivos = archivosDe(SRC).map((a) => path.relative(SRC, a));
    expect(archivos).toContain(path.join("app", "(sitio)", "page.tsx"));
    expect(archivos).toContain(path.join("app", "v1", "page.tsx"));
    expect(archivos.length).toBeGreaterThan(80);
  });

  describe("la guarda, ejercitada con texto armado (no con el árbol de hoy)", () => {
    it("caza la promesa en la forma REAL en que apareció (banda de la portada)", () => {
      const comoEstaba = `
        <div className={s.trustNum}>24/7</div>
        <p className={s.trustLabel}>
          agentes que trabajan y esperan tu aprobación
        </p>`;
      expect(cadenciaSobreAgentes(comoEstaba)).toHaveLength(1);
    });

    it("caza la forma del <head>, que ningún instrumento visual mira", () => {
      const comoEstaba = `agenda, clientes, cobros y agentes que trabajan 24/7 con tu aprobación.`;
      expect(cadenciaSobreAgentes(comoEstaba)).toHaveLength(1);
    });

    it("caza las otras formas de decirlo, no sólo «24/7»", () => {
      for (const forma of [
        "los agentes revisan tus datos las 24 horas",
        "Recall trabaja todo el tiempo",
        "Cobrador persigue la deuda sin parar",
        "agentes que corren a toda hora",
      ]) {
        expect(cadenciaSobreAgentes(forma), forma).toHaveLength(1);
      }
    });

    it("NO acusa al chatbot, que sí contesta a cualquier hora", () => {
      // El caso que YA cumple. Sin él, la exención no está probada y el gate
      // podría estar prohibiendo un texto legítimo sin que nadie lo note.
      const legitimo = `Chatbot de WhatsApp que contesta 24/7 con la información real de tu negocio y deriva a una persona lo que necesite decisión.`;
      expect(cadenciaSobreAgentes(legitimo)).toEqual([]);
    });

    it("con los dos en el párrafo, manda el sujeto que va ANTES", () => {
      // Los dos casos que sólo esta regla puede ver. Con una exención por mera
      // presencia del bot, el primero pasaba en verde: alcanzaba con nombrar al
      // chatbot cerca para blanquear la promesa de los agentes.
      const delAgente = `Los agentes trabajan 24/7 por vos, y el chatbot también contesta siempre.`;
      expect(cadenciaSobreAgentes(delAgente)).toHaveLength(1);

      const delBot = `El chatbot contesta 24/7; los agentes, en cambio, corren de noche.`;
      expect(cadenciaSobreAgentes(delBot)).toEqual([]);
    });

    it("NO acusa al ancla de precio del chatbot, aunque nombre las 24 horas", () => {
      const legitimo = `Bs 390/mes es el 12 % del salario mínimo, sin aguinaldo ni domingos, por algo que atiende las 24 horas. El chatbot no toma vacaciones.`;
      expect(cadenciaSobreAgentes(legitimo)).toEqual([]);
    });

    it("NO acusa a la redacción verdadera que el sitio ya usa", () => {
      for (const bueno of [
        "Recall detecta clientes que no vuelven y redacta el mensaje. Corre cada 24 horas.",
        "Cada mañana, antes de que abras, los agentes revisan tus datos y te dejan los mensajes escritos.",
      ]) {
        expect(cadenciaSobreAgentes(bueno), bueno).toEqual([]);
      }
    });

    it("no se lo come un comentario: la bitácora que explica el defecto no es el defecto", () => {
      const bitacora = `/* La banda decía 24/7 sobre los agentes y era falso. */`;
      expect(cadenciaSobreAgentes(bitacora)).toEqual([]);
    });

    it("la vecindad es un párrafo, no el archivo entero", () => {
      // Una mención lejanísima del bot no absuelve a la promesa de los agentes:
      // así falla ABIERTO un gate de vecindad al que le agrandan la ventana.
      const lejos = `agentes que trabajan 24/7.${" ".repeat(2000)}El chatbot contesta solo.`;
      expect(cadenciaSobreAgentes(lejos)).toHaveLength(1);

      // Y la dirección cara, que es la que sólo la ventana puede ver: una
      // cadencia SIN sujeto al lado no es de nadie. Sin ventana acotada, el
      // gate sale a buscar dueño hasta el otro extremo del archivo y acusa a
      // una frase que no habla de los agentes — un rojo falso manda a borrar
      // copy sano, que es peor que no tener gate.
      const sinDueno = `El sistema corre 24/7.${" ".repeat(2000)}Los agentes proponen y esperan tu OK.`;
      expect(cadenciaSobreAgentes(sinDueno)).toEqual([]);
    });
  });
});
