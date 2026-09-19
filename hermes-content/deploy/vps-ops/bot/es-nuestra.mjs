// ONIA — "¿esta conversacion somos NOSOTROS?", del lado del PRODUCTO.
//
// EL PROBLEMA QUE RESUELVE (medido el 2026-09-18 contra produccion): los cuatro barridos del
// embudo eligen a quien escribirle por ETAPA, TIEMPO y opt-out, y nunca por QUIEN es el contacto.
// De las tres filas que `sweepFollowUpCandidates` iba a tomar apenas se publicara el bot, DOS eran
// nuestras: `chatwoot:49` ("Sonda QA carril chatbot", la sonda del widget que corre cada 30 min) y
// `chatwoot:999999` ("QA Prueba", `+59170000000`, una fila sintetica sin conversacion detras en
// Chatwoot). La unica real era `chatwoot:58`. Con `chatwoot:11` —Sergio, `+59171654992`— pasa lo
// mismo en los barridos que miran su etapa.
//
// POR QUE NO SE VEIA: `esNuestra()` de `scripts/objetivo_visible.mjs` es el criterio unico del
// repo, y sus SEIS consumidores son todos INSTRUMENTOS (sondas, vigias, medidores). Ninguno es el
// producto. O sea que a lo que MIDE le enseñamos a reconocerse, y al circuito que ACTUA no. No
// rompio nunca porque el circuito estuvo APAGADO hasta el 2026-09-17 (02505ade, `EMIT_ARGS`).
//
// POR QUE NO SE IMPORTA `scripts/objetivo_visible.mjs`: `deploy-bot.sh` copia a `/opt/onia/bot`
// por lista blanca de archivos PLANOS de este directorio (`*.mjs`, `*.sh`, unos json). Un import
// que sale del subarbol resuelve en el repo y NO en produccion: quedaria verde en la cadena y
// moriria con ERR_MODULE_NOT_FOUND en el VPS. Por eso la regla vive ACA, y `es-nuestra.test.mjs`
// la ata a la fuente unica para que no puedan separarse.
//
// ⚠️ EL SESGO SE INVIERTE AL CRUZAR AL PRODUCTO, Y POR ESO EL SALTEO ES RUIDOSO.
// En un gate, confundir a un desconocido con nosotros lo pone ROJO de mas: barato, se investiga.
// Aca el mismo error significa que un prospecto REAL no recibe su seguimiento — el fallo exacto
// que este carril existe para evitar, y encima mudo. Por eso ningun barrido DESCARTA la fila en
// silencio: la manda a `skipped[]` con motivo propio (`conversacion_nuestra`), que sale en el
// dry-run, en el JSON de `--emit` y en el log. Un falso positivo queda A LA VISTA y se corrige;
// mandarnos mensajes a nosotros mismos no se veia en ningun lado, y en WhatsApp lo cobra Meta.

/** Un telefono comparable: `+591 716-54992` y `+59171654992` son el mismo numero. */
export function normalizarTelefono(t) {
  return String(t ?? "").replace(/\D/g, "");
}

/**
 * Los telefonos que somos NOSOTROS. Igual que en `scripts/objetivo_visible.mjs`, y el gate lo
 * exige: si alla se suma uno y aca no, el barrido vuelve a escribirle a ese numero.
 */
export const NUESTROS_TELEFONOS = ["+59171654992"];

/** Los contactos de prueba se reconocen por el nombre (`Sonda QA …`, `QA Prueba`, `… Test`). */
export const NOMBRE_DE_PRUEBA = /\b(prueba|qa|test)\b/i;

// ---------------------------------------------------------------------------
// TENENCIA: el banco de pruebas es un INBOX entero, no un nombre de contacto.
//
// Medido contra produccion el 2026-09-19: una FIRMA DEL CONTACTO solo reconoce lo que marcamos
// al sembrar, y a las conversaciones que abre una sonda Chatwoot les pone nombre anonimo
// (`purple-bush-931`, `icy-sunset-817`, …). Por eso DIEZ filas del inbox 7 —`ZZ QA Clinica
// Chatbot`, el banco de pruebas— daban `false` y los cuatro barridos las tomaban por prospectos.
//
// POR QUE NO CUELGA DE `organizations.slug like 'zz-qa-%'`: medido FALSO el mismo dia. En
// produccion `clinic_settings` tiene UNA sola fila con inbox (la de `onia-interna`, inboxes 4 y
// 5); el inbox 7 no cuelga de NINGUNA org. Ese conjunto saldria vacio y el defecto quedaria vivo
// con el gate en verde. El dato con dueño es el NOMBRE del inbox, que lo escribimos nosotros.

/**
 * La marca de un inbox que es banco de pruebas. Es la MISMA convencion de siembra que el resto
 * del repo (`zz-qa-…`), y por eso `qa` suelto no alcanza: un negocio llamado "QA Consultores"
 * recibiria ese slug y quedaria mudo — ya esta medido en `cuentas-que-no-son-clientes.ts`.
 */
export const MARCA_INBOX_DE_PRUEBA = /\bzz[\s_-]*qa\b/i;

/**
 * Los inboxes que NO atienden a nadie. Arranca VACIO a proposito: sin dato, el criterio se
 * comporta exactamente como antes de que esto existiera. Ver el aviso de sesgo de arriba.
 */
let INBOXES_DE_PRUEBA = new Set();

const comoId = (v) => (v === null || v === undefined || v === "" ? null : String(v));

/** Fija el conjunto de la corrida. Sin argumento o con basura, lo VACIA (nunca lo deja a medias). */
export function fijarInboxesDePrueba(ids) {
  INBOXES_DE_PRUEBA = new Set((Array.isArray(ids) ? ids : []).map(comoId).filter(Boolean));
  return INBOXES_DE_PRUEBA;
}

/** Lo que el proceso tiene cargado ahora. Para que un gate pueda mirarlo sin adivinar. */
export function inboxesDePruebaActuales() {
  return new Set(INBOXES_DE_PRUEBA);
}

/** ¿Este inbox es banco de pruebas? Falso mientras no se haya podido cargar el conjunto. */
export function esInboxDePrueba(inboxId) {
  const id = comoId(inboxId);
  return Boolean(id && INBOXES_DE_PRUEBA.has(id));
}

/** Le pregunta a Chatwoot por sus inboxes. Aislado para que el test no necesite red. */
async function listarInboxesDeChatwoot() {
  const baseUrl = String(process.env.CHATWOOT_BASE_URL || "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host").replace(/\/+$/, "");
  const accountId = String(process.env.CHATWOOT_ACCOUNT_ID || "2");
  const token = String(process.env.CHATWOOT_API_TOKEN || process.env.CHATWOOT_TOKEN || "");
  if (!token) throw new Error("sin CHATWOOT_API_TOKEN");
  const res = await fetch(`${baseUrl}/api/v1/accounts/${accountId}/inboxes`, {
    headers: { api_access_token: token },
    signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return Array.isArray(body?.payload) ? body.payload : null;
}

/**
 * Carga UNA vez por corrida el conjunto de inboxes de prueba, DERIVADO del nombre que Chatwoot
 * publica. Tri-estado: `medido:false` es "no pude preguntar", que NO es "no hay ninguno" — y en
 * los dos casos el conjunto queda vacio, porque el error caro es el otro.
 *
 * @returns {Promise<{medido: boolean, ids: Set<string>, warning: string|null}>}
 */
export async function cargarInboxesDePrueba(deps = {}) {
  const listar = typeof deps.listarInboxes === "function" ? deps.listarInboxes : listarInboxesDeChatwoot;
  let lista;
  try {
    lista = await listar();
  } catch (error) {
    fijarInboxesDePrueba([]);
    return { medido: false, ids: new Set(), warning: `inboxes de prueba: no pude preguntarle a Chatwoot (${String(error?.message || error).slice(0, 120)})` };
  }
  if (!Array.isArray(lista)) {
    fijarInboxesDePrueba([]);
    return { medido: false, ids: new Set(), warning: "inboxes de prueba: Chatwoot no devolvio una lista legible" };
  }
  const ids = lista.filter((i) => MARCA_INBOX_DE_PRUEBA.test(String(i?.name ?? ""))).map((i) => i?.id);
  return { medido: true, ids: fijarInboxesDePrueba(ids), warning: null };
}

/**
 * ¿Esta conversacion somos nosotros? Se contesta con lo que el ESTADO ya trae —`displayName`,
 * `publicContact` e `inboxId`, que `stateFromRow` hidrata— asi que ningun barrido necesita una
 * consulta extra POR FILA: el conjunto de inboxes se carga una sola vez por corrida.
 *
 * Las causas son ADITIVAS y ninguna puede apagar a otra: el contacto (telefono o nombre) o la
 * TENENCIA del inbox.
 */
export function esConversacionNuestra(state) {
  if (!state) return false;
  const tel = normalizarTelefono(state.publicContact);
  if (tel && NUESTROS_TELEFONOS.some((n) => normalizarTelefono(n) === tel)) return true;
  if (esInboxDePrueba(state.inboxId)) return true;
  return NOMBRE_DE_PRUEBA.test(String(state.displayName ?? ""));
}

/** El motivo unico, para que los cuatro barridos nombren el salteo con la misma palabra. */
export const MOTIVO_NUESTRA = "conversacion_nuestra";
