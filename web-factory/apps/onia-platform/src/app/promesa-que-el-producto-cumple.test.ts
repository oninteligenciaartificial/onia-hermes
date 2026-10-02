import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * La web no promete lo que el producto no hace HOY: ni que agenda solo, ni que
 * la IA hace más de lo que hace.
 *
 * **Por qué existe** (auditoría de producción del 2026-10-02, §5 Estética). La
 * web prometía en estética «con el control ya en la agenda», y el sistema no
 * agenda solo: el agente detecta a la clienta y deja el mensaje con el link
 * para que ELLA reserve, y el dueño lo aprueba. El arreglo (`3cf50229f`) cambió
 * esa frase y la de /rubros, pero no dejó gate: la promesa podía volver con
 * otras palabras en cualquier archivo. Y el barrido del 2-oct encontró sus
 * hermanas vivas en otras pantallas, medidas contra la fuente de «qué se
 * vende» (`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §2, §7 y §8, y su
 * inventario `docs/research/ONIA_INVENTARIO_IA_20261002.md` §4):
 *
 *  - «Entiende las fotos que te mandan» (/chatbot, /precios, datos
 *    estructurados): §8 lo prohíbe — solo corre en modo recepcionista, ningún
 *    negocio está en ese modo y se probó una vez en QA, en agosto.
 *  - «Agentes con IA que cada mañana revisan tus datos» (descripción de
 *    /agentes, la que viaja a Google y a WhatsApp): a quién y cuándo lo deciden
 *    reglas fijas; la IA redacta UNA plantilla por agente (§8).
 *  - «lo que te sirve sale por tu WhatsApp» (/agentes): el envío automático
 *    necesita un número conectado, y hoy hay 0 (§7: el WhatsApp automático no se
 *    nombra). Lo que sale siempre es el link para mandarlo con un toque.
 *  - «agenda por profesional» (dental, /rubros): la agenda no tiene vista ni
 *    filtro por profesional; cada cita dice con quién es (onia-platform
 *    `app/(dashboard)/agenda/AgendaClient.tsx`, `variosProfesionales`).
 *  - «La clienta que dejó el tratamiento a medias no se pierde» (/rubros): un
 *    resultado prometido. Lo que el producto hace es el mecanismo —la detecta y
 *    te deja el mensaje— y eso es lo que se dice.
 *
 * Qué prohíbe: la FORMA de cada promesa, no la frase vieja. Prohibir solo el
 * texto del 2-oct se apagaría el día que alguien la reescriba.
 *
 * Universo: todo `src/` que el visitante puede ver, derivado del disco. Quedan
 * afuera, con su motivo: los tests; `app/v1/**` y `components/landing-v1/**`
 * (la web anterior: 308 a la portada desde el 28-sep, `next.config.ts`);
 * `app/servicios/consultoria` y `app/servicios/marketing-ia` (308 a la
 * portada); `app/patrones` (demo interna, fuera del sitemap).
 *
 * Cuándo se afloja un patrón: el día que el producto lo haga en producción y se
 * MIRE ahí (p. ej., un número de cliente conectado que mande solo). Se borra el
 * patrón con esa medición en el commit, no antes.
 */

const SRC = join(process.cwd(), "src");

const AFUERA = [
  /\.test\.tsx?$/,
  /^app\/v1\//,
  /^components\/landing-v1\//,
  /^app\/servicios\/(consultoria|marketing-ia)\//,
  /^app\/patrones\//,
];

function archivosVisibles(dir = SRC): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return archivosVisibles(ruta);
    if (!/\.(tsx?|md)$/.test(nombre)) return [];
    const rel = relative(SRC, ruta).split(sep).join("/");
    return AFUERA.some((re) => re.test(rel)) ? [] : [rel];
  });
}

/** Comentarios en blanco: explican y acusan, y no son superficie de cliente. */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, antes: string) => antes + m.slice(antes.length).replace(/[^\n]/g, " "));
}

const PROMESAS: readonly { que: string; forma: RegExp; porque: string }[] = [
  {
    que: "el sistema agenda solo",
    forma:
      /control ya en la agenda|ya (queda )?en la agenda|entra en la agenda|como una cita m[aá]s|\b(se|te|lo|la|les?) agenda(n)? sol[oa]s?\b|agenda por vos|agenda(n)? autom[aá]tic|la IA (te )?agenda/i,
    porque:
      "El sistema no agenda: el agente deja el mensaje con el link para que el cliente reserve, y el dueño lo aprueba (catálogo §2 y §8).",
  },
  {
    que: "la IA revisa, decide, escribe cada mensaje o atiende",
    forma:
      /(agentes?|asistente) (de|con) IA que (\S+ ){0,3}?(escrib|revis|decid|respond|atiend|agend|contest)|la IA (escribe|decide|revisa|atiende|responde|contesta|agenda)\b/i,
    porque:
      "La IA redacta UNA plantilla por agente y el dueño la aprueba una vez; a quién y cuándo lo deciden reglas fijas (catálogo §8).",
  },
  {
    que: "entiende fotos, audios o comprobantes",
    forma: /entiende (las |tus |los )?(fotos|audios|notas de voz|comprobantes|im[aá]genes)/i,
    porque:
      "§8 del catálogo: no se puede decir que entiende fotos, comprobantes ni notas de voz (en duda: 0 negocios en modo recepcionista, el transcriptor no existe en el VPS).",
  },
  {
    que: "el mensaje sale solo por WhatsApp",
    forma: /sale(n)? (sol[oa]s? )?por tu WhatsApp|se env[ií]a(n)? sol[oa]s? por WhatsApp/i,
    porque:
      "El envío automático por WhatsApp necesita un número conectado y hoy hay 0 (catálogo §7). Lo que siempre existe es el link para mandarlo con un toque.",
  },
  {
    que: "agenda por profesional",
    forma: /agenda por profesional|agenda de cada profesional/i,
    porque:
      "La agenda no tiene vista ni filtro por profesional: cada cita dice con quién es (AgendaClient.tsx, variosProfesionales).",
  },
  {
    que: "un resultado prometido sobre el tratamiento a medias",
    forma: /tratamiento a medias (ya )?no se pierde|recupera(s|mos|r)? (a )?(tus |los |las )?(pacientes|clientas?|clientes)/i,
    porque:
      "Lo que el producto hace es el mecanismo —detecta y deja el mensaje para aprobar—, no el resultado (catálogo §8).",
  },
];

describe("la web promete lo que el producto hace hoy", () => {
  const archivos = archivosVisibles();

  it("el universo sale del disco e incluye las superficies donde vivían estas promesas", () => {
    expect(archivos).toEqual(
      expect.arrayContaining([
        "app/(sitio)/rubros/page.tsx",
        "app/(sitio)/switcher.tsx",
        "app/(sitio)/agentes/page.tsx",
        "app/(sitio)/chatbot/page.tsx",
        "lib/pricing.ts",
        "content/chatbot-precios.ts",
        "app/layout.tsx",
      ]),
    );
  });

  for (const { que, forma, porque } of PROMESAS) {
    it(`ninguna pantalla promete que ${que}`, () => {
      // El texto de JSX se parte en varias líneas: se busca sobre el archivo con
      // los espacios colapsados, o «sale por tu⏎WhatsApp» pasaría de largo.
      const global = new RegExp(forma.source, `${forma.flags}g`);
      const culpables = archivos.flatMap((rel) => {
        const texto = sinComentarios(readFileSync(join(SRC, rel), "utf8")).replace(/\s+/g, " ");
        return [...texto.matchAll(global)].map((m) => `${rel} «…${texto.slice(Math.max(0, m.index - 50), m.index + m[0].length + 30)}…»`);
      });
      expect(culpables, porque).toEqual([]);
    });
  }

  it("cada forma reconoce la frase que la originó (si no, el gate firma verde sin mirar)", () => {
    const originales = [
      "Las clientas que dejaron el tratamiento, con el control ya en la agenda.",
      "Agentes con IA que cada mañana revisan tus datos según tu rubro",
      "agentes con IA que te escriben los mensajes",
      "Entiende las fotos que te mandan y te las pasa con la conversación",
      "lo que te sirve sale por tu WhatsApp, o te queda para mandarlo con un toque.",
      "Pacientes, tratamientos, odontograma y agenda por profesional.",
      "La clienta que dejó el tratamiento a medias no se pierde: te queda el mensaje escrito",
    ];
    for (const frase of originales) {
      expect(PROMESAS.some(({ forma }) => forma.test(frase)), frase).toBe(true);
    }
  });

  it("y deja pasar lo que el producto sí hace", () => {
    const permitidas = [
      "Agentes con IA que proponen y esperan tu aprobación",
      "La IA redacta el texto de cada agente y vos lo aprobás una vez",
      "te queda el mensaje escrito con tu link para que reserve, y vos lo aprobás.",
      "El que te factura en Bolivia no te agenda. El que te agenda no factura en Bolivia.",
      "Te piden cita solos por tu link público",
      "aprobás lo que te sirve y lo mandás por tu WhatsApp con un toque.",
    ];
    for (const frase of permitidas) {
      expect(PROMESAS.filter(({ forma }) => forma.test(frase)).map((p) => p.que), frase).toEqual([]);
    }
  });
});
