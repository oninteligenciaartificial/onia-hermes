import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import {
  PROMESAS,
  promesasEn,
  revisar,
  textoDeFuente,
  textoDeHtml,
} from "../../scripts/promesa-que-el-producto-cumple.mjs";
import { htmlDe, renderizarPublicadas, RUTAS_PUBLICADAS, TIEMPO_PARA_RENDERIZAR } from "./html-servido";

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
 * Y la revisión del 3-oct encontró dos más que el gate no veía: «Los agentes te
 * devuelven clientes que se estaban yendo» (tarjeta del Crece en /precios: un
 * resultado dicho al revés) y «La IA te propone el texto y vos lo aprobás»
 * (descripción de /agentes: se lee como que redacta cada mensaje).
 *
 * Qué prohíbe: la FORMA de cada promesa, no la frase vieja. Prohibir solo el
 * texto del 2-oct se apagaría el día que alguien la reescriba. Las formas viven
 * en `scripts/promesa-que-el-producto-cumple.mjs` porque las comparte el gate
 * del kit de venta (`onia-hermes/scripts/venta-honestidad.test.mjs`): el one-pager
 * siguió diciendo las cuatro del 2-oct después de que la web las sacó.
 *
 * Cómo lee: lo que el visitante LEE, no el código. La fuente sin comentarios,
 * sin etiquetas y sin los `{" "}` de prettier (hasta el 3-oct, `agenda
 * <em>por profesional</em>` pasaba en verde), y además el HTML que el servidor
 * manda de cada ruta publicada. Y los comentarios, aparte: los lee la próxima
 * sesión como regla (abajo).
 *
 * Universo: todo `src/` que el visitante puede ver, derivado del disco. Quedan
 * afuera, con su motivo: los tests; `app/v1/**` y `components/landing-v1/**`
 * (la web anterior: 308 a la portada desde el 28-sep, `next.config.ts`);
 * `app/servicios/consultoria` y `app/servicios/marketing-ia` (308 a la
 * portada); `app/patrones` (demo interna, fuera del sitemap).
 *
 * Cuándo se afloja un patrón: el día que el producto lo haga en producción y se
 * MIRE ahí (p. ej., un número de cliente conectado que mande solo). Se borra el
 * patrón con esa medición en el commit, no antes — en el módulo, y se afloja
 * para el sitio y el kit a la vez.
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

  for (const { que, porque } of PROMESAS) {
    it(`ninguna pantalla promete que ${que}`, () => {
      // El texto de JSX se parte en líneas, en etiquetas (`agenda <em>por profesional</em>`) y en
      // los `{" "}` que mete prettier: se busca sobre el texto con todo eso unido.
      const culpables = archivos.flatMap((rel) => {
        const texto = textoDeFuente(readFileSync(join(SRC, rel), "utf8"));
        return promesasEn(texto)
          .filter((p) => p.que === que)
          .map((p) => `${rel} «…${p.fragmento}…»`);
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
      // 3-oct: la tarjeta del Crece en /precios, y la descripción de /agentes.
      "Los agentes te devuelven clientes que se estaban yendo: proponen a quién contactar y vos aprobás.",
      "te dejan la propuesta en Pendientes. La IA te propone el texto y vos lo aprobás. Nada sale sin tu OK.",
    ];
    for (const frase of originales) {
      expect(promesasEn(frase).length, frase).toBeGreaterThan(0);
    }
  });

  it("y reconoce las reescrituras más probables: etiquetas, {\" \"}, voseo y plural", () => {
    // Fuente JSX: la palabra clave resaltada o el corte de prettier parten la frase.
    const enFuente = [
      "<h2>Tu agenda <em>por profesional</em></h2>",
      "<p>aprobás y sale por tu{\" \"}\n<strong>WhatsApp</strong></p>",
      "<p>sale por tu{\" \"}WhatsApp</p>",
      "<li>Entiende las <strong>fotos</strong> que te mandan</li>",
    ];
    for (const fuente of enFuente) expect(promesasEn(textoDeFuente(fuente)).length, fuente).toBeGreaterThan(0);

    // HTML servido: lo mismo, más los separadores que React mete entre nodos de texto.
    const enHtml = [
      "<p>sale <em>por tu WhatsApp</em></p>",
      "<p>sale por tu<!-- --> <!-- -->WhatsApp</p>",
      "<p>agenda&nbsp;por profesional</p>",
    ];
    for (const html of enHtml) expect(promesasEn(textoDeHtml(html)).length, html).toBeGreaterThan(0);

    // Voseo con tilde (el sitio habla de vos), plural y la promesa dicha al revés.
    const reescritas = [
      "Recuperás a tus pacientes con tratamiento a medias",
      "Recuperá a las clientas que no volvieron",
      "Los agentes te recuperan clientes",
      "Onia te devuelve los pacientes que se iban",
      "El agente le agenda la cita al paciente",
      "La IA te agenda los controles",
      "El sistema agenda solo",
      "Onia te manda el recordatorio y se envía solo por WhatsApp",
    ];
    for (const frase of reescritas) expect(promesasEn(frase).length, frase).toBeGreaterThan(0);
  });

  it("y deja pasar lo que el producto sí hace", () => {
    const permitidas = [
      "Agentes con IA que proponen y esperan tu aprobación",
      "La IA redacta el texto de cada agente y vos lo aprobás una vez",
      "La IA te propone el texto de cada agente y lo aprobás una vez.",
      "Onia te propone con IA el texto de cada recordatorio con el tono de tu negocio. Vos lo revisás y lo aprobás una sola vez.",
      "te queda el mensaje escrito con tu link para que reserve, y vos lo aprobás.",
      "El que te factura en Bolivia no te agenda. El que te agenda no factura en Bolivia.",
      "Te piden cita solos por tu link público",
      "aprobás lo que te sirve y lo mandás por tu WhatsApp con un toque.",
      "Cada mañana los agentes te dejan anotado a quién escribirle y el mensaje listo; vos aprobás.",
      // El link de reserva SÍ crea la cita (onia-platform app/api/booking/appointments/route.ts,
      // `tx.appointment.create`) y viene incluido desde Crece: es un argumento de venta verdadero.
      "Tus pacientes se agendan solos desde tu link público",
      "La reserva entra en la agenda como una cita más",
      "Reservan por tu link y la cita ya queda en la agenda",
      "El agente te deja el mensaje con tu link; el paciente reserva solo y la cita queda en tu agenda.",
    ];
    for (const frase of permitidas) {
      expect(promesasEn(frase).map((p) => p.que), frase).toEqual([]);
    }
  });
});

/**
 * La segunda pasada: lo que el visitante LEE. La fuente se lee archivo por archivo, y una frase
 * armada entre dos archivos (un texto de `lib/` más el que lo rodea en la página) solo existe
 * junta en el HTML. Se renderiza cada ruta publicada como lo hace Next, se sacan las etiquetas y
 * se buscan las mismas formas. Incluye los datos estructurados (JSON-LD): los lee Google.
 */
describe("y el HTML servido de cada página tampoco lo promete", () => {
  let renderizadas: Map<string, string | Error>;
  beforeAll(async () => {
    renderizadas = await renderizarPublicadas();
  }, TIEMPO_PARA_RENDERIZAR);

  for (const ruta of RUTAS_PUBLICADAS) {
    it(`${ruta}`, () => {
      const culpables = promesasEn(textoDeHtml(htmlDe(renderizadas, ruta))).map(
        (p) => `${p.que} «…${p.fragmento}…» — ${p.porque}`,
      );
      expect(culpables).toEqual([]);
    });
  }
});

/**
 * La tercera: un COMENTARIO que manda a decir lo prohibido. Los comentarios no se ven, pero los lee
 * la próxima sesión como regla vigente. El 2-oct se dio vuelta `nombre-del-addon.test.ts` (ahora
 * prohíbe las fotos) y el docblock de `CHATBOT_EN_LA_CARTA` siguió diciendo «La IA real se dice
 * concreta donde es real («entiende las fotos»). Lo vigila nombre-del-addon.test.ts»: la
 * instrucción contraria al test que citaba (CLAUDE.md: el barrido alcanza a las reglas que la citan).
 *
 * Un comentario SÍ puede nombrar la promesa para contar que se sacó, y casi todos lo hacen
 * («…decía hasta el 2-oct», «Sin «…» desde el 2-oct (catálogo §8)», «Corregido…»): esa frase lleva
 * la marca de que ya no se dice. Lo que no puede es nombrarla sin esa marca.
 */
const YA_NO_SE_DICE =
  /dec[ií]an?\b|\biba\b|hasta el \d|corregid|\bsin «|se sac(ó|o|aron)\b|prohib|§\s?[78]\b|no se (dice|puede|promete|nombra)|\bya no\b|no vuelv/i;

/**
 * Las frases de cada comentario del fuente, en texto plano. Los `//` de renglones seguidos son UN
 * comentario: una frase partida en dos renglones lleva su «decía hasta…» en el de arriba.
 */
function frasesDeComentarios(fuente: string): string[] {
  const comentarios = [...fuente.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => m[0].replace(/^\s*\/?\*+\/?|\*+\/$/gm, " "));
  let seguidos: string[] = [];
  const cerrar = () => {
    if (seguidos.length) comentarios.push(seguidos.join(" "));
    seguidos = [];
  };
  for (const renglon of sinBloques(fuente).split("\n")) {
    const entero = /^\s*\/\/(.*)$/.exec(renglon);
    if (entero) {
      seguidos.push(entero[1]);
      continue;
    }
    cerrar();
    const alFinal = /(?:^|[^:"'`])\/\/(.*)$/.exec(renglon);
    if (alFinal) comentarios.push(alFinal[1]);
  }
  cerrar();
  return comentarios.flatMap((c) => c.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚ«¿¡(`])/));
}

/** Los bloques `/* … *\/` en blanco (conservando renglones), para no leerlos dos veces. */
const sinBloques = (fuente: string) => fuente.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

function comentariosQueLaMandanADecir(fuente: string): string[] {
  return frasesDeComentarios(fuente).filter((frase) => promesasEn(frase).length > 0 && !YA_NO_SE_DICE.test(frase));
}

describe("y ningún comentario manda a decir lo que el producto no hace", () => {
  it("cada comentario que nombra una promesa prohibida cuenta que ya no se dice", () => {
    const culpables = archivosVisibles().flatMap((rel) =>
      comentariosQueLaMandanADecir(readFileSync(join(SRC, rel), "utf8")).map((frase) => `${rel} «${frase.trim()}»`),
    );
    expect(
      culpables,
      "Un comentario que nombra la promesa tiene que decir que se sacó y por qué (p. ej. «decía hasta el 2-oct; catálogo §8»).",
    ).toEqual([]);
  });

  it("el detector reconoce la instrucción del 2-oct y deja pasar la historia", () => {
    const instruccion = `/** que el negocio cargó, no de un modelo. La IA real se dice concreta donde es
 *  real («entiende las fotos»). Lo vigila \`src/app/(sitio)/nombre-del-addon.test.ts\`. */`;
    expect(comentariosQueLaMandanADecir(instruccion)).toHaveLength(1);

    const historia = [
      "// Sin «entiende las fotos que te mandan» desde el 2-oct (catálogo §8).",
      "// «Agentes con IA que cada mañana revisan tus datos» decía hasta el 2-oct: a quién y",
      "{/* Corregido 2026-10-02: decía «lo que te sirve sale por tu WhatsApp», y el envío solo */}",
      'const url = "https://onia.com.bo/agenda"; // la agenda con el profesional de cada cita',
    ].join("\n");
    expect(comentariosQueLaMandanADecir(historia)).toEqual([]);
  });
});

/**
 * La revisión a mano (`npm run promesas:revisar -- <archivo>`), para un borrador antes de mandarlo:
 * un mensaje a un lead o un anuncio no pasan por ningún gate. No puede salir verde sin haber leído.
 */
describe("la revisión a mano de un borrador", () => {
  it("sale 1 si promete, 0 si no, y 2 si no leyó nada", () => {
    const dir = mkdtempSync(join(tmpdir(), "promesas-"));
    try {
      const promete = join(dir, "borrador.md");
      writeFileSync(promete, "Hola! Onia **entiende las fotos** y sale por tu WhatsApp solo.");
      const limpio = join(dir, "limpio.md");
      writeFileSync(limpio, "Cada mañana te deja el mensaje listo y lo mandás por tu WhatsApp con un toque.");
      const salida: string[] = [];
      expect(revisar([promete], (l: string) => salida.push(l))).toBe(1);
      expect(salida.join("\n")).toMatch(/entiende fotos.*\n[\s\S]*sale solo por WhatsApp/);
      expect(revisar([limpio], () => {})).toBe(0);
      expect(revisar([], () => {})).toBe(2);
      expect(revisar([join(dir, "no-existe.md")], () => {})).toBe(2);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
