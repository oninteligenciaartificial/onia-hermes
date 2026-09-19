// ONIA — Chatbot propio: TRANSCRIPCION DE NOTAS DE VOZ (Speaches / faster-whisper).
//
// EL PROBLEMA QUE RESUELVE: hasta hoy, si el prospecto mandaba un audio, el bot contestaba
// M_AUDIO_FAIL ("No me llegó bien el audio, ¿me lo escribís?"). En Bolivia una parte enorme del
// WhatsApp son notas de voz, asi que ese era el agujero de comprension mas grande del bot: no es
// que entendiera mal, es que ni siquiera escuchaba. Pedirle a un prospecto que reescriba lo que
// acaba de decir es la forma mas barata de perderlo.
//
// COMO: se baja el adjunto de Chatwoot y se manda a Speaches, que ya corre en el VPS y transcribe
// GRATIS (whisper self-hosted, sin API paga). El texto vuelve al motor como `transcript`, y el
// guion sigue EXACTAMENTE igual que si el prospecto lo hubiera escrito: califica, agenda, todo.
//
// DOS REGLAS QUE YA APRENDIMOS A LOS GOLPES Y NO SE DISCUTEN:
//   1. SE FUERZA EL MODELO `Systran/faster-whisper-small`. Los `faster-distil-*` del contenedor
//      son English-only: no transcriben el español, lo TRADUCEN al inglés. Sin forzar el modelo,
//      el motor recibe inglés y no matchea ni un intent del guion (memoria [[speaches-...]]).
//   2. SE LE PEGA DIRECTO A SPEACHES, no a traves de un proxy del panel. Desde adentro del
//      contenedor onia-center eso es `http://speaches:8000/v1` (la red de docker, contenedor a
//      contenedor); desde el host del VPS es `http://127.0.0.1:3108/v1`. El dia que el panel se
//      cayo (2026-07-30) se llevo puesta la transcripcion aunque Speaches estaba sano.
//
// TOLERANTE POR CONTRATO: no tira NUNCA. Devuelve `{ok, text, reason, warnings}` y el llamador
// decide. Si la transcripcion falla, el bot cae a M_AUDIO_FAIL como siempre — que se rompa el
// audio no puede dejar al prospecto sin ninguna respuesta.
//
// LOS LIMITES NO SON DECORATIVOS (medido en el VPS el 2026-08-01, nota de ~9 s):
//   - modelo frio (primera transcripcion tras el arranque): ~33 s
//   - modelo caliente: entre 6 s y 21 s, segun cuanta carga tenga el VPS
//   Chatwoot corta SU conexion del webhook a los 5 s (`Webhooks::Trigger#webhook_timeout`), asi
//   que la mayoria de los audios van a exceder ese socket. NO es un problema: Chatwoot traga el
//   error (`rescue StandardError` -> log) y NO reintrega, la respuesta al prospecto sale por la
//   API de Chatwoot que es otra llamada, y ademas el dedup en memoria ya reclamo el mensaje ANTES
//   de correr el turno. Lo que si importa es que haya un techo: por eso el tope de bytes corta el
//   audio gigante ANTES de bajarlo, y el timeout corta la transcripcion que se cuelga.
//
// Config (nada secreto: son direcciones internas del VPS):
//   ONIA_AUDIO_STT_BASE_URL        default "http://speaches:8000/v1"
//   ONIA_AUDIO_STT_MODEL           default "Systran/faster-whisper-small"  (NO tocar sin leer la regla 1)
//   ONIA_AUDIO_STT_LANGUAGE        default "es"
//   ONIA_AUDIO_MAX_BYTES           default 8 MiB
//   ONIA_AUDIO_DOWNLOAD_TIMEOUT_MS default 10000
//   ONIA_AUDIO_STT_TIMEOUT_MS      default 45000
//   ONIA_AUDIO_ENABLED             "false" apaga la transcripcion (vuelve al M_AUDIO_FAIL de antes)
// Secreto (se recibe por parametro, NUNCA se loguea): el token de la API de Chatwoot.
//
// EL RESPALDO (2026-09-19). Speaches DEJO DE EXISTIR en la red del VPS —`wget` desde onia-center
// contesta "bad address"— y con el se fue la capacidad entera: toda nota de voz caia a
// M_AUDIO_FAIL mientras `ONIA_CATALOGO_DE_VENTA.md`, que es la fuente unica de QUE se vende,
// marca el chatbot ✅ vivo prometiendo que "entiende FOTOS y audios". La foto si anda.
// Y el proceso vivo YA declaraba el respaldo (`ONIA_AUDIO_STT_FALLBACK_PROVIDER=openai`,
// `ONIA_AUDIO_STT_FALLBACK_MODEL=gpt-4o-mini-transcribe`) sin que NINGUNA linea lo leyera: un
// interruptor que nadie lee es peor que no tenerlo, porque el que lo configuro cree que hay red
// debajo. La promesa no se borra, se cumple — OpenAI habla el MISMO endpoint multipart, asi que
// el respaldo es esta misma funcion con otra baseUrl y una key en el header.
//   ONIA_AUDIO_STT_FALLBACK_PROVIDER  "openai" enciende el respaldo; vacio = como antes
//   ONIA_AUDIO_STT_FALLBACK_MODEL     default "gpt-4o-mini-transcribe"
//   OPENAI_ONIA_CENTER_API_KEY        (o OPENAI_API_KEY) la key; SIN key no hay respaldo
// Se paga solo cuando el primario CAE, y nunca cuando el primario contesta vacio.

export const DEFAULT_BASE_URL = "http://speaches:8000/v1";

/**
 * Proveedores de respaldo que sabemos hablar. Es lista BLANCA a proposito: un nombre que no
 * esta aca no se intenta a ciegas — mandarle un multipart a un destino que no habla esta API
 * es gastar el timeout del prospecto para nada.
 */
export const PROVEEDORES_DE_RESPALDO = Object.freeze({ openai: "https://api.openai.com/v1" });

export const DEFAULT_FALLBACK_BASE_URL = PROVEEDORES_DE_RESPALDO.openai;

/** El barato de OpenAI para esto. El caro no transcribe mejor una nota de voz de WhatsApp. */
export const DEFAULT_FALLBACK_MODEL = "gpt-4o-mini-transcribe";

/** Multilingüe a proposito. Los `faster-distil-*` son English-only y TRADUCEN el español. */
export const DEFAULT_MODEL = "Systran/faster-whisper-small";

/** Se fuerza el idioma: en una nota de 3 s el autodetect se equivoca y devuelve portugués. */
export const DEFAULT_LANGUAGE = "es";

/** Una nota de voz de opus son ~2 KB/s: 8 MiB es mas de una hora. Lo que corta es un video o un wav crudo. */
export const DEFAULT_MAX_BYTES = 8 * 1024 * 1024;

export const DEFAULT_DOWNLOAD_TIMEOUT_MS = 10_000;

/** Con el modelo frio una nota corta tarda ~33 s. Un techo mas bajo fallaria justo en el primer audio del dia. */
export const DEFAULT_STT_TIMEOUT_MS = 45_000;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * EL GUARDA DEL MODELO. No es paranoia: el contenedor onia-center YA TRAE, de su propia config
 * del panel, `ONIA_AUDIO_STT_MODEL=Systran/faster-distil-whisper-large-v3` (verificado en el VPS
 * el 2026-08-01). Ese nombre de variable choca con el nuestro, y los `distil` son English-only:
 * no transcriben el español, lo TRADUCEN. Si el bot heredara esa variable, transcribiria "Hola,
 * quiero ver la demo" como "Hello, I want to see the demo" y no matchearia NI UN intent del
 * guion — y nadie se enteraria, porque no falla: contesta cualquier cosa.
 *
 * Por eso un `distil` NO se acepta ni aunque venga por env: se cae al multilingüe.
 */
export function safeModel(candidate) {
  const model = String(candidate || "").trim();
  if (!model) return DEFAULT_MODEL;
  return /distil/i.test(model) ? DEFAULT_MODEL : model;
}

/**
 * El respaldo DECLARADO, o `null`. Falla CERRADO en las tres formas de estar a medias: sin
 * proveedor, con un proveedor que no sabemos hablar, o sin key. Ninguna de las tres inventa un
 * destino: el prospecto prefiere el M_AUDIO_FAIL de siempre antes que 45 s de espera contra
 * una maquina que no nos va a contestar.
 */
export function getFallbackConfig(env = process.env) {
  const proveedor = String(env.ONIA_AUDIO_STT_FALLBACK_PROVIDER || "").trim().toLowerCase();
  const baseUrl = PROVEEDORES_DE_RESPALDO[proveedor];
  if (!baseUrl) return null;

  const apiKey = String(env.OPENAI_ONIA_CENTER_API_KEY || env.OPENAI_API_KEY || "").trim();
  if (!apiKey) return null;

  return {
    proveedor,
    baseUrl,
    model: String(env.ONIA_AUDIO_STT_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL).trim() || DEFAULT_FALLBACK_MODEL,
    apiKey,
  };
}

export function getTranscribeConfig(env = process.env) {
  return {
    fallback: getFallbackConfig(env),
    baseUrl: String(env.ONIA_AUDIO_STT_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ""),
    model: safeModel(env.ONIA_AUDIO_STT_MODEL),
    language: String(env.ONIA_AUDIO_STT_LANGUAGE || DEFAULT_LANGUAGE),
    maxBytes: positiveNumber(env.ONIA_AUDIO_MAX_BYTES, DEFAULT_MAX_BYTES),
    downloadTimeoutMs: positiveNumber(env.ONIA_AUDIO_DOWNLOAD_TIMEOUT_MS, DEFAULT_DOWNLOAD_TIMEOUT_MS),
    sttTimeoutMs: positiveNumber(env.ONIA_AUDIO_STT_TIMEOUT_MS, DEFAULT_STT_TIMEOUT_MS),
    // Apagable sin desplegar codigo: si Speaches se cae, se vuelve al comportamiento de antes
    // (M_AUDIO_FAIL) en vez de hacer esperar 45 s a cada prospecto que manda un audio.
    enabled: String(env.ONIA_AUDIO_ENABLED ?? "true").toLowerCase() !== "false",
  };
}

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

/**
 * El primer adjunto de audio de un mensaje de Chatwoot. Chatwoot marca `file_type: "audio"` para
 * las notas de voz; se acepta tambien un content-type que empiece con `audio/` por si algun canal
 * lo manda distinto. Devuelve null si no hay ninguno (no tira).
 */
export function pickAudioAttachment(attachments) {
  const list = Array.isArray(attachments) ? attachments : [];
  return (
    list.find((item) => {
      if (!item || typeof item !== "object") return false;
      const fileType = String(item.file_type || item.fileType || "").toLowerCase();
      if (fileType === "audio") return true;
      return String(item.content_type || item.contentType || "").toLowerCase().startsWith("audio/");
    }) || null
  );
}

/**
 * La URL de la que se baja el audio.
 *
 * Chatwoot arma `data_url` con su host PUBLICO (FRONTEND_URL). Desde adentro del contenedor eso
 * significaria salir a internet y volver para buscar un archivo que esta a un salto de red — mas
 * lento y con un modo de falla extra (DNS/TLS/salida a internet) en el camino critico.
 *
 * Ademas es la defensa: se conserva SOLO la ruta y el querystring, y el origen lo pone SIEMPRE la
 * base de Chatwoot que tenemos configurada. Asi un `data_url` manipulado no puede hacernos pedir
 * una URL arbitraria (SSRF) — como mucho pide una ruta de nuestro propio Chatwoot.
 */
export function resolveAttachmentUrl(dataUrl, chatwootBaseUrl) {
  const raw = String(dataUrl || "").trim();
  if (!raw) return null;
  const base = String(chatwootBaseUrl || "").replace(/\/+$/, "");

  // Ruta relativa: solo sirve pegada a una base.
  if (raw.startsWith("/")) return base ? `${base}${raw}` : null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  // Solo http(s): un `data:` o un `file:` en un adjunto no es un audio legitimo.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  // FALLA CERRADO. Sin base configurada NO se devuelve la URL cruda del webhook: si algun dia
  // alguien pasa `baseUrl: ""`, devolver el absoluto anularia en silencio toda la defensa de
  // arriba y volveriamos a pedir el host que diga el payload. Sin base, no se baja nada.
  if (!base) return null;
  return `${base}${parsed.pathname}${parsed.search}`;
}

/**
 * Nombre de archivo para el form. Whisper usa la extension para saber como decodificar.
 * NO TIRA: `decodeURIComponent` revienta con URIError ante un `%` que no es un escape valido
 * (un adjunto llamado "100%off.mp3" alcanza). Como esto corre en medio del turno, una excepcion
 * acá dejaria al prospecto sin respuesta por un detalle de nombre de archivo.
 */
export function filenameFor(url, extension) {
  const fromUrl = String(url || "").split("?")[0].split("/").filter(Boolean).pop() || "";
  if (/\.[a-z0-9]{2,5}$/i.test(fromUrl)) {
    try {
      return decodeURIComponent(fromUrl).slice(0, 120);
    } catch {
      return fromUrl.slice(0, 120); // sin decodificar sirve igual: lo que importa es la extension
    }
  }
  const ext = String(extension || "").replace(/^\./, "").toLowerCase() || "ogg";
  return `nota-de-voz.${ext}`;
}

/** Respuesta de fallo, siempre con la misma forma. NUNCA se lanza una excepcion hacia afuera. */
function fail(reason, warnings = []) {
  return { ok: false, text: "", reason, warnings };
}

// ---------------------------------------------------------------------------
// Descarga
// ---------------------------------------------------------------------------

/**
 * Baja el adjunto de Chatwoot.
 * @returns {Promise<{ok:boolean, bytes?:Uint8Array, contentType?:string, reason:string, warnings:string[]}>}
 */
export async function downloadAudio(options = {}, deps = {}) {
  const doFetch = deps.fetch || options.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") return fail("sin_fetch", ["audio: no hay implementacion de fetch"]);

  const url = String(options.url || "");
  if (!url) return fail("url_invalida", ["audio: el adjunto no traia una URL usable"]);

  const maxBytes = positiveNumber(options.maxBytes, DEFAULT_MAX_BYTES);
  const timeoutMs = positiveNumber(options.timeoutMs, DEFAULT_DOWNLOAD_TIMEOUT_MS);
  const token = String(options.token || "");

  let response;
  try {
    response = await doFetch(url, {
      // El blob de Active Storage es firmado y publico, pero el token va igual por si el adjunto
      // vive detras de la API autenticada. Es un header, no un query param: no termina en un log.
      headers: token ? { api_access_token: token } : {},
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
    });
  } catch (error) {
    return fail("descarga_fallida", [`audio: no se pudo bajar el adjunto: ${String(error?.message || error).slice(0, 200)}`]);
  }

  if (!response || response.ok === false) {
    return fail("descarga_fallida", [`audio: HTTP ${response?.status ?? "?"} al bajar el adjunto`]);
  }

  // Corte BARATO: si el servidor declara el tamaño, se descarta antes de leer un solo byte.
  const declared = Number(response.headers?.get?.("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    return fail("audio_demasiado_grande", [`audio: ${declared} bytes supera el tope de ${maxBytes}`]);
  }

  let bytes;
  try {
    bytes = new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    return fail("descarga_fallida", [`audio: el cuerpo no se pudo leer: ${String(error?.message || error).slice(0, 200)}`]);
  }

  // Corte REAL: sin content-length (chunked) el tope de arriba no protege nada.
  if (bytes.byteLength > maxBytes) {
    return fail("audio_demasiado_grande", [`audio: ${bytes.byteLength} bytes supera el tope de ${maxBytes}`]);
  }
  if (bytes.byteLength === 0) return fail("audio_vacio", ["audio: el adjunto vino vacio"]);

  return {
    ok: true,
    bytes,
    contentType: String(response.headers?.get?.("content-type") || "application/octet-stream"),
    reason: "descargado",
    warnings: [],
  };
}

// ---------------------------------------------------------------------------
// Speaches (API compatible con OpenAI: POST /audio/transcriptions, multipart)
// ---------------------------------------------------------------------------

/**
 * Manda los bytes a Speaches y devuelve el texto.
 * @returns {Promise<{ok:boolean, text:string, reason:string, warnings:string[]}>}
 */
export async function transcribeBuffer(bytes, options = {}, deps = {}) {
  const doFetch = deps.fetch || options.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") return fail("sin_fetch", ["audio: no hay implementacion de fetch"]);
  if (!bytes || bytes.byteLength === 0) return fail("audio_vacio", ["audio: no hay bytes para transcribir"]);

  const baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = String(options.model || DEFAULT_MODEL);
  const language = String(options.language || DEFAULT_LANGUAGE);
  const timeoutMs = positiveNumber(options.timeoutMs, DEFAULT_STT_TIMEOUT_MS);
  // Quien habla, para que el warning diga a QUIEN se le pregunto. Con dos destinos posibles,
  // "no respondio" sin sujeto manda a mirar la maquina equivocada.
  const quien = String(options.etiqueta || "Speaches");
  // Speaches no pide auth (es de la red interna); el respaldo si. La key va SOLO en el header:
  // en la URL queda en los logs de cualquier proxy del camino.
  const apiKey = String(options.apiKey || "");

  const form = new FormData();
  form.append("file", new Blob([bytes], { type: options.contentType || "application/octet-stream" }), options.filename || "nota-de-voz.ogg");
  // `model` es OBLIGATORIO en esta version de Speaches (sin el devuelve 422), y ademas es la regla
  // 1 de la cabecera: el default del contenedor traduce el español al inglés.
  form.append("model", model);
  form.append("language", language);
  form.append("response_format", "json");

  let response;
  try {
    response = await doFetch(`${baseUrl}/audio/transcriptions`, {
      method: "POST",
      body: form,
      ...(apiKey ? { headers: { Authorization: `Bearer ${apiKey}` } } : {}),
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
    });
  } catch (error) {
    // Aca cae el timeout. Es el caso que evita que un audio largo cuelgue el webhook para siempre.
    return fail("stt_fallido", [`audio: ${quien} no respondio: ${String(error?.message || error).slice(0, 200)}`]);
  }

  if (!response || response.ok === false) {
    let detail = "";
    try { detail = String(await response.text()).slice(0, 200); } catch { /* el status ya dice lo importante */ }
    return fail("stt_fallido", [`audio: ${quien} HTTP ${response?.status ?? "?"} ${detail}`]);
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    return fail("stt_fallido", [`audio: ${quien} no devolvio JSON: ${String(error?.message || error).slice(0, 200)}`]);
  }

  const text = String(body?.text ?? "").trim();
  // Un audio de puro silencio transcribe a "". Eso NO es un exito: si se dejara pasar, el motor
  // recibiria un texto vacio y se quedaria mudo. Mejor caer al M_AUDIO_FAIL, que al menos pide algo.
  if (!text) return fail("stt_sin_texto", [`audio: ${quien} transcribio vacio (¿silencio?)`]);

  return { ok: true, text, reason: "transcrito", warnings: [] };
}

// ---------------------------------------------------------------------------
// Punto de entrada — lo que usa el adaptador de Chatwoot
// ---------------------------------------------------------------------------

/**
 * Baja el audio de un mensaje de Chatwoot y lo transcribe.
 *
 * @param {object} options { attachments, token, chatwootBaseUrl, config? }
 * @param {object} [deps]  { fetch, env } — inyectables para testear sin red
 * @returns {Promise<{ok:boolean, text:string, reason:string, warnings:string[]}>}
 *   NUNCA tira. `ok:false` = el llamador tiene que caer al M_AUDIO_FAIL de siempre.
 */
export async function transcribeChatwootAudio(options = {}, deps = {}) {
  const config = options.config || getTranscribeConfig(deps.env || process.env);
  if (!config.enabled) return fail("transcripcion_apagada", ["audio: transcripcion apagada por config"]);

  const attachment = pickAudioAttachment(options.attachments);
  if (!attachment) return fail("sin_adjunto_de_audio", []);

  // Tope por metadato: Chatwoot ya dice cuanto pesa. Descartar aca ahorra la descarga entera.
  const declared = Number(attachment.file_size ?? attachment.fileSize);
  if (Number.isFinite(declared) && declared > config.maxBytes) {
    return fail("audio_demasiado_grande", [`audio: el adjunto declara ${declared} bytes (tope ${config.maxBytes})`]);
  }

  const url = resolveAttachmentUrl(attachment.data_url ?? attachment.dataUrl, options.chatwootBaseUrl);
  if (!url) return fail("url_invalida", ["audio: el adjunto no traia una URL usable"]);

  const downloaded = await downloadAudio(
    { url, token: options.token, maxBytes: config.maxBytes, timeoutMs: config.downloadTimeoutMs },
    deps,
  );
  // Se re-arma la forma del contrato a proposito: `downloadAudio` devuelve `bytes`, que no tiene
  // por que salir de este modulo, y el llamador solo espera {ok, text, reason, warnings}.
  if (!downloaded.ok) {
    return { ok: false, text: "", reason: downloaded.reason, warnings: downloaded.warnings || [] };
  }

  const comunes = {
    language: config.language,
    timeoutMs: config.sttTimeoutMs,
    contentType: downloaded.contentType,
    filename: filenameFor(url, attachment.extension),
  };

  const result = await transcribeBuffer(
    downloaded.bytes,
    { ...comunes, baseUrl: config.baseUrl, model: config.model },
    deps,
  );

  // El respaldo se paga SOLO cuando el destino se cayo (`stt_fallido`). Un `stt_sin_texto` es el
  // primario CONTESTANDO que no hay nada que transcribir: preguntarle lo mismo a otro cuesta plata
  // y devuelve el mismo vacio. Y sin respaldo declarado no hay segunda llamada: es el de antes.
  if (result.ok || result.reason !== "stt_fallido" || !config.fallback) {
    return { ...result, warnings: [...(downloaded.warnings || []), ...(result.warnings || [])] };
  }

  const respaldo = await transcribeBuffer(
    downloaded.bytes,
    {
      ...comunes,
      baseUrl: config.fallback.baseUrl,
      model: config.fallback.model,
      apiKey: config.fallback.apiKey,
      etiqueta: `respaldo ${config.fallback.proveedor}`,
    },
    deps,
  );

  // Los warnings del primario NO se tiran aunque el respaldo salve el turno: si se perdieran,
  // nadie se entera de que el destino barato esta caido y esto factura para siempre. Por lo mismo
  // el exito del respaldo TAMBIEN deja linea: un circuito degradado que no se ve se vuelve normal.
  const usado = respaldo.ok
    ? [`audio: contesto el respaldo ${config.fallback.proveedor} (${config.fallback.model}) — el primario esta caido`]
    : [];

  return {
    ...respaldo,
    warnings: [
      ...(downloaded.warnings || []),
      ...(result.warnings || []),
      ...(respaldo.warnings || []),
      ...usado,
    ],
  };
}
