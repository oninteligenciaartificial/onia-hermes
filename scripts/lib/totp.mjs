/**
 * totp.mjs — el segundo factor (TOTP, RFC 6238) calculado acá, sin dependencias.
 *
 * POR QUÉ EXISTE, Y POR QUÉ NO DEGRADA EL 2FA
 *
 * `superadmin@onia.com.bo` es la ÚNICA cuenta de la org `onia-interna`, que a su vez es la
 * única con los inboxes reales (Chatwoot 4 y 5) y con conversaciones de desconocidos. Tiene
 * 2FA verificado —se encendió a propósito— así que el magiclink del admin API entra en `aal1`
 * y el guard de `proxy.ts` manda toda pantalla a `/login/2fa`. O sea: justo la bandeja que
 * hay que MIRAR era la única que no se podía mirar, y el carril entero medía con un exit 2.
 *
 * La salida no es apagar el 2FA ni copiar el secreto a un env. `auth.mfa_factors.secret` está
 * en TEXTO PLANO en `supabase-db` (base32 de 32 caracteres; no hay `GOTRUE_DB_ENCRYPTION_KEY`,
 * medido el 2026-09-24) y el instrumento YA consulta esa misma base en cada corrida —
 * `exigirCuentaConPerfil` no puede correr sin `docker exec supabase-db`. Leer el secreto ahí,
 * en vivo, no le da a nadie una capacidad que no tuviera: quien puede correr esto ya podía
 * borrar el factor entero con el service_role. Lo que SÍ ampliaría el alcance es copiarlo a un
 * archivo, a un env o a un log — un lugar más que proteger. Por eso acá no se guarda ni se
 * imprime nunca, y hay un test que mira al llamador para que siga siendo cierto.
 *
 * El 2FA sigue protegiendo lo que fue puesto a proteger: una contraseña robada no alcanza para
 * entrar desde afuera.
 */
import { createHmac } from "node:crypto";

const ALFABETO_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PERIODO = 30;

/**
 * base32 (RFC 4648, sin padding obligatorio) -> bytes.
 * Falla FUERTE con cualquier cosa que no sea base32: si algún día GoTrue guarda el secreto
 * cifrado, esto tiene que decirlo, no devolver un código inventado que GoTrue rechace — ese
 * rechazo se lee como "el 2FA no acepta al instrumento", que es la conclusión equivocada.
 */
export function base32ABytes(secretoBase32) {
  const limpio = String(secretoBase32 || "").replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  if (!limpio || !/^[A-Z2-7]+$/.test(limpio)) {
    throw new Error(
      `El secreto del segundo factor no es base32 (largo ${limpio.length}). ` +
        `Si GOTRUE_DB_ENCRYPTION_KEY se encendió, auth.mfa_factors.secret ahora viene cifrado ` +
        `y este camino hay que rehacerlo — no es que el 2FA rechace al instrumento.`
    );
  }
  let bits = 0;
  let valor = 0;
  const bytes = [];
  for (const caracter of limpio) {
    valor = (valor << 5) | ALFABETO_BASE32.indexOf(caracter);
    bits += 5;
    if (bits >= 8) {
      bytes.push((valor >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** El código de 6 dígitos que corresponde a este instante (o al que se le pida). */
export function codigoTotp(secretoBase32, { enSegundos = Date.now() / 1000, periodo = PERIODO, digitos = 6 } = {}) {
  const clave = base32ABytes(secretoBase32);
  const contador = Math.floor(enSegundos / periodo);

  // El contador viaja como entero de 8 bytes big-endian. Va con BigInt a propósito: los
  // vectores del RFC pasan de 2^32 (T=20000000000) y un `writeUInt32BE` se los come callado.
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(contador));

  const hmac = createHmac("sha1", clave).update(buffer).digest();
  const desplazamiento = hmac[hmac.length - 1] & 0x0f;
  const truncado =
    ((hmac[desplazamiento] & 0x7f) << 24) |
    ((hmac[desplazamiento + 1] & 0xff) << 16) |
    ((hmac[desplazamiento + 2] & 0xff) << 8) |
    (hmac[desplazamiento + 3] & 0xff);

  // El relleno con ceros NO es cosmética: "005924" es un vector real del RFC y sin el padStart
  // sale "5924", que GoTrue rechaza igual que un secreto equivocado.
  return String(truncado % 10 ** digitos).padStart(digitos, "0");
}

/**
 * Cuánto falta para que arranque la ventana siguiente.
 *
 * GoTrue NO acepta dos veces el mismo código (protección de repetición), así que dos corridas
 * del instrumento dentro de los mismos 30 s fallan la segunda con "Invalid TOTP code" — que
 * tiene la misma cara que un secreto mal leído. Esperar a la ventana siguiente es la salida, y
 * por eso esto nunca devuelve 0: una espera de cero segundos reintentaría el MISMO código.
 */
export function segundosHastaLaProximaVentana({ enSegundos = Date.now() / 1000, periodo = PERIODO } = {}) {
  return periodo - (Math.floor(enSegundos) % periodo);
}
