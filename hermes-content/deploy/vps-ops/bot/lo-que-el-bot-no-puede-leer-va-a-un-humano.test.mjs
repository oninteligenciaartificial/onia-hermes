// ONIA — Gate de CLASE: todo contenido que el bot RECIBE y no puede leer termina con un
// humano AVISADO, no sólo con un pedido al prospecto.
//
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// POR QUE EXISTE (medido el 2026-09-19 contra produccion). Los dos motores tenian el mismo
// hecho —"me mandaron algo que no puedo leer"— resuelto de dos maneras opuestas:
//
//   attachment && !hasText  -> handoffResult(...)  el humano se entera y contesta
//   voice       && !hasText -> finalize(M_AUDIO_FAIL) nadie se entera; el prospecto queda solo
//
// La asimetria se sostenia en un comentario que era cierto el dia que se escribio ("el ejecutor
// debio transcribir antes (Speaches)") y hoy es falso: `npm run destinos:vivos` dice que
// ONIA_AUDIO_ENABLED=true apunta a http://speaches:8000/v1 y ese contenedor NO EXISTE en el VPS,
// asi que la rama del audio ilegible no es el caso raro: es el UNICO caso. En Bolivia la nota de
// voz por WhatsApp es la forma normal de escribir, y el add-on del chatbot se cobra Bs 390/mes.
//
// Lo que hace la diferencia cara: el audio SI se puede escuchar — lo escucha una persona, que lo
// tiene ahi en Chatwoot. La capacidad existe; lo que faltaba era avisarle. Sin el aviso, un
// prospecto que manda un audio y no reescribe se pierde en silencio, y el negocio no se entera
// de que existio.
//
// EL INVARIANTE que sostiene este gate no es "usa handoffResult": es que ninguna rama de
// "no puedo leer esto" se quede sin avisarle a un humano. Por eso el ultimo caso corre el motor
// de verdad y mira el EFECTO (notify_sergio), que es lo que no se puede esquivar renombrando.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createBotConfig } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Universo derivado del DISCO, no de una lista a mano ni de `git ls-files` (un motor recien
 * escrito y sin commitear es justo el sujeto que no se quiere perder). Se saltean las carpetas
 * `__...__`, que son siembra efimera de otros gates y desaparecen mientras se las lee.
 */
function mjsDeLaCarpeta(raiz) {
  const salida = [];
  for (const entrada of readdirSync(raiz, { withFileTypes: true })) {
    if (entrada.isDirectory()) {
      if (/^__.+__$/.test(entrada.name) || entrada.name === "node_modules") continue;
      salida.push(...mjsDeLaCarpeta(join(raiz, entrada.name)));
      continue;
    }
    if (entrada.name.endsWith(".mjs")) salida.push(join(raiz, entrada.name));
  }
  return salida;
}

/**
 * Los comentarios acusan Y absuelven: se mide sobre codigo con los comentarios EN BLANCO,
 * conservando los saltos de linea para que los indices sigan valiendo.
 */
function sinComentarios(fuente) {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

/** Devuelve el bloque `{...}` balanceado que empieza en `desde` (indice de la llave). */
function bloqueBalanceado(codigo, desde) {
  let nivel = 0;
  for (let i = desde; i < codigo.length; i += 1) {
    if (codigo[i] === "{") nivel += 1;
    else if (codigo[i] === "}") {
      nivel -= 1;
      if (nivel === 0) return codigo.slice(desde, i + 1);
    }
  }
  return codigo.slice(desde);
}

/**
 * Las ramas "me mandaron algo que no puedo leer": una condicion que mira `msg.kind === "<x>"`
 * junto con `!msg.hasText`. El sujeto es la CLASE, no el audio: cualquier tipo nuevo que alguien
 * agregue manana (sticker, ubicacion, contacto) entra solo en este universo.
 */
const RAMA = /if\s*\(\s*msg\.kind\s*===\s*"([a-z_]+)"\s*&&\s*!\s*msg\.hasText\s*\)\s*\{/g;

export function ramasDeContenidoIlegible(archivos = mjsDeLaCarpeta(AQUI)) {
  const ramas = [];
  for (const ruta of archivos) {
    // Un test AFIRMA, no le contesta a un prospecto: no es superficie de nadie. El corte podria
    // fallar abierto, y por eso existe el caso ancla de mas abajo, que es quien lo vigila.
    if (ruta.endsWith(".test.mjs")) continue;
    const codigo = sinComentarios(readFileSync(ruta, "utf8"));
    RAMA.lastIndex = 0;
    let m;
    while ((m = RAMA.exec(codigo)) !== null) {
      const cuerpo = bloqueBalanceado(codigo, codigo.indexOf("{", m.index + m[0].length - 1));
      ramas.push({
        archivo: ruta.slice(AQUI.length + 1),
        kind: m[1],
        cuerpo,
        avisaAUnHumano: /handoffResult\s*\(/.test(cuerpo),
      });
    }
  }
  return ramas;
}

test("ANCLA: los sujetos que ya se conocen estan en el universo (si no, el gate no mide nada)", () => {
  const ramas = ramasDeContenidoIlegible();
  const vistos = ramas.map((r) => `${r.archivo}:${r.kind}`).sort();
  for (const esperado of [
    "bot-engine.mjs:voice",
    "bot-engine.mjs:attachment",
    "recepcionista.mjs:voice",
    "recepcionista.mjs:attachment",
  ]) {
    assert.ok(
      vistos.includes(esperado),
      `el universo perdio un sujeto conocido: ${esperado} — visto: ${vistos.join(", ")}`,
    );
  }
});

test("una rama de 'no puedo leer esto' NUNCA se resuelve sin avisarle a un humano", () => {
  const mudas = ramasDeContenidoIlegible().filter((r) => !r.avisaAUnHumano);
  assert.deepEqual(
    mudas.map((r) => `${r.archivo}:${r.kind}`),
    [],
    "estas ramas le contestan al prospecto y no avisan a nadie: lo que el bot no puede leer, " +
      "una persona SI puede — pero solo si se entera",
  );
});

test("EL EFECTO, que es lo que no se puede esquivar: quien solo manda audios llega a un humano", () => {
  const config = createBotConfig({
    slots: [
      { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
      { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
    ],
  });
  let estado = createState({ channel: "sim", contactRef: "solo-manda-audios" });
  estado = step(estado, { text: "DEMO", receivedAt: "2026-07-27T14:05:00Z" }, { config }).nextState;

  // Caso boliviano tipico: le pedimos texto y vuelve a mandar una nota de voz.
  const avisos = [];
  for (let i = 0; i < config.offScript.maxBeforeHandoff; i += 1) {
    const turno = step(
      estado,
      { kind: "voice", transcript: "", receivedAt: `2026-07-27T14:0${6 + i}:00Z` },
      { config },
    );
    assert.ok(turno.replies.length > 0, `audio #${i + 1}: el prospecto NUNCA se queda sin respuesta`);
    avisos.push(...(turno.sideEffects || []).filter((e) => e.type === "notify_sergio"));
    estado = turno.nextState;
  }

  assert.equal(
    avisos.length,
    1,
    "quien insiste con audio tiene que llegarle a la persona que SI lo puede escuchar (esta en " +
      "Chatwoot) — sin esto el lead se pierde y nadie se entera de que existio",
  );
});

test("el PRIMER audio no deriva: derivar siempre silenciaria al bot en casi toda charla de WhatsApp", () => {
  const config = createBotConfig({
    slots: [{ key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false }],
  });
  let estado = createState({ channel: "sim", contactRef: "un-audio-y-despues-escribe" });
  estado = step(estado, { text: "DEMO", receivedAt: "2026-07-27T14:05:00Z" }, { config }).nextState;

  const primero = step(estado, { kind: "voice", transcript: "", receivedAt: "2026-07-27T14:06:00Z" }, { config });
  assert.notEqual(
    primero.nextState.botStage,
    "handoff_humano",
    "un solo audio no puede costar el bot de toda la conversacion: el que reescribe sigue solo",
  );

  // Y el que SI reescribe sigue con el embudo, no con el bot mudo.
  const despues = step(
    primero.nextState,
    { text: "tengo una panaderia, somos 3, en la paz", receivedAt: "2026-07-27T14:07:00Z" },
    { config },
  );
  assert.ok(despues.replies.length > 0, "tras mandar un audio y reescribir, el bot sigue contestando");
});

test("el texto no le echa la culpa al prospecto: el audio llego bien, el que no puede es el bot", () => {
  const { script } = createBotConfig({});
  const texto = script.M_AUDIO_FAIL;
  assert.ok(texto, "M_AUDIO_FAIL tiene que existir");
  assert.ok(
    !/no me lleg|no lleg[oó]|se cort[oó]|mal(a)? (conexi[oó]n|se[nñ]al)/i.test(texto),
    `M_AUDIO_FAIL no puede decir que el audio no llego (llego perfecto, esta en Chatwoot): ${texto}`,
  );
});
