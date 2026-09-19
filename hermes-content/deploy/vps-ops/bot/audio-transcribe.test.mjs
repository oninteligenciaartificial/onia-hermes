// ONIA — Chatbot propio: tests de la TRANSCRIPCION DE NOTAS DE VOZ.
//
// Cero red: el `fetch` se inyecta siempre. Lo que se prueba de verdad no es "llama a Speaches",
// es que se cumplan las tres promesas que hacen que esto sirva:
//   1. Se FUERZA el modelo multilingüe. Sin eso el bot recibe inglés y no matchea ni un intent.
//   2. NUNCA tira. Un audio roto tiene que devolver ok:false, no reventar el turno del prospecto.
//   3. Hay techo. Un audio gigante se descarta ANTES de bajarlo; uno que se cuelga, por timeout.

import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LANGUAGE,
  DEFAULT_MAX_BYTES,
  DEFAULT_MODEL,
  DEFAULT_FALLBACK_BASE_URL,
  DEFAULT_STT_TIMEOUT_MS,
  downloadAudio,
  filenameFor,
  getTranscribeConfig,
  pickAudioAttachment,
  resolveAttachmentUrl,
  safeModel,
  transcribeBuffer,
  transcribeChatwootAudio,
} from "./audio-transcribe.mjs";

const CHATWOOT = "http://onia-chatbot_chatwoot:3000";
const BLOB = "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/rails/active_storage/blobs/redirect/abc123/nota.oga";

/** Respuesta de fetch de mentira, con headers que se comportan como los de verdad. */
function res({ status = 200, ok = true, body = "", json = null, headers = {} } = {}) {
  const lower = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v)]));
  return {
    ok,
    status,
    headers: { get: (name) => lower.get(String(name).toLowerCase()) ?? null },
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
    json: async () => (json === null ? JSON.parse(String(body)) : json),
    arrayBuffer: async () => (body instanceof Uint8Array ? body.buffer : new TextEncoder().encode(String(body)).buffer),
  };
}

function fetchMock(responses) {
  const llamadas = [];
  const fn = async (url, init) => {
    llamadas.push({ url, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  fn.llamadas = llamadas;
  return fn;
}

const audioBytes = () => new Uint8Array([0x4f, 0x67, 0x67, 0x53, 1, 2, 3, 4, 5, 6, 7, 8]);

// ---------------------------------------------------------------------------
// Config — la regla del modelo es la que mas caro sale romper
// ---------------------------------------------------------------------------

test("getTranscribeConfig: el default es el modelo MULTILINGÜE, nunca un distil", () => {
  const c = getTranscribeConfig({});
  assert.equal(c.model, DEFAULT_MODEL);
  assert.equal(c.model, "Systran/faster-whisper-small");
  assert.ok(!/distil/i.test(c.model), "los faster-distil-* son English-only: TRADUCEN el español");
  assert.equal(c.language, DEFAULT_LANGUAGE, "el idioma se fuerza: el autodetect falla en notas cortas");
  assert.equal(c.enabled, true);
});

test("REGRESION REAL: el contenedor ya trae un modelo DISTIL en esa misma variable, y se ignora", () => {
  // Verificado en el VPS el 2026-08-01: onia-center exporta, por su propia config del panel,
  // ONIA_AUDIO_STT_MODEL=Systran/faster-distil-whisper-large-v3. Si el bot lo heredara,
  // transcribiria el español AL INGLES y no matchearia ni un intent — sin fallar, o sea sin que
  // nadie se entere.
  const c = getTranscribeConfig({ ONIA_AUDIO_STT_MODEL: "Systran/faster-distil-whisper-large-v3" });
  assert.equal(c.model, DEFAULT_MODEL, "un distil heredado del contenedor tiene que caer al multilingüe");
  assert.equal(safeModel("Systran/faster-distil-whisper-small.en"), DEFAULT_MODEL);
  // Un modelo multilingüe elegido a mano SI se respeta: el guarda es contra los English-only.
  assert.equal(safeModel("Systran/faster-whisper-large-v3"), "Systran/faster-whisper-large-v3");
  assert.equal(safeModel(""), DEFAULT_MODEL);
});

test("getTranscribeConfig: valores basura caen al default en vez de romper el turno", () => {
  const c = getTranscribeConfig({
    ONIA_AUDIO_MAX_BYTES: "muchos",
    ONIA_AUDIO_STT_TIMEOUT_MS: "-1",
    ONIA_AUDIO_STT_BASE_URL: "http://speaches:8000/v1/",
  });
  assert.equal(c.maxBytes, DEFAULT_MAX_BYTES);
  assert.equal(c.sttTimeoutMs, DEFAULT_STT_TIMEOUT_MS);
  assert.equal(c.baseUrl, "http://speaches:8000/v1", "la barra final se saca");
});

test("getTranscribeConfig: se puede APAGAR sin desplegar codigo (Speaches caido)", () => {
  assert.equal(getTranscribeConfig({ ONIA_AUDIO_ENABLED: "false" }).enabled, false);
  assert.equal(getTranscribeConfig({ ONIA_AUDIO_ENABLED: "true" }).enabled, true);
});

// ---------------------------------------------------------------------------
// Eleccion del adjunto
// ---------------------------------------------------------------------------

test("pickAudioAttachment: encuentra el audio aunque no sea el primero", () => {
  const found = pickAudioAttachment([{ file_type: "image" }, { file_type: "audio", data_url: BLOB }]);
  assert.equal(found.data_url, BLOB, "una foto adelante no puede tapar la nota de voz");
});

test("pickAudioAttachment: sin audio devuelve null (no tira con basura)", () => {
  assert.equal(pickAudioAttachment([{ file_type: "image" }]), null);
  assert.equal(pickAudioAttachment([]), null);
  assert.equal(pickAudioAttachment(null), null);
  assert.equal(pickAudioAttachment([null, "no-es-objeto"]), null);
});

test("pickAudioAttachment: tambien acepta un content_type audio/*", () => {
  assert.ok(pickAudioAttachment([{ content_type: "audio/ogg; codecs=opus" }]));
});

// ---------------------------------------------------------------------------
// URL — es la defensa contra SSRF, no solo una comodidad
// ---------------------------------------------------------------------------

test("resolveAttachmentUrl: el origen lo pone SIEMPRE la base configurada", () => {
  const url = resolveAttachmentUrl(BLOB, CHATWOOT);
  assert.equal(url, `${CHATWOOT}/rails/active_storage/blobs/redirect/abc123/nota.oga`);
});

test("resolveAttachmentUrl: un data_url manipulado NO nos hace pedir otra maquina", () => {
  const url = resolveAttachmentUrl("http://169.254.169.254/latest/meta-data/iam/", CHATWOOT);
  assert.ok(url.startsWith(CHATWOOT), "si el host del adjunto ganara, el webhook seria un SSRF");
  assert.equal(url, `${CHATWOOT}/latest/meta-data/iam/`);
});

test("resolveAttachmentUrl: rechaza esquemas que no son http(s)", () => {
  assert.equal(resolveAttachmentUrl("file:///etc/passwd", CHATWOOT), null);
  assert.equal(resolveAttachmentUrl("data:audio/ogg;base64,AAAA", CHATWOOT), null);
  assert.equal(resolveAttachmentUrl("", CHATWOOT), null);
  assert.equal(resolveAttachmentUrl(null, CHATWOOT), null);
});

test("resolveAttachmentUrl: una ruta relativa se pega a la base; sin base no se inventa nada", () => {
  assert.equal(resolveAttachmentUrl("/rails/x/nota.oga", CHATWOOT), `${CHATWOOT}/rails/x/nota.oga`);
  assert.equal(resolveAttachmentUrl("/rails/x/nota.oga", ""), null);
});

test("resolveAttachmentUrl: SIN base falla CERRADO, no devuelve la URL cruda del webhook", () => {
  // Si devolviera el absoluto, un `baseUrl: \"\"` mal cableado desarmaria en silencio toda la
  // defensa de arriba: volveriamos a pedir el host que diga el payload.
  assert.equal(resolveAttachmentUrl("http://169.254.169.254/latest/meta-data/", ""), null);
  assert.equal(resolveAttachmentUrl(BLOB, undefined), null);
});

test("resolveAttachmentUrl: conserva el querystring (el blob va firmado ahi)", () => {
  assert.equal(resolveAttachmentUrl("https://pub.host/x/n.oga?sig=abc", CHATWOOT), `${CHATWOOT}/x/n.oga?sig=abc`);
});

test("filenameFor: whisper decodifica por extension, asi que nunca queda sin una", () => {
  assert.equal(filenameFor(`${CHATWOOT}/rails/x/nota.oga`), "nota.oga");
  assert.equal(filenameFor(`${CHATWOOT}/rails/x/blob`, "ogg"), "nota-de-voz.ogg");
  assert.equal(filenameFor("", ""), "nota-de-voz.ogg");
  assert.equal(filenameFor(`${CHATWOOT}/rails/x/nota%20de%20voz.oga`), "nota de voz.oga");
});

test("filenameFor: un `%` roto en el nombre NO puede tirar (URIError en medio del turno)", () => {
  // Un adjunto llamado "100%off.mp3" alcanza para que decodeURIComponent reviente. Si escapara,
  // el prospecto se quedaria sin respuesta por el NOMBRE de su archivo.
  assert.equal(filenameFor(`${CHATWOOT}/rails/x/100%off.mp3`), "100%off.mp3");
  assert.equal(filenameFor(`${CHATWOOT}/rails/x/nota%.oga`, "oga"), "nota%.oga");
});

// ---------------------------------------------------------------------------
// Descarga
// ---------------------------------------------------------------------------

test("downloadAudio: camino feliz, con el token en un HEADER (nunca en la URL)", async () => {
  const f = fetchMock([res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } })]);
  const r = await downloadAudio({ url: `${CHATWOOT}/x.oga`, token: "tok-secreto" }, { fetch: f });
  assert.equal(r.ok, true);
  assert.equal(r.bytes.byteLength, 12);
  assert.equal(r.contentType, "audio/ogg");
  assert.equal(f.llamadas[0].init.headers.api_access_token, "tok-secreto");
  assert.ok(!f.llamadas[0].url.includes("tok-secreto"), "un token en la URL termina en el log de cualquier proxy");
});

test("downloadAudio: content-length pasado de largo se descarta SIN leer el cuerpo", async () => {
  const f = fetchMock([res({ body: audioBytes(), headers: { "content-length": String(DEFAULT_MAX_BYTES + 1) } })]);
  const r = await downloadAudio({ url: `${CHATWOOT}/x.oga` }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "audio_demasiado_grande");
});

test("downloadAudio: sin content-length el tope REAL sigue cortando (chunked)", async () => {
  const f = fetchMock([res({ body: new Uint8Array(50) })]);
  const r = await downloadAudio({ url: `${CHATWOOT}/x.oga`, maxBytes: 10 }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "audio_demasiado_grande", "un tope que solo mira el header no protege nada");
});

test("downloadAudio: 404 y red caida devuelven ok:false, no una excepcion", async () => {
  const cuatroCuatro = await downloadAudio({ url: `${CHATWOOT}/x.oga` }, { fetch: fetchMock([res({ ok: false, status: 404 })]) });
  assert.equal(cuatroCuatro.reason, "descarga_fallida");

  const caida = await downloadAudio({ url: `${CHATWOOT}/x.oga` }, { fetch: fetchMock([new Error("ECONNREFUSED")]) });
  assert.equal(caida.ok, false);
  assert.match(caida.warnings.join(" "), /ECONNREFUSED/);
});

test("downloadAudio: adjunto vacio no se manda a transcribir", async () => {
  const r = await downloadAudio({ url: `${CHATWOOT}/x.oga` }, { fetch: fetchMock([res({ body: new Uint8Array(0) })]) });
  assert.equal(r.reason, "audio_vacio");
});

test("downloadAudio: sin URL corta antes de llamar a nadie", async () => {
  const f = fetchMock([]);
  assert.equal((await downloadAudio({ url: "" }, { fetch: f })).reason, "url_invalida");
  assert.equal(f.llamadas.length, 0);
});

test("downloadAudio: en un runtime sin fetch avisa en vez de romper", async () => {
  // Se apaga el fetch global a proposito: si el modulo cayera al `globalThis.fetch` de un Node
  // viejo (o de un runtime recortado) tiraria un TypeError en medio del turno del prospecto.
  const original = globalThis.fetch;
  globalThis.fetch = undefined;
  try {
    assert.equal((await downloadAudio({ url: "http://speaches:8000/x.oga" })).reason, "sin_fetch");
    assert.equal((await transcribeBuffer(audioBytes(), {})).reason, "sin_fetch");
  } finally {
    globalThis.fetch = original;
  }
});

// ---------------------------------------------------------------------------
// Speaches
// ---------------------------------------------------------------------------

test("transcribeBuffer: manda el modelo FORZADO y el idioma en el form", async () => {
  const f = fetchMock([res({ json: { text: "  hola, tengo una clinica dental  " } })]);
  const r = await transcribeBuffer(audioBytes(), { baseUrl: "http://speaches:8000/v1" }, { fetch: f });

  assert.equal(r.ok, true);
  assert.equal(r.text, "hola, tengo una clinica dental", "el texto llega recortado");
  assert.equal(f.llamadas[0].url, "http://speaches:8000/v1/audio/transcriptions");

  const form = f.llamadas[0].init.body;
  assert.equal(form.get("model"), "Systran/faster-whisper-small", "sin modelo forzado Speaches devuelve 422 o traduce al ingles");
  assert.equal(form.get("language"), "es");
  assert.ok(form.get("file"), "el audio tiene que ir como archivo del multipart");
});

test("transcribeBuffer: Speaches caido o lento -> stt_fallido, nunca una excepcion", async () => {
  const caido = await transcribeBuffer(audioBytes(), {}, { fetch: fetchMock([new Error("ECONNREFUSED")]) });
  assert.equal(caido.ok, false);
  assert.equal(caido.reason, "stt_fallido");

  // Asi se ve un timeout de AbortSignal.timeout: es EL caso que evita que un audio de 10 minutos
  // cuelgue el webhook para siempre.
  const timeout = await transcribeBuffer(audioBytes(), {}, { fetch: fetchMock([new Error("The operation was aborted due to timeout")]) });
  assert.equal(timeout.reason, "stt_fallido");
  assert.match(timeout.warnings.join(" "), /timeout/i);
});

test("transcribeBuffer: HTTP 422 (falta el modelo) se reporta con el detalle", async () => {
  const f = fetchMock([res({ ok: false, status: 422, body: '{"detail":[{"msg":"Field required"}]}' })]);
  const r = await transcribeBuffer(audioBytes(), {}, { fetch: f });
  assert.equal(r.reason, "stt_fallido");
  assert.match(r.warnings.join(" "), /422/);
});

test("transcribeBuffer: SILENCIO no es exito — texto vacio deja al motor mudo", async () => {
  const r = await transcribeBuffer(audioBytes(), {}, { fetch: fetchMock([res({ json: { text: "   " } })]) });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "stt_sin_texto", "si pasara como ok, el bot no contestaria absolutamente nada");
});

test("transcribeBuffer: sin bytes no se gasta una llamada", async () => {
  const f = fetchMock([]);
  const r = await transcribeBuffer(new Uint8Array(0), {}, { fetch: f });
  assert.equal(r.reason, "audio_vacio");
  assert.equal(f.llamadas.length, 0);
});

// ---------------------------------------------------------------------------
// Punta a punta (con fetch inyectado)
// ---------------------------------------------------------------------------

test("transcribeChatwootAudio: baja el adjunto y devuelve el texto en español", async () => {
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } }),
    res({ json: { text: "Hola, tengo una clínica dental en Santa Cruz, somos cuatro personas." } }),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB, extension: "oga" }], token: "tok", chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: {} },
  );

  assert.equal(r.ok, true);
  assert.match(r.text, /clínica dental en Santa Cruz/, "en español: si viniera en ingles, el modelo estaria mal");
  assert.equal(f.llamadas[0].url, `${CHATWOOT}/rails/active_storage/blobs/redirect/abc123/nota.oga`);
  assert.equal(f.llamadas[1].init.body.get("model"), DEFAULT_MODEL);
});

test("transcribeChatwootAudio: sin adjunto de audio no llama a nadie", async () => {
  const f = fetchMock([]);
  const r = await transcribeChatwootAudio({ attachments: [{ file_type: "image", data_url: BLOB }] }, { fetch: f, env: {} });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "sin_adjunto_de_audio");
  assert.equal(f.llamadas.length, 0);
});

test("transcribeChatwootAudio: file_size gigante se descarta ANTES de bajar nada", async () => {
  const f = fetchMock([]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB, file_size: 99_000_000 }], chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: {} },
  );
  assert.equal(r.reason, "audio_demasiado_grande");
  assert.equal(f.llamadas.length, 0, "el metadato ya alcanza: bajar 99 MB para despues tirarlos es absurdo");
});

test("transcribeChatwootAudio: apagado por config no toca la red", async () => {
  const f = fetchMock([]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: { ONIA_AUDIO_ENABLED: "false" } },
  );
  assert.equal(r.reason, "transcripcion_apagada");
  assert.equal(f.llamadas.length, 0);
});

test("transcribeChatwootAudio: si falla la descarga NO se llama a Speaches", async () => {
  const f = fetchMock([res({ ok: false, status: 500 })]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: {} },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "descarga_fallida");
  assert.equal(r.text, "", "el contrato dice que `text` siempre es string, tambien al fallar");
  assert.equal(f.llamadas.length, 1);
});

test("CONTRATO, camino COMPLETO: descarga OK + nombre con `%` roto -> transcribe igual, no tira", async () => {
  // Este es el unico camino interno que podia lanzar (decodeURIComponent en filenameFor), y los
  // casos de abajo no lo tocaban: todos cortan antes de la descarga. Acá se llega hasta Speaches.
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/mpeg" } }),
    res({ json: { text: "hola, quiero ver la demo" } }),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: "https://pub.host/rails/x/100%off.mp3" }], chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: {} },
  );

  assert.equal(r.ok, true);
  assert.equal(r.text, "hola, quiero ver la demo");
  assert.equal(f.llamadas[1].init.body.get("file").name, "100%off.mp3", "el nombre viaja sin decodificar, pero viaja");
});

test("CONTRATO: pase lo que pase devuelve {ok,text,reason,warnings} y NUNCA tira", async () => {
  const casos = [
    {},
    { attachments: null },
    { attachments: [{ file_type: "audio" }] },
    { attachments: [{ file_type: "audio", data_url: "no-es-una-url" }], chatwootBaseUrl: CHATWOOT },
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
  ];
  for (const caso of casos) {
    // eslint-disable-next-line no-await-in-loop -- son cinco casos, la claridad vale mas
    const r = await transcribeChatwootAudio(caso, { fetch: fetchMock([new Error("boom")]), env: {} });
    assert.equal(typeof r.ok, "boolean");
    assert.equal(typeof r.text, "string");
    assert.equal(typeof r.reason, "string");
    assert.ok(Array.isArray(r.warnings));
  }
});

// ---------------------------------------------------------------------------
// EL RESPALDO — nace del 2026-09-19.
//
// Medido ese dia contra produccion: `speaches` NO EXISTE en la red del VPS (`wget` desde
// onia-center: "bad address"), asi que TODA nota de voz caia a M_AUDIO_FAIL — y el catalogo
// de venta, que es la fuente unica de QUE se vende, marca el chatbot ✅ vivo prometiendo que
// "entiende FOTOS y audios". La foto SI anda (LiteLLM contesta); el audio no.
//
// Lo que mas duele: el proceso vivo YA TRAIA declarado el respaldo
// (`ONIA_AUDIO_STT_FALLBACK_PROVIDER=openai`, `ONIA_AUDIO_STT_FALLBACK_MODEL=gpt-4o-mini-transcribe`)
// y NINGUNA linea de este modulo lo leia. Un interruptor que nadie lee es peor que no tenerlo:
// el que lo configuro cree que hay red debajo.
//
// La promesa no se borra, se CUMPLE: OpenAI habla el mismo endpoint multipart que Speaches
// (`POST /audio/transcriptions`), asi que el respaldo es la MISMA funcion con otra baseUrl y
// una key en el header. El gasto ya estaba decidido (Sergio Urcullo, 2026-08-30: "pagamos api
// nomas de modelo barato") y contemplado en el modelo de costos de `lib/pricing.ts`.
// ---------------------------------------------------------------------------

test("getTranscribeConfig: LEE el respaldo que el proceso vivo ya declara", () => {
  const c = getTranscribeConfig({
    ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
    ONIA_AUDIO_STT_FALLBACK_MODEL: "gpt-4o-mini-transcribe",
    OPENAI_ONIA_CENTER_API_KEY: "sk-vive-en-el-proceso",
  });
  assert.equal(c.fallback?.baseUrl, DEFAULT_FALLBACK_BASE_URL);
  assert.equal(c.fallback?.model, "gpt-4o-mini-transcribe");
  assert.equal(c.fallback?.apiKey, "sk-vive-en-el-proceso");
});

test("getTranscribeConfig: SIN proveedor declarado no se inventa un destino", () => {
  assert.equal(getTranscribeConfig({ OPENAI_ONIA_CENTER_API_KEY: "sk-hay-key" }).fallback, null);
});

test("getTranscribeConfig: proveedor declarado SIN key no es respaldo (falla cerrado)", () => {
  assert.equal(getTranscribeConfig({ ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai" }).fallback, null);
});

test("getTranscribeConfig: un proveedor que no sabemos hablar NO se intenta a ciegas", () => {
  const c = getTranscribeConfig({
    ONIA_AUDIO_STT_FALLBACK_PROVIDER: "el-primo-de-un-amigo",
    OPENAI_ONIA_CENTER_API_KEY: "sk-hay-key",
  });
  assert.equal(c.fallback, null);
});

test("EL CASO DE PRODUCCION: Speaches no resuelve y el prospecto IGUAL es entendido", async () => {
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } }),
    new Error("getaddrinfo ENOTFOUND speaches"),
    res({ json: { text: "hola, quiero una demo, tengo una clínica dental" } }),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB, extension: "oga" }], token: "tok", chatwootBaseUrl: CHATWOOT },
    {
      fetch: f,
      env: {
        ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
        ONIA_AUDIO_STT_FALLBACK_MODEL: "gpt-4o-mini-transcribe",
        OPENAI_ONIA_CENTER_API_KEY: "sk-de-onia",
      },
    },
  );

  assert.equal(r.ok, true, "con el respaldo declarado, un destino muerto YA NO deja mudo al prospecto");
  assert.match(r.text, /clínica dental/);
  assert.equal(f.llamadas.length, 3, "descarga + primario caido + respaldo");
  assert.ok(String(f.llamadas[2].url).startsWith(DEFAULT_FALLBACK_BASE_URL), "el respaldo va al destino declarado");
  assert.equal(f.llamadas[2].init.body.get("model"), "gpt-4o-mini-transcribe");
  assert.ok(
    r.warnings.some((w) => /respaldo/i.test(w)),
    "que la respuesta venga del respaldo TIENE que verse en el log: si no, nadie arregla el primario",
  );
});

test("el respaldo manda la key en el HEADER — nunca en el form ni en la URL", async () => {
  const f = fetchMock([res({ json: { text: "listo" } })]);
  await transcribeBuffer(
    audioBytes(),
    { baseUrl: DEFAULT_FALLBACK_BASE_URL, model: "gpt-4o-mini-transcribe", apiKey: "sk-secreta" },
    { fetch: f },
  );
  const { url, init } = f.llamadas[0];
  assert.equal(init.headers?.Authorization, "Bearer sk-secreta");
  assert.ok(!String(url).includes("sk-secreta"), "la key no viaja en la URL (queda en logs de proxy)");
  assert.equal(init.body.get("api_key"), null, "ni en el multipart");
});

test("SIN respaldo declarado el comportamiento es el de hoy: una sola llamada y M_AUDIO_FAIL", async () => {
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } }),
    new Error("getaddrinfo ENOTFOUND speaches"),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
    { fetch: f, env: {} },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "stt_fallido");
  assert.equal(f.llamadas.length, 2, "sin respaldo no se inventa una segunda llamada");
});

test("SILENCIO no se reintenta: el primario ya contesto, gastar el respaldo no cambia nada", async () => {
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } }),
    res({ json: { text: "   " } }),
    res({ json: { text: "no deberia llegar aca" } }),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
    {
      fetch: f,
      env: {
        ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
        OPENAI_ONIA_CENTER_API_KEY: "sk-de-onia",
      },
    },
  );
  assert.equal(r.reason, "stt_sin_texto");
  assert.equal(f.llamadas.length, 2, "un silencio no es un destino caido: reintentarlo es pagar por el mismo vacio");
});

test("si TAMBIEN falla el respaldo, el contrato se respeta y los dos motivos se ven", async () => {
  const f = fetchMock([
    res({ body: audioBytes(), headers: { "content-type": "audio/ogg" } }),
    new Error("ENOTFOUND speaches"),
    res({ ok: false, status: 401, body: "invalid api key" }),
  ]);
  const r = await transcribeChatwootAudio(
    { attachments: [{ file_type: "audio", data_url: BLOB }], chatwootBaseUrl: CHATWOOT },
    {
      fetch: f,
      env: {
        ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
        OPENAI_ONIA_CENTER_API_KEY: "sk-vencida",
      },
    },
  );
  assert.equal(r.ok, false);
  assert.equal(r.text, "");
  assert.ok(r.warnings.some((w) => /ENOTFOUND/.test(w)), "el fallo del primario no se pierde al reintentar");
  assert.ok(r.warnings.some((w) => /401/.test(w)), "y el del respaldo tampoco");
  assert.ok(!r.warnings.some((w) => /sk-vencida/.test(w)), "la key NUNCA se loguea");
});
