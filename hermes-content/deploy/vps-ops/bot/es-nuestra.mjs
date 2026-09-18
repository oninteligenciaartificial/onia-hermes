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

/**
 * ¿Esta conversacion somos nosotros? Se contesta con lo que el ESTADO ya trae —`displayName` y
 * `publicContact`, las dos columnas que `stateFromRow` hidrata— asi que ningun barrido necesita
 * una consulta extra a Chatwoot para preguntarlo.
 */
export function esConversacionNuestra(state) {
  if (!state) return false;
  const tel = normalizarTelefono(state.publicContact);
  if (tel && NUESTROS_TELEFONOS.some((n) => normalizarTelefono(n) === tel)) return true;
  return NOMBRE_DE_PRUEBA.test(String(state.displayName ?? ""));
}

/** El motivo unico, para que los cuatro barridos nombren el salteo con la misma palabra. */
export const MOTIVO_NUESTRA = "conversacion_nuestra";
