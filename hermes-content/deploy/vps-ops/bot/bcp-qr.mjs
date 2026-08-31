// ONIA — Cobro por QR del BCP en el chat (la "joya" de F4.b del doc de alta).
//
// EL FLUJO: un HUMANO dispara el cobro (POST /bcp/cobrar) → se genera el QR →
// sale como IMAGEN a la conversacion de Chatwoot (widget y WhatsApp) → el banco
// confirma el pago llamando NUESTRO callback (POST /bcp/callback) → el bot avisa
// "pago recibido" en la misma conversacion. El QR es interoperable: lo escanea
// la app de cualquier banco boliviano.
//
// REGLAS (decididas antes de escribir esto):
//   1. EL BOT JAMAS COBRA SOLO. /bcp/cobrar lo llama una persona (Sergio o el
//      dueño); el motor conversacional no tiene ningun camino hacia aca.
//   2. El banco NO entrego credenciales todavia (decision Sergio 2026-08-28:
//      "armalo con credenciales falsas solo para probar"): BCP_MODE=mock ejercita
//      el circuito entero con el MISMO shape de la API real
//      (ONIA_BCP_API_QR_INTEGRACION.md §2 auth, §3.1 generacion, §3.3 callback).
//      Cuando el banco entregue el kit, BCP_MODE=real + credenciales en
//      webhook.env — el codigo no cambia.
//   3. STATELESS: la conversacion viaja en `collectors` (metadata nuestra que el
//      banco guarda atada al QR y DEVUELVE en el callback). Cero tablas nuevas.
//   4. El callback responde el contrato EXACTO del banco: State 000 = ok,
//      003 = credenciales, otro = error nuestro (y el banco reintenta 3 veces).
//      Un problema NUESTRO de mapeo NO hace reintentar al banco: la plata ya
//      entro — se responde 000 y queda el warning para conciliar a mano.
//
// Modo real pendiente de banco: ademas de las credenciales, exige mTLS con el
// certificado .pfx que entrega el BCP (BCP_PFX_PATH + BCP_PFX_PASS) y TLS 1.2.

import { deflateSync } from "node:zlib";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export function getBcpConfig(env = process.env) {
  const mode = env.BCP_MODE === "mock" || env.BCP_MODE === "real" ? env.BCP_MODE : "off";
  return {
    mode,
    baseUrl: env.BCP_BASE_URL || "https://sandbox.openbanking.bcp.com.bo/Web_ApiQr",
    username: env.BCP_USERNAME || "",
    password: env.BCP_PASSWORD || "",
    appUserId: env.BCP_APP_USER_ID || "",
    publicToken: env.BCP_PUBLIC_TOKEN || "",
    businessCode: env.BCP_BUSINESS_CODE || "",
    serviceCode: env.BCP_SERVICE_CODE || "050",
    // El callback lo llama el BANCO con Basic base64(Username:PublicToken).
    callbackUser: env.BCP_CALLBACK_USER || "",
    callbackToken: env.BCP_CALLBACK_TOKEN || "",
  };
}

/** Glosa como la exige el banco: max 60, sin caracteres especiales (§3.1). */
export function sanearGlosa(gloss) {
  return String(gloss || "")
    .replace(/[@$%#&<>{}[\]\\^~|"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

// ---------------------------------------------------------------------------
// PNG mock — un "QR" determinista sin dependencias (zlib + chunks a mano).
// NO es un QR escaneable: es la imagen que prueba el circuito completo del
// attachment. El QR real lo genera el banco (data.qrImage) en modo real.
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Hash simple y determinista de la semilla (sin Math.random: testeable). */
function semilla32(texto) {
  let h = 2166136261;
  for (const ch of String(texto)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * PNG 8-bit escala de grises, 25x25 modulos a 8px (200x200), con los tres
 * "ojos" de un QR para que se LEA como QR en el chat, y el resto pseudoaleatorio
 * determinista por correlationId.
 */
export function mockQrPng(correlationId) {
  const MODULOS = 25;
  const ESCALA = 8;
  let estado = semilla32(correlationId) || 1;
  const siguiente = () => {
    // xorshift32 — determinista, suficiente para un patron visual
    estado ^= estado << 13;
    estado ^= estado >>> 17;
    estado ^= estado << 5;
    estado >>>= 0;
    return estado;
  };

  const ojo = (fila, col) =>
    (fila < 7 && col < 7) || (fila < 7 && col >= MODULOS - 7) || (fila >= MODULOS - 7 && col < 7);
  const bordeOjo = (fila, col) => {
    const en = (f0, c0) => {
      const f = fila - f0;
      const c = col - c0;
      if (f < 0 || f > 6 || c < 0 || c > 6) return null;
      const anillo = Math.min(f, c, 6 - f, 6 - c);
      return anillo === 0 || anillo === 2 ? 0 : anillo === 1 ? 255 : 0;
    };
    return en(0, 0) ?? en(0, MODULOS - 7) ?? en(MODULOS - 7, 0);
  };

  const matriz = [];
  for (let fila = 0; fila < MODULOS; fila += 1) {
    const linea = [];
    for (let col = 0; col < MODULOS; col += 1) {
      if (ojo(fila, col)) linea.push(bordeOjo(fila, col) ?? 255);
      else linea.push(siguiente() % 2 ? 0 : 255);
    }
    matriz.push(linea);
  }

  const ancho = MODULOS * ESCALA;
  const filas = [];
  for (let y = 0; y < ancho; y += 1) {
    const scanline = Buffer.alloc(1 + ancho); // filtro 0 + pixeles
    for (let x = 0; x < ancho; x += 1) {
      scanline[1 + x] = matriz[Math.floor(y / ESCALA)][Math.floor(x / ESCALA)];
    }
    filas.push(scanline);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(ancho, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // grayscale
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(filas))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Cliente BCP
// ---------------------------------------------------------------------------

let mockIdSeq = 0;

/** `yyyy-MM-dd HH:mm` como lo devuelve el banco (§3.1). */
function formatoExpiracion(fecha) {
  const p = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())} ${p(fecha.getHours())}:${p(fecha.getMinutes())}`;
}

export function crearClienteBcp(env = process.env, opciones = {}) {
  const config = getBcpConfig(env);
  const ahora = opciones.now || (() => new Date());

  async function generarQr({ amount, gloss, correlationId, collectors = [] }) {
    if (config.mode === "off") {
      return { ok: false, error: "BCP apagado: falta BCP_MODE (mock|real) en webhook.env" };
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: "monto invalido: el QR es una orden de cobro y exige un numero > 0" };
    }
    const glosa = sanearGlosa(gloss);

    if (config.mode === "mock") {
      mockIdSeq += 1;
      const vence = ahora();
      vence.setHours(23, 59, 0, 0); // default del banco: vence a las 23:59 del mismo dia
      return {
        ok: true,
        mode: "mock",
        id: mockIdSeq,
        gloss: glosa,
        correlationId,
        qrImage: mockQrPng(correlationId).toString("base64"),
        expirationDate: formatoExpiracion(vence),
        collectors,
      };
    }

    // --- modo real (pendiente de credenciales del banco) ---------------------
    const faltan = ["username", "password", "appUserId", "publicToken", "businessCode"].filter(
      (clave) => !config[clave],
    );
    if (faltan.length) {
      return { ok: false, error: `BCP_MODE=real sin credenciales: faltan ${faltan.join(", ")} (las entrega el banco)` };
    }
    try {
      const res = await fetch(`${config.baseUrl}/api/v4/Qr/Generated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from(`${config.username}:${config.password}`).toString("base64"),
          "Correlation-Id": correlationId,
        },
        body: JSON.stringify({
          appUserId: config.appUserId,
          currency: "BOB",
          amount,
          gloss: glosa,
          serviceCode: config.serviceCode,
          businessCode: config.businessCode,
          singleUse: true, // siempre: evita doble pago (§3.1)
          enableBank: "ALL", // interoperable
          expiration: "00/00:00",
          publicToken: config.publicToken,
          collectors,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json || json.state !== "00" || !json.data?.qrImage) {
        return { ok: false, error: `BCP respondio state=${json?.state ?? res.status}: ${String(json?.message ?? "").slice(0, 120)}` };
      }
      return {
        ok: true,
        mode: "real",
        id: json.data.id,
        gloss: glosa,
        correlationId,
        qrImage: json.data.qrImage,
        expirationDate: json.data.expirationDate,
        collectors,
      };
      // ⚠️ mTLS: el banco exige certificado cliente .pfx. fetch de Node no lo soporta
      // directo; al activar modo real hay que pasar a undici Agent con el .pfx
      // (BCP_PFX_PATH/BCP_PFX_PASS). Se deja explicito para que el primer intento
      // real falle RUIDOSO y no silencioso.
    } catch (error) {
      return { ok: false, error: `BCP inalcanzable: ${String(error?.message || error).slice(0, 160)}` };
    }
  }

  return { mode: config.mode, config, generarQr };
}

// ---------------------------------------------------------------------------
// Rutas (montadas por webhook-server.mjs)
// ---------------------------------------------------------------------------

function parseJson(rawBody) {
  try {
    return JSON.parse(String(rawBody || "{}"));
  } catch {
    return null;
  }
}

/**
 * POST /bcp/cobrar — LA DISPARA UN HUMANO. Bearer con el secreto interno del
 * panel (ONIA_BOT_PREVIEW_SECRET). ponytail: si el cobro gana UI propia en la
 * plataforma, gana tambien secreto propio; hoy son los mismos operadores.
 */
export async function handleBcpCobrar({ rawBody, headers }, deps = {}) {
  const env = deps.env || process.env;
  const secret = env.ONIA_BOT_PREVIEW_SECRET || "";
  if (!secret || String(headers?.authorization || "") !== `Bearer ${secret}`) {
    return { status: 401, body: { ok: false, error: "no_autorizado" } };
  }

  const payload = parseJson(rawBody);
  if (!payload) return { status: 400, body: { ok: false, error: "json_invalido" } };
  const conversationId = Number(payload.conversationId);
  const monto = payload.monto;
  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return { status: 400, body: { ok: false, error: "conversationId invalido" } };
  }
  if (typeof monto !== "number" || !Number.isFinite(monto) || monto <= 0) {
    return { status: 400, body: { ok: false, error: "monto invalido (numero > 0, en Bs)" } };
  }

  const cliente = deps.bcp || crearClienteBcp(env);
  const correlationId = `onia-${conversationId}-${Date.now()}`;
  const qr = await cliente.generarQr({
    amount: monto,
    gloss: payload.glosa || "Cobro Onia",
    correlationId,
    collectors: [{ name: "conversationId", parameter: "conversationId", value: String(conversationId) }],
  });
  if (!qr.ok) return { status: 502, body: { ok: false, error: qr.error } };

  const chatwoot = deps.client;
  if (!chatwoot?.sendAttachment) {
    return { status: 500, body: { ok: false, error: "sin cliente Chatwoot para mandar el QR" } };
  }
  const montoTexto = monto.toFixed(2).replace(".", ",");
  const caption =
    `Escanea este QR para pagar Bs ${montoTexto} — ${qr.gloss}. Vence hoy 23:59.` +
    (qr.mode === "mock" ? " (QR DE PRUEBA — no pagar)" : "");
  // Contrato del adapter: devuelve el MENSAJE creado, o null (tolerante, con el
  // motivo en client.warnings). posted = el objeto existe.
  const envio = await chatwoot.sendAttachment(conversationId, {
    buffer: Buffer.from(qr.qrImage, "base64"),
    filename: `qr-cobro-${qr.id}.png`,
    contentType: "image/png",
    caption,
  });
  const posted = envio !== null && envio !== undefined;

  return {
    status: 200,
    body: {
      ok: true,
      mode: qr.mode,
      id: qr.id,
      correlationId,
      expirationDate: qr.expirationDate,
      posted,
      ...(posted ? {} : { warnings: Array.isArray(chatwoot.warnings) ? chatwoot.warnings.slice(-3) : [] }),
    },
  };
}

function idError() {
  return `E-${Date.now().toString(36)}`;
}

/**
 * POST /bcp/callback — la llama EL BANCO (Basic Username:PublicToken, §3.3).
 * Solo notifica pagos PROCESADOS. Respuesta con el contrato exacto del banco.
 */
export async function handleBcpCallback({ rawBody, headers }, deps = {}) {
  const env = deps.env || process.env;
  const config = getBcpConfig(env);

  const esperado =
    config.callbackUser && config.callbackToken
      ? "Basic " + Buffer.from(`${config.callbackUser}:${config.callbackToken}`).toString("base64")
      : null;
  if (!esperado || String(headers?.authorization || "") !== esperado) {
    return { status: 401, body: { State: "003", Mensaje: "CREDENCIALES INCORRECTAS", Data: { id: idError() } } };
  }

  const payload = parseJson(rawBody);
  if (!payload) {
    return { status: 200, body: { State: "099", Mensaje: "ERROR DE FORMATO", Data: { id: idError() } } };
  }

  // La conversacion viaja en Collectors (regla 3: stateless).
  const collectors = Array.isArray(payload.Collectors) ? payload.Collectors : [];
  const entrada = collectors.find((c) => c && (c.name === "conversationId" || c.parameter === "conversationId"));
  const conversationId = Number(entrada?.value);

  let posted = false;
  if (Number.isInteger(conversationId) && conversationId > 0 && deps.client?.sendMessage) {
    const monto = typeof payload.Amount === "number" ? payload.Amount.toFixed(2).replace(".", ",") : String(payload.Amount ?? "");
    const operacion = payload.OperationNumber ? ` (operacion ${payload.OperationNumber})` : "";
    const aviso = `✅ Pago recibido: Bs ${monto}${operacion}. ¡Gracias!`;
    try {
      const out = await deps.client.sendMessage(conversationId, aviso);
      posted = out !== null && out !== undefined; // contrato del adapter: objeto o null
    } catch {
      posted = false; // la plata ya entro: NUNCA hacer reintentar al banco por esto
    }
  }

  // 000 SIEMPRE que la notificacion se recibio bien: un fallo nuestro de aviso no
  // se arregla con reintentos del banco — queda `posted:false` en el log para
  // conciliar a mano.
  return {
    status: 200,
    body: { State: "000", Mensaje: "COMPLETADO", Data: { Id: payload.Id ?? null } },
    posted,
  };
}
