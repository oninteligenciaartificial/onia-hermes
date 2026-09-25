import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * La venta NUNCA exhibe obra, y nunca se elogia sola — en TODA la superficie.
 *
 * 🔴 POR QUE EXISTE. La regla es de Sergio Urcullo, 2026-08-20, y nació mirando
 * esta misma landing: la banda de Módulos tenía **cinco «muy pronto»** en la
 * pantalla de venta. Textual: *"no entiendo por qué dices si es que estamos
 * construyendo algo que aún no está listo… hace escapar a los clientes porque
 * hacen creer que el sistema no funciona. Como regla nunca hagas eso."*
 *
 * ⚠️ LO QUE ESTABA DESCUBIERTO, medido el 2026-09-25 sobre el árbol. La regla
 * tenía UN solo gate —`lib/cta-sin-obra.test.ts`— y ese gate lee **un archivo**:
 * `site.ts`, los textos que el lead ENVÍA por WhatsApp. Los otros 139 archivos de
 * cara al cliente (las 24 rutas del sitio, sus componentes y los `.md` de
 * contenido) no tenían nada. O sea que el defecto ORIGINAL —un «muy pronto»
 * pintado en una página— era justo el que ningún gate podía ver.
 *
 * Lo único que lo cubría era el `grep` de arranque del loop, sobre 4 de las 24
 * rutas y contra el HTML servido. Por `CLAUDE.md` eso sirve para **descartar,
 * nunca para confirmar**: React parte el texto con `<!-- -->`, el dato puede venir
 * importado, los acentos salen escapados en el build, y el contenido pintado tras
 * una interacción no está en el HTML. Un instrumento que no puede ver el defecto
 * no es cobertura.
 *
 * CÓMO NO FALLA EN VERDE:
 *  1. Los sujetos se derivan del DISCO, no de una lista de rutas — una página
 *     nueva nace cubierta (es el método de `voz.test.ts`, que ya pagó esa lección).
 *  2. Si el descubrimiento se rompe, el gate se pone ROJO por `MINIMO_ARCHIVOS`
 *     en vez de aprobar la nada (es el `MINIMO_LITERALES` de su hermano).
 *  3. Se mide el texto de la línea, no sólo los literales de string: el defecto
 *     del 20-ago vivía en JSX (`<span>Muy pronto</span>`), que ningún extractor
 *     de strings ve.
 *
 * ⚠️ POR QUE LA LISTA ES MÁS CORTA QUE LA DE SU HERMANO. `cta-sin-obra.test.ts`
 * puede prohibir `todavía no`, `avisen cuando` y `cuando esté listo` porque mira
 * frases que el lead pone **en su propia boca**, donde no hay otro sentido
 * posible. Acá esas tres formas son ambiguas y romperían cosas correctas —
 * medido, no supuesto: `todavía no` aparece 7 veces en el árbol y las 7 son
 * legítimas (*"el que **todavía no** sabe si esto es para su rubro"*,
 * *"quien **todavía no** es cliente"* en privacidad, y el límite fiscal real de
 * `pricing.ts`/`proof.ts`). Y «te avisa cuando un cliente no volvió» es una
 * capacidad que se VENDE. Un gate que grita por algo correcto es un gate que
 * alguien apaga en la primera corrida, y entonces no cubre nada.
 *
 * ⚠️ ESTO NO TOCA LA HONESTIDAD FISCAL ni la legal. «En trámite de homologación
 * ante el SIN» (`lib/siat.ts`) es un estado legal declarado a propósito: taparlo
 * sería fabricar. Lo prohibido acá es anunciar que el PRODUCTO está a medio
 * construir, o elogiarse.
 *
 * ⚠️ LOS COMENTARIOS SE FILTRAN ANTES DE BUSCAR, blanqueados conservando los
 * saltos de línea. Si no, este mismo bloque —que cita las frases prohibidas para
 * explicar por qué existe el gate— lo pondría en rojo, y el número de línea del
 * error apuntaría al renglón equivocado.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = dirname(dirname(AQUI));

/**
 * Si el descubrimiento devuelve menos que esto, cambió de forma el árbol o se
 * rompió el recorrido: rojo, no verde. Eran 140 el 2026-09-25.
 */
const MINIMO_ARCHIVOS = 80;

/**
 * Obra a la vista y autobombo, en las formas INEQUÍVOCAS — cada una con lo que
 * hay que hacer en su lugar, para que el error diga qué poner y no sólo qué está
 * mal. Deliberadamente conservadora: ver el bloque de arriba.
 */
const PROHIBIDO: [RegExp, string][] = [
  // Obra a la vista. Las cuatro que nombra CLAUDE.md, más las que dicen lo
  // mismo sin usar ninguna de esas palabras.
  [/muy pronto/i, "lo que no está listo no se nombra"],
  [/pr[oó]ximamente/i, "lo que no está listo no se nombra"],
  [/en construcci[oó]n/i, "lo que no está listo no se nombra"],
  [/\bbeta\b/i, "el producto se vende terminado o no se nombra"],
  [/en desarrollo/i, "lo que no está listo no se nombra"],
  [/estamos (trabajando|construyendo|desarrollando)/i, "hablar de lo vivo"],
  [/lista de espera/i, "capturar la demanda sin admitir obra: «¿Otro rubro? Escribinos»"],
  [/\bfase\s+\d/i, "un plan de obra no va en la pantalla de venta"],
  [/\bhoja de ruta\b|\broadmap\b/i, "un plan de obra no va en la pantalla de venta"],

  // Autobombo. Sergio, 2026-09-03: «habla de nuestras competencias… datos que no
  // son importantes». Al dueño de un negocio le importa SU problema, no nosotros.
  [/\bl[ií]der(es|azgo)?\b/i, "beneficio para el cliente, no posición nuestra"],
  [/revolucion/i, "decir qué hace, no cuánto impresiona"],
  [/n[uú]mero 1\b|#1\b/i, "cero prueba social fabricada: no hay clientes pagando"],
  [/de vanguardia|a la vanguardia/i, "decir qué hace, no cuánto impresiona"],
  [/\b[úu]nic[oa]s? en (el mercado|bolivia|santa cruz)\b/i, "cero superlativos sin prueba"],
  [/innovador|disruptiv/i, "decir qué hace, no cuánto impresiona"],
];

/** Todo lo que termina siendo texto en pantalla, descubierto del disco. */
function archivosDeCliente(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return archivosDeCliente(ruta);
    if (!e.isFile()) return [];
    if (/\.test\.[tj]sx?$/.test(e.name)) return []; // los tests citan el defecto
    return /\.(tsx|ts|md)$/.test(e.name) ? [ruta] : [];
  });
}

/** Blanquea comentarios conservando los saltos de línea (número de línea fiel). */
function soloTextoVisible(fuente: string): string {
  const enBlanco = (m: string) => m.replace(/[^\n]/g, " ");
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, enBlanco)
    .replace(/^\s*\/\/.*$/gm, enBlanco);
}

const ARCHIVOS = archivosDeCliente(SRC).sort();

describe("la venta no exhibe obra ni se elogia sola", () => {
  it("descubre los archivos de cara al cliente del disco, no de una lista fija", () => {
    expect(ARCHIVOS.length).toBeGreaterThanOrEqual(MINIMO_ARCHIVOS);
  });

  it.each(PROHIBIDO)("ninguna pantalla dice %s (%s)", (forma, enSuLugar) => {
    const culpables: string[] = [];
    for (const ruta of ARCHIVOS) {
      const texto = soloTextoVisible(readFileSync(ruta, "utf8"));
      for (const [i, linea] of texto.split("\n").entries()) {
        if (forma.test(linea)) {
          culpables.push(
            `${relative(SRC, ruta)}:${i + 1} → ${enSuLugar}\n     ${linea.trim().slice(0, 120)}`,
          );
        }
      }
    }
    expect(culpables, culpables.join("\n")).toEqual([]);
  });

  it("detecta el defecto REAL del 2026-08-20, no una forma cómoda", () => {
    // Las cinco banderas que Sergio encontró vivas en la banda de Módulos, y la
    // frase de autobombo que la regla de 2026-09-03 saca de la venta. Si alguien
    // afloja los patrones, este caso se cae antes que los de arriba.
    const comoEstaba = [
      "Muy pronto",
      "Próximamente disponible",
      "Módulo en construcción",
      "Somos líderes en gestión para clínicas",
      "La plataforma número 1 de Bolivia",
    ];
    for (const texto of comoEstaba) {
      expect(
        PROHIBIDO.some(([forma]) => forma.test(texto)),
        `«${texto}» tendría que estar prohibido`,
      ).toBe(true);
    }
  });

  it("no grita por lo que SÍ se puede decir", () => {
    // La contracara, que es lo que mantiene vivo a un gate. Las tres primeras son
    // texto REAL del árbol; la cuarta es una capacidad que se vende.
    const legitimo = [
      "Para el que todavía no sabe si esto es para su rubro.",
      "Contacto de quien todavía no es cliente",
      "nuestro emisor está en trámite de homologación ante el SIN y todavía no emite factura",
      "Te avisa cuando un cliente no volvió.",
      "Probá 14 días el plan Profesional completo.",
    ];
    for (const texto of legitimo) {
      const grita = PROHIBIDO.filter(([forma]) => forma.test(texto));
      expect(grita.map(([f]) => String(f)), `«${texto}»`).toEqual([]);
    }
  });
});
