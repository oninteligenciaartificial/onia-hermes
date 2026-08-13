// ONIA — Chatbot propio: MEDIDOR DE MENSAJES SALIENTES (por cliente, por mes, por categoria).
//
// Para que existe: desde el 1-oct-2026 los mensajes de SERVICIO de WhatsApp dejan de ser gratis.
// Sin este numero no se puede (a) facturar el excedente de la bolsa incluida en el plan ni
// (b) auditar el margen contra lo que Meta cobra de verdad. Es lectura pura: NO manda nada, NO
// escribe nada, NO toca el motor de respuestas.
//
//   entrada : argumentos de CLI (no hay stdin)
//   salida  : texto legible · --json una linea JSON
//   codigo de salida: SIEMPRE 0 (lo llama n8n; un error se reporta en la salida, no reventando).
//
// LO QUE ESTE NUMERO ES: UN TECHO, NO LA FACTURA. Leelo antes de cobrarle a nadie.
//   `bot_messages.delivery_status` se escribe UNA vez, en el momento del POST, y la tabla es
//   append-only: nadie vuelve a tocar la fila. Pero Meta responde el veredicto DESPUES, por webhook
//   asincrono. Comprobado en vivo el 2026-08-13: el mensaje 31 de Chatwoot paso de `sent` a
//   `failed` 9 segundos mas tarde (error 131042). Nuestra fila quedo diciendo `sent` para siempre.
//   Meta NO cobra los fallidos => contar por `sent` SOBREESTIMA. Con lo que hay guardado hoy ese
//   caso es INDISTINGUIBLE, asi que el reporte lo dice en la cara (ver renderHuman y `basis`).
//   Para facturarle a un cliente, el techo sirve de tope y de alarma; la cifra exacta sale de Meta.
//
// FUENTE DE VERDAD FUTURA (anotada, NO construida en esta tarea): el webhook de estado de Meta trae
//   el precio real — `pricing: {billable, pricing_model: "PMP", category, type}`, verificado en los
//   logs de Chatwoot el 2026-08-13. La categoria de cobro la decide META, no nosotros. Ese webhook
//   llega Meta -> Chatwoot y Chatwoot NO nos lo reenvia (nuestro webhook solo ve eventos de
//   Chatwoot), asi que hoy no lo tenemos guardado. El dia que se guarde, el medidor lee de ahi y
//   estas tarifas quedan como estimacion. `pricing_model: "PMP"` = per-message pricing YA activo.
//
// REGLAS DURAS
//   1. SOLO se cuenta lo que SALIO: `direction = 'outbound'` y `delivery_status = 'sent'`.
//      `simulated` (simulador), `skipped` (dry-run) y `failed` (fallo en el POST mismo) no los
//      cobra Meta y aca tampoco. Igual se muestran aparte: si un mes tiene 300 `skipped`, es que el
//      bot esta en dry-run, y eso se tiene que ver.
//   2. LA CATEGORIA SALE DEL REGISTRO DE PLANTILLAS APROBADAS, no de "template_key no es null".
//      OJO con esto, que es el error facil: `bot_messages.template_key` es la clave del GUION
//      (M0, M1b, M0_DISCLOSURE, llm_freeform...), no una plantilla de Meta. Verificado contra la
//      base real del VPS el 2026-08-13: de 27 filas, ninguna tenia template_key nulo y NINGUNA
//      era plantilla. Contar "template_key != null" como plantilla inflaria la factura ~6x.
//      Plantillas de verdad hay dos, las dos aprobadas y las dos con nombre en Meta:
//        M3_PLANTILLA -> `seguimiento_demo`  (MARKETING)  — followup-run.mjs
//        M9_PLANTILLA -> `recordatorio_demo` (UTILITY)    — reminder-run.mjs
//      Es la MISMA taxonomia que ya usan esos dos barridos en `sendKind` / `templateName`.
//   3. NO SE INVENTA UNA TARIFA. Una clave `*_PLANTILLA` que nadie registro aca cae en
//      `plantilla_sin_tarifa`: se cuenta, se avisa y se cobra 0 hasta que alguien ponga el precio.
//      Tratarla como servicio seria regalar un envio pago.
//   4. DETERMINISTA: el mes entra por `--month` (o se deriva del `--now`). Cero Date.now() en la
//      logica; el unico esta en main(), en el borde.
//   5. TOLERANTE: sin base -> totales en cero + warning. Nunca tira.
//
// Uso:
//   node usage-run.mjs                       mes en curso, salida legible
//   node usage-run.mjs --month 2026-10       un mes exacto (UTC)
//   node usage-run.mjs --json                una linea JSON para n8n / el panel
//   node usage-run.mjs --now 2026-10-15T12:00:00Z
//
// Tabla de tarifas y tipo de cambio: ver TARIFAS_USD y BOB_POR_USD mas abajo.

import { pathToFileURL } from "node:url";

import { DEFAULT_CONFIG } from "./config.mjs";
import { createStore } from "./persistence.mjs";

// ---------------------------------------------------------------------------
// Tarifas y tipo de cambio — los dos numeros que deciden la plata
// ---------------------------------------------------------------------------

/**
 * Bs por USD. NO va escondido en una cuenta: es una constante con nombre y con fecha.
 *
 * 11,66 Bs/USD — verificado en el BCB el 13-ago-2026. Se mueve: desde la flotacion del 26-jun-2026
 * el tipo de cambio dejo de ser fijo, asi que este numero CADUCA. Los docs internos que dicen
 * 11,37 estan viejos (y los que dicen 6,96 son de otra era).
 * Override sin tocar codigo: ONIA_BOB_PER_USD=11.80 node usage-run.mjs
 */
export const BOB_POR_USD = 11.66;
export const BOB_POR_USD_VERIFICADO = "2026-08-13";

export function bobPorUsd(env = process.env) {
  const override = Number(env?.ONIA_BOB_PER_USD);
  return Number.isFinite(override) && override > 0 ? override : BOB_POR_USD;
}

/**
 * Lo que cobra Meta por mensaje entregado, en USD, para BOLIVIA. Fuente: tarifario de Meta vigente
 * desde el 1-jul-2025 + el fin de los mensajes de servicio gratis el 1-oct-2026.
 * NO agregar una tarifa "de memoria": si falta una categoria, se deja fuera y se marca.
 */
export const TARIFAS_USD = Object.freeze({
  servicio: 0.0113,
  utility: 0.0113,
  marketing: 0.0740, // 6,5x el resto: por eso las plantillas de marketing se facturan SIEMPRE aparte
  authentication: 0.0113, // hoy 0 envios (no hay plantilla de este tipo), la categoria queda lista
});

/**
 * Hasta esta fecha el mensaje de SERVICIO (dentro de la ventana de 24 h, sin plantilla) es GRATIS.
 * Se cobra por la fecha de CADA mensaje y no por la del mes: asi el reporte de agosto no fabrica
 * un costo que Meta todavia no factura, y el de octubre no lo pierde.
 */
export const SERVICIO_SE_COBRA_DESDE = "2026-10-01T00:00:00.000Z";

/**
 * Las plantillas aprobadas en Meta, con su categoria REAL. Espejo de lo que ya declaran
 * config.mjs (M3_PLANTILLA / M9_PLANTILLA), followup-run.mjs y reminder-run.mjs.
 * Plantilla nueva aprobada => se agrega ACA, si no cae en `plantilla_sin_tarifa` y se ve.
 */
export const PLANTILLAS_META = Object.freeze({
  M3_PLANTILLA: Object.freeze({ nombre: "seguimiento_demo", categoria: "marketing" }),
  M9_PLANTILLA: Object.freeze({ nombre: "recordatorio_demo", categoria: "utility" }),
});

/** Orden fijo del reporte. `plantilla_sin_tarifa` va al final: es la alarma, no una categoria. */
export const CATEGORIAS = Object.freeze([
  "servicio",
  "utility",
  "marketing",
  "authentication",
  "plantilla_sin_tarifa",
]);

/** Lo que Meta NO cobra y por lo tanto no se factura, pero si se muestra. */
export const NO_COBRABLES = Object.freeze(["simulated", "skipped", "failed"]);

/** Techo de filas leidas. Lo unico que no puede pasar es contar de menos EN SILENCIO. */
export const MAX_FILAS = 50000;
const PAGINA = 1000;

// ---------------------------------------------------------------------------
// Clasificacion (pura)
// ---------------------------------------------------------------------------

/**
 * Categoria de cobro de UNA fila de bot_messages. Ver regla dura 2: manda el registro de
 * plantillas, no la presencia de `template_key`.
 * @returns {{categoria: string, templateKey: string|null, templateName: string|null}}
 */
export function clasificar(row) {
  const key = String(row?.template_key ?? "").trim();
  const conocida = Object.prototype.hasOwnProperty.call(PLANTILLAS_META, key) ? PLANTILLAS_META[key] : null;
  if (conocida) return { categoria: conocida.categoria, templateKey: key, templateName: conocida.nombre };
  // Clave que se llama plantilla pero no esta registrada: NO se asume servicio (seria regalarla).
  if (/_PLANTILLA$/i.test(key)) return { categoria: "plantilla_sin_tarifa", templateKey: key, templateName: null };
  return { categoria: "servicio", templateKey: key || null, templateName: null };
}

/**
 * Lo que se CONTABILIZA: saliente y aceptado por el canal al mandarlo. Se re-chequea en memoria
 * (el barrido ya filtra en SQL, pero la fila puede venir de cualquier lado).
 *
 * OJO: `sent` = "el POST salio", no "Meta lo cobro". El rechazo asincrono posterior (131042 y
 * companiia) NO deja rastro en esta fila — de ahi que el total sea un techo. Ver el encabezado.
 */
export function esCobrable(row) {
  return row?.direction !== "inbound" && row?.delivery_status === "sent";
}

/**
 * Que representa el numero, en una palabra, para que el panel/n8n lo etiquete sin interpretar.
 * `techo_intentado` = lo que se intento y el canal acepto. Cuando exista el webhook de precio de
 * Meta guardado, este valor pasa a `facturado_meta` y recien ahi es la factura.
 */
export const BASIS = "techo_intentado";

/** La advertencia va SIEMPRE, en toda salida: un techo presentado como factura es plata mal cobrada. */
export const AVISO_TECHO =
  "TECHO, no factura: cuenta lo que salio ('sent' al hacer el POST). Meta puede marcarlo fallido " +
  "despues por webhook asincrono (ej. 131042) y esos NO los cobra. La cifra exacta la tiene Meta.";

/**
 * Y el hueco que va para el otro lado. Verificado en la base del VPS el 2026-08-13: lo que un
 * HUMANO manda desde Chatwoot (incluidas las plantillas aprobadas, que es todo el trafico real de
 * ese dia — mensajes 30 y 31) NO entra como saliente. El webhook lo anota con `takeoverTurn` y la
 * fila termina siendo un placeholder `direction = 'inbound'` que solo sirve de dedup.
 * O sea: el medidor ve lo que manda EL BOT. Lo que manda Sergio a mano queda afuera y tambien se
 * paga. Arreglarlo es tocar el webhook/adapter de Chatwoot — otro carril, decidido aparte.
 */
export const AVISO_HUECO =
  "Y a la vez PISO: lo que un humano manda desde Chatwoot (plantillas incluidas) se guarda como " +
  "placeholder entrante y NO se cuenta aca. Este medidor mide al BOT, no a la bandeja.";

/**
 * USD de UN mensaje. `null` = no hay tarifa conocida (no se inventa; se cuenta aparte).
 * Una fecha ilegible se cobra igual: preferimos sobrestimar el costo antes que subestimar la factura.
 */
export function costoUsd(categoria, createdAtIso) {
  const tarifa = TARIFAS_USD[categoria];
  if (tarifa === undefined) return null;
  if (categoria !== "servicio") return tarifa;
  const at = Date.parse(createdAtIso);
  if (!Number.isFinite(at)) return tarifa;
  return at >= Date.parse(SERVICIO_SE_COBRA_DESDE) ? tarifa : 0;
}

/**
 * A QUE CLIENTE se le cobra esta fila.
 *
 * ESTADO HOY: `bot_messages` NO tiene columna de cliente/tenant — verificado contra la base real
 * del VPS el 2026-08-13 (columnas: message_key, conversation_key, direction, author, body,
 * template_key, reply_source, stage_before, stage_after, guardrail_ok, guardrail_violations,
 * delivery_status, external_message_id, raw, created_at). Y no hace falta: el bot atiende UN solo
 * numero, el de Onia, asi que todo el consumo es de `DEFAULT_CONFIG.tenant`.
 *
 * COMO SE LLENA CUANDO HAYA UN SEGUNDO CLIENTE (sin migracion, hoy mismo): quien escribe el
 * mensaje pone `tenant` en `bot_messages.raw` (persistence.insertOutbound ya recibe `extra.raw`).
 * Si mas adelante se agrega una COLUMNA `tenant`, esta funcion ya la prefiere — solo hay que
 * sumarla al `select` de listOutboundMessages.
 */
export function tenantDe(row, config = DEFAULT_CONFIG) {
  const raw = row?.raw && typeof row.raw === "object" ? row.raw : {};
  const porDefecto = config?.tenant || DEFAULT_CONFIG.tenant || "onia";
  return String(row?.tenant ?? raw.tenant ?? porDefecto).trim() || porDefecto;
}

// ---------------------------------------------------------------------------
// Mes (UTC)
// ---------------------------------------------------------------------------

/** "2026-08" -> { month, from, to }. El corte es UTC, igual que `created_at`. null si no parsea. */
export function rangoDelMes(monthKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(monthKey ?? "").trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return {
    month: `${match[1]}-${match[2]}`,
    from: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
    to: new Date(Date.UTC(year, month, 1)).toISOString(), // mes 12 rueda solo al enero siguiente
  };
}

/** ISO -> "YYYY-MM" (UTC). null si la fecha no parsea. */
export function mesDe(nowIso) {
  const at = Date.parse(nowIso);
  if (!Number.isFinite(at)) return null;
  return new Date(at).toISOString().slice(0, 7);
}

// ---------------------------------------------------------------------------
// Conteo (puro)
// ---------------------------------------------------------------------------

const redondear = (valor, decimales) => Number(valor.toFixed(decimales));

function bucketVacio() {
  const categorias = {};
  for (const nombre of CATEGORIAS) categorias[nombre] = { count: 0, usd: 0 };
  const noCobrables = {};
  for (const estado of NO_COBRABLES) noCobrables[estado] = 0;
  return { count: 0, usd: 0, bob: 0, categorias, noCobrables };
}

function cerrar(bucket, bob) {
  for (const nombre of CATEGORIAS) {
    const cat = bucket.categorias[nombre];
    cat.usd = redondear(cat.usd, 4);
    cat.bob = redondear(cat.usd * bob, 2);
  }
  bucket.usd = redondear(bucket.usd, 4);
  bucket.bob = redondear(bucket.usd * bob, 2);
  return bucket;
}

/**
 * EL CONTEO: filas de bot_messages -> consumo por cliente, por categoria, con costo USD y Bs.
 * Pura y sin red: se le pasan las filas ya leidas.
 * @returns {{clientes: object[], totales: object, bobPorUsd: number, sinTarifa: number}}
 */
export function contarUso(rows, options = {}) {
  const bob = Number(options.bobPorUsd) > 0 ? Number(options.bobPorUsd) : BOB_POR_USD;
  const config = options.config || DEFAULT_CONFIG;
  const porTenant = new Map();
  const totales = bucketVacio();
  let sinTarifa = 0;

  for (const row of rows || []) {
    const tenant = tenantDe(row, config);
    if (!porTenant.has(tenant)) porTenant.set(tenant, bucketVacio());
    const bucket = porTenant.get(tenant);

    if (!esCobrable(row)) {
      const estado = String(row?.delivery_status ?? "");
      // Un estado desconocido tampoco se cobra, pero no se pierde: cae en `failed` (el balde de
      // "algo raro paso"), que es lo que un humano tiene que ir a mirar.
      const balde = NO_COBRABLES.includes(estado) ? estado : "failed";
      bucket.noCobrables[balde] += 1;
      totales.noCobrables[balde] += 1;
      continue;
    }

    const { categoria } = clasificar(row);
    const usd = costoUsd(categoria, row?.created_at);
    if (usd === null) sinTarifa += 1;
    const monto = usd ?? 0;

    bucket.count += 1;
    bucket.usd += monto;
    bucket.categorias[categoria].count += 1;
    bucket.categorias[categoria].usd += monto;
    totales.count += 1;
    totales.usd += monto;
    totales.categorias[categoria].count += 1;
    totales.categorias[categoria].usd += monto;
  }

  const clientes = [...porTenant.entries()]
    .map(([tenant, bucket]) => ({ tenant, ...cerrar(bucket, bob) }))
    .sort((a, b) => b.usd - a.usd || a.tenant.localeCompare(b.tenant));

  return { clientes, totales: cerrar(totales, bob), bobPorUsd: bob, sinTarifa };
}

// ---------------------------------------------------------------------------
// Reporte (lee la base)
// ---------------------------------------------------------------------------

/**
 * @param {object} options { month?, nowIso?, maxRows? } — `month` manda; si no, se deriva de nowIso
 * @param {object} [deps]  { store, config, env } — inyectables para test
 */
export async function runUsageReport(options = {}, deps = {}) {
  const store = deps.store || createStore();
  const config = deps.config || DEFAULT_CONFIG;
  const bob = bobPorUsd(deps.env || process.env);
  const maxRows = Number(options.maxRows) > 0 ? Math.floor(options.maxRows) : MAX_FILAS;

  const monthKey = options.month || mesDe(options.nowIso);
  const rango = rangoDelMes(monthKey);

  const result = {
    ok: true,
    month: rango?.month || null,
    from: rango?.from || null,
    to: rango?.to || null,
    // Que ES el numero. Viaja en el JSON para que n8n/el panel no lo presenten como una factura.
    basis: BASIS,
    aviso: AVISO_TECHO,
    avisoHueco: AVISO_HUECO,
    bobPorUsd: bob,
    bobVerificado: BOB_POR_USD_VERIFICADO,
    scanned: 0,
    truncated: false,
    clientes: [],
    totales: bucketVacio(),
    notes: [],
    warnings: store.warnings,
  };

  if (!rango) {
    result.ok = false;
    result.error = `mes invalido: ${String(monthKey)} (formato YYYY-MM)`;
    return result;
  }

  const rows = [];
  let offset = 0;
  for (;;) {
    const page = await store.listOutboundMessages(rango.from, rango.to, { limit: PAGINA, offset });
    if (!page) {
      // Sin base o base caida. El motivo ya quedo en store.warnings; los totales quedan en cero y
      // se dice que la lectura no se completo — un cero silencioso aca es una factura mal emitida.
      result.notes.push("consulta_sin_resultado");
      return result;
    }
    rows.push(...page);
    // Se corta con la pagina VACIA, no con "vino menos de lo pedido": PostgREST puede recortar el
    // lote por `db-max-rows` y ahi cortar antes seria contar de menos.
    if (page.length === 0) break;
    offset += page.length;
    if (rows.length >= maxRows) {
      result.truncated = true;
      result.warnings.push(`usage: se corto en ${maxRows} filas — el total es un PISO, no el total`);
      break;
    }
  }

  result.scanned = rows.length;
  const conteo = contarUso(rows, { bobPorUsd: bob, config });
  result.clientes = conteo.clientes;
  result.totales = conteo.totales;
  if (conteo.sinTarifa > 0) {
    result.warnings.push(
      `usage: ${conteo.sinTarifa} envio(s) con plantilla SIN tarifa registrada — se cobraron 0 USD. Registrala en PLANTILLAS_META`,
    );
  }
  return result;
}

// ---------------------------------------------------------------------------
// Salida legible
// ---------------------------------------------------------------------------

const money = (usd, bob) => `USD ${usd.toFixed(4)} · Bs ${bob.toFixed(2)}`;

function renderBucket(lines, bucket, sangria = "  ") {
  for (const nombre of CATEGORIAS) {
    const cat = bucket.categorias[nombre];
    if (cat.count === 0 && nombre === "plantilla_sin_tarifa") continue;
    lines.push(`${sangria}${nombre.padEnd(20)} ${String(cat.count).padStart(6)}   ${money(cat.usd, cat.bob)}`);
  }
  lines.push(`${sangria}${"TOTAL".padEnd(20)} ${String(bucket.count).padStart(6)}   ${money(bucket.usd, bucket.bob)}`);
  const no = NO_COBRABLES.map((estado) => `${estado} ${bucket.noCobrables[estado]}`).join(" · ");
  lines.push(`${sangria}no se cobran: ${no}`);
}

export function renderHuman(result) {
  const lines = [
    `ONIA — mensajes salientes de WhatsApp · mes ${result.month || "?"} (corte UTC)`,
    `rango: ${result.from} .. ${result.to} · filas leidas: ${result.scanned}${result.truncated ? " (CORTADO)" : ""}`,
    `tipo de cambio: ${result.bobPorUsd} Bs/USD (BCB, verificado ${result.bobVerificado})`,
    AVISO_TECHO,
    AVISO_HUECO,
    "",
  ];
  if (result.error) lines.push(`ERROR: ${result.error}`, "");

  if (result.clientes.length === 0) lines.push("Sin envios cobrables en el mes.", "");
  for (const cliente of result.clientes) {
    lines.push(`CLIENTE ${cliente.tenant}`);
    renderBucket(lines, cliente);
    lines.push("");
  }

  if (result.clientes.length > 1) {
    lines.push("TOTAL GENERAL");
    renderBucket(lines, result.totales);
    lines.push("");
  }

  if (result.notes.length) lines.push(`NOTAS: ${result.notes.join(" · ")}`);
  if (result.warnings.length) {
    lines.push("", "WARNINGS");
    for (const warning of result.warnings) lines.push(`  ${warning}`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseArgs(argv = []) {
  const args = { month: null, now: null, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = String(argv[index]);
    const value = () => argv[++index] ?? null;
    if (arg === "--json") args.json = true;
    else if (arg === "--month") args.month = value();
    else if (arg.startsWith("--month=")) args.month = arg.slice("--month=".length);
    else if (arg === "--now") args.now = value();
    else if (arg.startsWith("--now=")) args.now = arg.slice("--now=".length);
  }
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  try {
    // UNICO Date.now() del archivo, y en el borde.
    const nowIso = args.now || new Date().toISOString();
    const result = await runUsageReport({ month: args.month, nowIso });
    process.stdout.write(`${args.json ? JSON.stringify(result) : renderHuman(result)}\n`);
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ ok: false, clientes: [], warnings: [], error: String(error?.message || error).slice(0, 300) })}\n`,
    );
  }
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
