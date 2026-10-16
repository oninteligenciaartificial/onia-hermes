// Gate de la PRUEBA 1 v2 («Grupo 1 = réplica»): las piezas que copian, zona por zona, un anuncio de la competencia que dura.
//
// Nace el 11-oct-2026. Sergio Urcullo vio A1-E y dijo «ese ad está horrible, mejoralos»: una losa de texto sin persona, con la
// captura ilegible, dos llamados, de vos y un gancho de 3 líneas con punto. Esta suite no juzga el diseño (eso lo mira una
// persona con la hoja delante); fija lo que SÍ se puede medir para que no vuelva a pasar:
//   · cada pieza copia una referencia que existe, capturada, con más de 50 días al aire;
//   · el texto es de usted, no promete lo que el catálogo prohíbe (el MISMO detector que vigila la web) y no trae cifras, precio,
//     competidores ni «IA»;
//   · el gancho cumple el checklist (≤ 2 líneas cortas, sin punto final, un solo énfasis);
//   · hay UN solo llamado y el código del anuncio lo lee el motor REAL del bot (letra + número y nada más);
//   · lo que la pieza describe está atado a una fila de ONIA_PROMESA_VS_PRODUCTO.md;
//   · la hoja «referencia | nuestra» y los cuadros están renderizados.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { promesasEn } from "../web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs";
import { createState, step } from "../hermes-content/deploy/vps-ops/bot/bot-engine.mjs";
import { configComoProduccion } from "../hermes-content/deploy/vps-ops/bot/config-como-produccion.mjs";

const aRuta = (ruta) => new URL(`../${ruta}`, import.meta.url);
const leer = (ruta) => readFileSync(aRuta(ruta), "utf8");
const DIR = "hermes-content/carousels/briefs/ads/prueba1-v2";
const OUT = "hermes-content/carousels/out/ads/prueba1-v2";
const ANUNCIOS = "hermes-content/research/competencia/anuncios";
// El corte de los días al aire es el del encargo (11-oct-2026).
const HOY = Date.parse("2026-10-11T12:00:00Z");

const piezas = readdirSync(aRuta(`${DIR}/`))
  .filter((f) => /^G1-\d+\.json$/.test(f))
  .sort()
  .map((f) => ({ archivo: f, b: JSON.parse(leer(`${DIR}/${f}`)) }));

const sinAsteriscos = (s) => String(s ?? "").replace(/\*/g, "");
// Todo lo que un cliente lee u oye de la pieza (no la referencia ni las notas para Sergio Urcullo).
function textosDeCopia(b) {
  const t = [];
  const g = b.gancho ?? {};
  t.push(...(g.texto ?? []), g.voz, ...(g.alternativa ?? []));
  t.push(b.texto_principal, b.titular);
  for (const c of b.cuadros ?? []) {
    t.push(c.subtitulo, c.voz, ...(c.tarjeta?.lineas ?? []), c.tarjeta?.boton, c.cintilla?.nombre, c.cintilla?.rol);
  }
  const e = b.estatico;
  if (e) t.push(...(e.titular ?? []), ...(e.bajada ?? []), e.boton);
  for (const p of b.guion ?? []) t.push(p.voz, p.en_pantalla);
  return t.filter(Boolean).map(sinAsteriscos);
}

// \b de JavaScript no entiende las vocales con tilde («botón» contiene «bot»; «mirá» no cierra): límites Unicode.
const P = (alternativas, banderas = "iu") => new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternativas})(?![\\p{L}\\p{N}_])`, banderas);
const NO_VOSEO_NI_TUTEO = P("vos|tú|tu|tus|tuyo|tuya|tuyos|tuyas|contigo|usás|sos|eres|estás|tienes|tenés|puedes|podés|quieres|querés|necesitas|necesitás|sabes|sabés|confirmás|confirmas|aprobás|apruebas|apruebes|escribinos|escríbenos|pedí|mirá|fijate|probá|decime|contanos|cuéntanos", "giu");
const TERMINA_EN_AS_ES_IS = /(?<![\p{L}])\p{L}+(ás|és|ís)(?![\p{L}])/giu;
const PERMITIDAS_ACENTUADAS = new Set(["más", "además", "atrás", "detrás", "demás", "quizás", "jamás", "también", "después", "interés", "través", "país", "adiós", "inglés", "francés", "mes", "revés"]);
const PROHIBIDO = [
  [new RegExp("(US\\$|(?<![\\p{L}])USD(?![\\p{L}])|(?<![\\p{L}])Bs(?![\\p{L}])\\.?\\s?\\d|(?<![\\p{L}])bolivianos?(?![\\p{L}])|\\$\\s?\\d|(?<![\\p{L}])precio|(?<![\\p{L}])descuento|(?<![\\p{L}])cuesta(?![\\p{L}])|(?<![\\p{L}])cobra(?![\\p{L}]))", "iu"), "precio o plata"],
  [/\d\s?%/, "porcentaje"],
  [P("minutos?"), "minutos de la llamada (L-04: el bot dice 30 y la agenda 20)"],
  [/(doctocliq|citapro|agendapro|dentalink|dt\.?\s?dental|reservo|medilink|calendico|medizona|nativecode|clinera|huli|calu\b|fluker|jelou|dapta|lety)/i, "nombra a un competidor"],
  [/((?<![\p{L}])IA(?![\p{L}])|inteligencia artificial)/u, "«IA» (la frase 3 del catálogo §8 es sin IA)"],
  [/(con un toque|tratamiento a medias|(?<![\p{L}])SIAT(?![\p{L}])|factura electr|clínica de ejemplo|muy pronto|próximamente|(?<![\p{L}])beta(?![\p{L}])|solo hoy|cuenta regresiva)/iu, "frase que el catálogo §7 prohíbe o que exhibe obra"],
  [/(recupera|devuelve|reduce|disminuye|aumenta|más pacientes|menos ausencias|menos inasistencias|ahorra)/i, "promesa de resultado"],
  [P("bot|chatbot|asistente virtual|asistente de ia|agente de whatsapp|lo envía|se envía solo|automáticamente por whatsapp"), "WhatsApp que atiende o envía solo (J-*, G-03)"],
  [/(nuestros clientes|clínicas que ya|ya usan|\+\s?\d{3,}|miles de|cientos de|testimonio)/i, "cliente, testimonio o cifra de clientes (hay 0 clientes pagando)"],
  [/(?<![\p{L}])(Dr|Dra|doctor|doctora|odontólog[oa])(?![\p{L}])\.?\s+[A-ZÁÉÍÓÚ]/u, "un odontólogo con nombre (no se inventa a nadie)"],
];
const DIGITOS_OK = /(\d{1,2}:\d{2}|14 días|6 meses|390 px)/g; // «390 px» sale de la dirección de la toma («legible a 390 px»), no de lo que ve el cliente

test("son de 4 a 6 piezas, con id G1-n único, y cada una copia UNA referencia", () => {
  assert.ok(piezas.length >= 4 && piezas.length <= 6, `hay ${piezas.length} piezas; el encargo pide de 4 a 6`);
  const ids = piezas.map((p) => p.b.id);
  assert.equal(new Set(ids).size, ids.length, "ids repetidos");
  for (const { archivo, b } of piezas) {
    assert.equal(archivo, `${b.id}.json`);
    assert.ok(b.referencia?.anunciante && b.referencia?.id, `${b.id}: sin referencia`);
  }
  const refs = piezas.map((p) => p.b.referencia.id);
  assert.equal(new Set(refs).size, refs.length, "dos piezas copian la misma referencia: una pieza = un anuncio de la competencia");
});

test("cada referencia está capturada en el repo y lleva más de 50 días al aire (contra el 11-oct)", () => {
  for (const { b } of piezas) {
    const carpeta = b.referencia.anunciante.toLowerCase().replace(/[^a-z]/g, "");
    for (const ext of [".png", ".txt", "-2.png"]) {
      assert.ok(existsSync(aRuta(`${ANUNCIOS}/${carpeta}/${b.referencia.id}${ext}`)), `${b.id}: falta ${carpeta}/${b.referencia.id}${ext}`);
    }
    const txt = leer(`${ANUNCIOS}/${carpeta}/${b.referencia.id}.txt`);
    const m = txt.match(/En circulación desde el (\d+) (\w+)\.? (\d{4})/);
    assert.ok(m, `${b.id}: el .txt no trae «En circulación desde»`);
    const mes = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 }[m[2].slice(0, 3).toLowerCase()];
    const dias = Math.round((HOY - Date.UTC(+m[3], mes, +m[1])) / 86400000);
    assert.ok(dias >= 50, `${b.id}: ${b.referencia.anunciante} ${b.referencia.id} lleva ${dias} d (menos de 50: no es de los que duran)`);
    assert.ok(Math.abs(dias - b.referencia.dias) <= 1, `${b.id}: el brief dice ${b.referencia.dias} d y la captura da ${dias}`);
  }
});

test("el texto es de USTED: ni voseo ni tuteo en nada que el cliente lea u oiga", () => {
  for (const { b } of piezas) {
    for (const t of textosDeCopia(b)) {
      const malos = [...t.matchAll(NO_VOSEO_NI_TUTEO)].map((m) => m[0]);
      for (const m of t.matchAll(TERMINA_EN_AS_ES_IS)) if (!PERMITIDAS_ACENTUADAS.has(m[0].toLowerCase())) malos.push(m[0]);
      assert.deepEqual(malos, [], `${b.id}: voseo/tuteo «${malos.join(", ")}» en «${t.slice(0, 80)}»`);
    }
  }
});

test("el texto no trae precio, cifras, competidores, «IA», resultados ni nada de lo que el catálogo §7 prohíbe", () => {
  for (const { b } of piezas) {
    for (const t of textosDeCopia(b)) {
      for (const [forma, porque] of PROHIBIDO) assert.ok(!forma.test(t), `${b.id}: ${porque} en «${t.slice(0, 90)}»`);
      const digitos = t.replace(DIGITOS_OK, "").match(/\d+/g);
      assert.equal(digitos, null, `${b.id}: cifra «${digitos}» en «${t.slice(0, 90)}» (solo la hora de la pantalla y «14 días»)`);
    }
  }
});

test("el detector de promesas de la web (el MISMO que vigila el sitio) no encuentra ninguna", () => {
  for (const { b } of piezas) {
    const hallazgos = promesasEn(textosDeCopia(b).join("\n"));
    assert.deepEqual(hallazgos.map((h) => h.que), [], `${b.id}: promete lo que el producto no cumple hoy: ${hallazgos.map((h) => h.fragmento).join(" | ")}`);
  }
});

test("el gancho cumple el checklist: ≤ 2 líneas cortas, sin punto final, UN solo énfasis y alineado en sus 3 partes", () => {
  for (const { b } of piezas) {
    const g = b.gancho;
    const lineas = (b.estatico?.titular ?? g.texto) || [];
    assert.ok(lineas.length >= 1 && lineas.length <= 2, `${b.id}: el gancho tiene ${lineas.length} líneas`);
    for (const l of lineas) assert.ok(sinAsteriscos(l).length <= 26, `${b.id}: «${l}» pasa de 26 caracteres (el checklist pide ~22)`);
    assert.ok(!/[.…]\s*$/.test(sinAsteriscos(lineas.at(-1))), `${b.id}: el gancho termina en punto`);
    const enfasis = lineas.join(" ").match(/\*[^*]+\*/g) ?? [];
    assert.equal(enfasis.length, 1, `${b.id}: el gancho lleva ${enfasis.length} énfasis (debe ser 1)`);
    assert.ok(g.imagen && String(g.alineacion ?? "").length > 20, `${b.id}: falta decir qué se ve (cuadro 0) y por qué las 3 partes alinean`);
    assert.ok(b.estatico || g.voz, `${b.id}: un video lleva lo que se dice en el gancho`);
  }
});

test("UN solo llamado: el filtro abre el texto, el botón es el de WhatsApp y el código lo lee el motor REAL del bot", () => {
  const FILTRO = "Para dueños y dueñas de clínicas dentales de Santa Cruz.";
  const T0 = Date.parse("2026-09-30T19:00:00Z");
  const PRODUCCION = configComoProduccion({ horarios: "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z", now: T0 });
  const usados = new Set(["D1", "D2", "D3", "D4", "D5", "D6"]); // los de la prueba 1 original y la pauta ya escrita
  for (const { b } of piezas) {
    assert.equal(b.texto_principal.split("\n")[0].trim(), FILTRO, `${b.id}: la primera línea es el filtro`);
    assert.ok(b.texto_principal.split("\n").filter((l) => l.trim()).length <= 6, `${b.id}: el texto principal pasa de 5-6 líneas`);
    const llamados = b.texto_principal.match(/Escríbanos por WhatsApp/g) ?? [];
    assert.equal(llamados.length, 1, `${b.id}: el texto principal trae ${llamados.length} llamados`);
    assert.equal((b.texto_principal.match(/WhatsApp/g) ?? []).length, 1, `${b.id}: WhatsApp aparece más de una vez (un solo destino, un solo llamado)`);
    assert.equal(b.boton, "Enviar mensaje de WhatsApp");
    const cod = b.precargado.match(/^Hola, vi el anuncio de Onia \(([A-Z]\d{1,2})\)\. Tengo una clínica dental\.$/);
    assert.ok(cod, `${b.id}: el texto precargado no tiene la forma exacta «…(D7). Tengo una clínica dental.»`);
    assert.ok(!usados.has(cod[1]), `${b.id}: el código ${cod[1]} ya lo usa otro anuncio`);
    usados.add(cod[1]);
    const r = step(createState({ channel: "chatwoot", contactRef: "ad" }), { text: b.precargado, receivedAt: new Date(T0).toISOString() }, { config: PRODUCCION });
    assert.equal(r.nextState.pieceKey, `anuncio-${cod[1]}`, `${b.id}: el motor del bot no lee ${cod[1]} (el lead nacería sin origen)`);
  }
});

test("lo que la pieza dice está atado a filas de ONIA_PROMESA_VS_PRODUCTO.md y a una fuente del catálogo", () => {
  const filas = new Set([...leer("hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md").matchAll(/^\| ([A-L]-\d{2}) \|/gm)].map((m) => m[1]));
  for (const { b } of piezas) {
    assert.ok(b.promesas?.length >= 1, `${b.id}: sin tabla de promesas`);
    for (const p of b.promesas) {
      if ((p.filas ?? []).length) assert.match(p.fuente, /^(CAT|PRO|CTA|Recorte)/, `${b.id}: la frase «${p.frase}» no cita el catálogo`);
      else assert.match(p.fuente, /no depende|no es función|no promete/i, `${b.id}: «${p.frase}» sin fila debe decir por qué no es una función de Onia`);
      for (const f of p.filas ?? []) assert.ok(filas.has(f), `${b.id}: la fila ${f} no existe`);
    }
    assert.ok(b.no_dice?.length >= 3, `${b.id}: falta la lista de lo que NO dice`);
    assert.ok(b.para_sergio?.length >= 1, `${b.id}: falta qué graba o fotografía Sergio Urcullo`);
  }
});

test("solo las piezas que ESPERAN pueden atarse a G-05 (⬜ hoy): la prueba 1 usa las filas que el go/no-go ya exige", () => {
  const EXIGIDAS = new Set(["B-01", "B-02", "C-02", "D-01", "E-01", "G-01", "G-04", "G-06", "L-04"]);
  for (const { b } of piezas) {
    assert.ok(/^(sale|espera)/.test(b.estado ?? ""), `${b.id}: falta el estado (sale / espera)`);
    const filas = new Set(b.promesas.flatMap((p) => p.filas ?? []));
    if (/^espera/.test(b.estado)) assert.ok(filas.has("G-05"), `${b.id}: espera por G-05 y no la cita`);
    else for (const f of filas) assert.ok(EXIGIDAS.has(f), `${b.id}: sale en la prueba 1 pero depende de ${f}, que el go/no-go no exige (¿G-05 sin verificar?)`);
  }
});

test("lo que Sergio Urcullo dice entra en su tramo: ≤ 3,3 palabras por segundo (G1-5 tenía 17 palabras en 4 s)", () => {
  for (const { b } of piezas) {
    for (const p of b.guion ?? []) {
      const m = p.tramo.match(/^(\d+)-(\d+) s$/);
      assert.ok(m, `${b.id}: tramo «${p.tramo}» sin formato «a-b s»`);
      const seg = Number(m[2]) - Number(m[1]);
      const palabras = p.voz.trim().split(/\s+/).length;
      assert.ok(palabras <= seg * 3.3, `${b.id} ${p.tramo}: ${palabras} palabras en ${seg} s (${(palabras / seg).toFixed(1)} por segundo; el tope es 3,3)`);
    }
  }
});

test("la persona es Sergio Urcullo con su nombre, nunca un odontólogo ni un cliente; la pantalla es una de las dos filas reales", () => {
  for (const { b } of piezas) {
    for (const c of b.cuadros ?? []) {
      if (c.cintilla) assert.equal(c.cintilla.nombre, "Sergio Urcullo", `${b.id}: la cintilla nombra a otra persona`);
      for (const f of [].concat(c.pantalla?.fila ?? [])) assert.ok(["cita-manana", "vuelve"].includes(f), `${b.id}: fila «${f}» no es una de las capturadas`);
    }
    for (const f of b.estatico?.filas ?? []) assert.ok(["cita-manana", "vuelve"].includes(f), `${b.id}: fila «${f}» no es una de las capturadas`);
  }
});

test("están renderizados: los cuadros de cada video (o la imagen) y la hoja «referencia | nuestra» de cada pieza", () => {
  for (const { b } of piezas) {
    const sal = b.estatico ? [`${b.id}-feed.png`] : (b.cuadros ?? []).map((c) => `${b.id}-${c.id}.png`);
    assert.ok(sal.length >= 1);
    for (const f of sal) assert.ok(existsSync(aRuta(`${OUT}/${b.id}/${f}`)), `${b.id}: falta render ${f}`);
    assert.ok(existsSync(aRuta(`${OUT}/hojas/${b.id}-hoja.png`)), `${b.id}: falta la hoja referencia | nuestra`);
    assert.ok(existsSync(aRuta(`${DIR}/${b.id}-hoja.md`)), `${b.id}: falta su hoja escrita (${b.id}-hoja.md)`);
  }
});

test("el renderer pone «Pantalla de Onia · datos de ejemplo» en CADA lugar donde muestra nombres de pacientes (rojo del verificador, 11-oct)", () => {
  // El 11-oct el verificador (haiku) marcó 4 rojos: una tarjeta con «Martín Arteaga Rojas» sin leyenda se lee como un cliente real.
  const fuente = leer(".claude/skills/onia-ventas-pauta/scripts/replica-render.mjs");
  const leyendas = fuente.match(/Pantalla de Onia · datos de ejemplo/g) ?? [];
  assert.ok(leyendas.length >= 3, `la leyenda aparece ${leyendas.length} veces; hacen falta 3: tarjeta flotante, tarjeta centrada y la imagen`);
  assert.ok(/if \(flotando\) cuerpo \+= .{0,200}datos de ejemplo/.test(fuente), "la tarjeta flotante lleva su leyenda");
  assert.ok(/if \(!flotando\) cuerpo \+= .{0,200}datos de ejemplo/.test(fuente), "la tarjeta centrada lleva su leyenda");
  assert.ok(/function htmlEstatico[\s\S]*<div class="rot"[^>]*>Pantalla de Onia · datos de ejemplo/.test(fuente), "la imagen 1:1 lleva su leyenda");
});

test("LISTA PARA MOSTRAR v2: dice que no se creó nada ni se gastó, nombra las 5 piezas con su referencia y deja a la que espera fuera", () => {
  const lista = leer(`${DIR}/LISTA-PARA-MOSTRAR-V2.md`);
  const plano = lista.replace(/\s+/g, " ");
  assert.match(lista, /^# LISTA PARA MOSTRAR: prueba 1 v2$/m);
  assert.match(plano, /No se creó nada en Meta, no se gastó nada, no se contactó a nadie/);
  assert.match(plano, /sigue \*\*sin aprobar\*\*/);
  for (const { b } of piezas) {
    assert.ok(lista.includes(`**${b.id}**`), `${b.id}: falta en la tabla`);
    assert.ok(lista.includes(b.referencia.id), `${b.id}: la tabla no nombra la referencia ${b.referencia.id}`);
    assert.ok(lista.includes(`${b.id}-hoja.md`), `${b.id}: falta el enlace a su hoja`);
    if (/^espera/.test(b.estado)) assert.match(plano, new RegExp(`\\*\\*${b.id}\\*\\*[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*ESPERA`), `${b.id}: la tabla no dice que espera`);
  }
  assert.ok(existsSync(aRuta(`${DIR}/PARA-GRABAR.txt`)), "falta PARA-GRABAR.txt");
});
