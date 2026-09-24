// ---------------------------------------------------------------------------
// marcas-en-disco.mjs — "avisar UNA sola vez", durable entre corridas.
//
// POR QUE EXISTE COMO MODULO Y NO COPIADO EN CADA BARRIDO. El candado nacio adentro de
// `rescate-run.mjs` el 2026-09-11 y funciona; el 2026-09-24 lo necesito el segundo barrido
// (las colgadas de `followup-run.mjs`). Copiarlo era la salida barata y es exactamente el
// error que este bot ya pago: tenia DOS armadores de config hermanos, se arreglo uno, y el
// camino vivo siguio roto en verde. Un candado con dos cuerpos se arregla la mitad de las
// veces.
//
// POR QUE UN ARCHIVO Y NO UNA TABLA — el razonamiento completo, medido contra produccion el
// 2026-09-11, vive en la cabecera de `crearMarcasEnDisco` en `rescate-run.mjs` y sigue
// valiendo palabra por palabra para cualquier barrido:
//
//   1. FK. `bot_messages.conversation_key` REFERENCES `bot_conversations`. El insert de la
//      marca falla JUSTO cuando la conversacion no existe, que es el peor modo de falla.
//   2. CONTABILIDAD. `direction` solo acepta `inbound|outbound` y `usage-run.mjs` cuenta los
//      `outbound` para cobrarselos al cliente: una marca ahi es un mensaje facturado que
//      nunca existio.
//
// Y una tercera, que es la que decidio el caso de las colgadas: una columna nueva
// (`cold_notified_at`) seria la opcion limpia en la base, pero pide una migracion en
// `onia_center` y este carril NO despliega. El archivo no pide nada: se crea solo la primera
// vez que hay algo que recordar.
//
// La reserva es ATOMICA: `wx` falla con EEXIST si el archivo ya estaba, asi que dos corridas
// simultaneas no pueden avisar las dos.
// ---------------------------------------------------------------------------

/**
 * La baranda de hermetismo, con el mensaje de quien la instala.
 *
 * TIRA en vez de no-operar, y es la diferencia entre una baranda y un placebo: un no-op
 * silencioso deja en verde a un caso que cree estar probando el aviso. Asi falla CERRADO.
 *
 * `NODE_TEST_CONTEXT` lo define el runner de Node y NADIE mas (medido: `"child-v8"` adentro,
 * `undefined` afuera). En produccion los barridos corren sin runner, asi que esta guarda no
 * existe.
 *
 * El `error.hermetismo` esta para que el `try/catch` que envuelve al aviso —que existe para
 * que un Telegram caido no tumbe un barrido ya hecho— no se lo trague. Sin eso la baranda
 * falla ABIERTA justo en el caso que viene a cuidar.
 */
export function crearGuardaDeEfectoReal(mensaje) {
  return function guarda() {
    if (!process.env.NODE_TEST_CONTEXT) return;
    const error = new Error(mensaje);
    error.hermetismo = true;
    throw error;
  };
}

/**
 * @param {object} opciones
 * @param {string} [opciones.dir]        directorio explicito (lo usan los tests)
 * @param {string} [opciones.envVar]     variable de entorno que lo puede mover en produccion
 * @param {string} opciones.porDefecto   donde viven las marcas en el VPS
 * @param {Function} [opciones.guarda]   baranda de hermetismo, si no vino `dir` ni la env
 *
 * `reservar` devuelve `true` (es nueva, avisar) · `false` (ya se aviso) · `null` (no pude
 * preguntar). El `null` NO es `false`: se dice aparte, porque "no pude recordar" y "ya avise"
 * llevan a decisiones distintas.
 */
export function crearMarcasEnDisco({ dir, envVar, porDefecto, guarda } = {}) {
  const elegido = dir || (envVar ? process.env[envVar] : undefined);
  // Un directorio propio (o la env) es hermetico y se deja pasar: la baranda no puede volver
  // intesteable a la parte que SI hay que probar. Lo que no se deja pasar es caer al
  // directorio de produccion desde la suite.
  if (!elegido && typeof guarda === "function") guarda();
  const destino = elegido || porDefecto;
  const fs = () => import("node:fs");
  return {
    async reservar(clave) {
      if (!clave) return null;
      try {
        const { mkdirSync, openSync, closeSync } = await fs();
        const { join } = await import("node:path");
        mkdirSync(destino, { recursive: true });
        closeSync(openSync(join(destino, clave), "wx"));
        return true;
      } catch (error) {
        if (error && error.code === "EEXIST") return false;
        return null;
      }
    },
    async liberar(clave) {
      if (!clave) return;
      try {
        const { rmSync } = await fs();
        const { join } = await import("node:path");
        rmSync(join(destino, clave), { force: true });
      } catch {
        // Soltar la marca es best-effort: si falla, el peor caso es un aviso que no se repite.
      }
    },
    async purgar(antesDeMs) {
      try {
        const { readdirSync, statSync, rmSync } = await fs();
        const { join } = await import("node:path");
        for (const nombre of readdirSync(destino)) {
          const ruta = join(destino, nombre);
          if (statSync(ruta).mtimeMs < antesDeMs) rmSync(ruta, { force: true });
        }
      } catch {
        // Que no se pueda limpiar no puede tumbar un barrido: a lo sumo queda un archivo de
        // mas en un directorio que nadie mira.
      }
    },
  };
}
