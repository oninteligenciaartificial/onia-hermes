/**
 * CÓMO SE LE PAGA A ONIA — el único lugar del sitio donde se dice.
 *
 * POR QUÉ EXISTE. El 2026-09-11 `onia.com.bo` le prometía al lead, en tres
 * superficies vivas, que iba a pagar su plan **por QR**, y no existe ningún QR:
 * `docker exec onia-platform env | grep -c '^BCP_QR_'` da **0**, así que
 * `isBcpQrConfigured()` es false, y el QR estático de una cuenta personal se
 * eliminó el 2026-08-18 por orden de Sergio Urcullo. Lo que el lead encuentra dos
 * clics después, en `app.onia.com.bo/checkout`, es la rama honesta: «Escribinos y
 * te pasamos los datos de pago». O sea la web y el producto se contradecían, y la
 * que miente llega PRIMERO.
 *
 * NINGÚN GATE DEL SITIO PODÍA VERLO, y por eso vivió meses: no sobra ninguna
 * palabra prohibida, no falta ningún rubro, el monto sale de la fuente única y el
 * enlace responde 200. Lo que estaba mal es el par **(lo que la web promete, la
 * capacidad que producción tiene encendida)** — el mismo eje que ya nos mordió
 * con `SEARXNG_URL` en el alta (ver `capacidad-degradada.test.ts`).
 *
 * EL ARREGLO NO ES BORRAR LA PROMESA, ES CONDICIONARLA. Sacar el medio de pago
 * dejaría al lead sin saber cómo paga; lo que corresponde es decir el camino que
 * CORRE hoy, y que el día que el banco entregue credenciales vuelva solo con
 * cambiar una constante. Mismo criterio que se aplicó del lado del producto en
 * `onia-platform lib/checkout/textos.ts` (commit a645178).
 *
 * POR QUÉ ACÁ EL FLAG VA DERIVADO Y NO POR PARÁMETRO EN CADA LLAMADOR. En el
 * producto `medioDePagoOnia(qr)` recibe el flag en cada llamada porque ahí se
 * evalúa por request y un default dejaría un hueco que ni el gate ni `tsc` ven.
 * Acá es al revés: el sitio es estático y el flag es una constante de build, así
 * que **exportar el objeto ya derivado es estrictamente más seguro** — no existe
 * llamador que pueda pasar el valor equivocado. La función queda pura y pública
 * para poder probar las DOS ramas; las superficies importan `MEDIO_DE_PAGO`.
 *
 * 2026-09-25 — TRES MEDIOS, NO DOS. Sergio Urcullo decidió el 24-sep cobrar con
 * un QR ESTÁTICO de la cuenta BCP de Onia (monto abierto: el dueño escribe el
 * monto, sube el comprobante y lo verificamos) y lo mandó el 25-sep. Es el mismo
 * cambio que el producto hizo en `onia-platform lib/checkout/textos.ts` +
 * `qr-estatico.ts`, y acá se deriva igual: QR dinámico si hay API del banco;
 * si no, QR estático mientras esté vigente; si venció, transferencia. El
 * estático NUNCA dice «se activa solo»: eso es sólo del dinámico, que activa el
 * plan por el callback del banco. OJO: el QR estático existe en producción
 * recién DESPUÉS del deploy de la plataforma que sirve
 * `app.onia.com.bo/pago/qr-bcp-onia.png`; antes, el checkout sigue pidiendo los
 * datos por WhatsApp. Por eso este cambio espera a ese deploy, y
 * `npm run medio-de-pago:vivo` lo verifica pidiendo la imagen. La función deja
 * de ser pura: lee el reloj para la vigencia, igual que el producto, y sus tres
 * ramas se prueban con `vi.setSystemTime`.
 */

export interface MedioDePagoOnia {
  /**
   * FAQ «¿Qué pasa cuando termina la prueba?» — primera oración, la que dice
   * cómo se paga. El resto de la respuesta (qué pasa si no pagás) no depende
   * del medio y vive en la FAQ.
   */
  alTerminarLaPrueba: string;
  /**
   * Cierre del paso «Usalo de verdad N días» en `/empezar` y `/v1/prueba-gratis`:
   * la promesa de que la prueba no cuesta nada, con el medio de pago al lado.
   */
  siTeSirve: string;
}

/**
 * Día en que el banco deja de aceptar el QR estático (fecha de La Paz). Espejo
 * de `venceEl` en `onia-platform lib/checkout/qr-estatico.ts`: si se mueve allá,
 * se mueve acá. Antes de esa fecha alguien tiene que generar un QR nuevo en la
 * app del BCP, reemplazar la imagen del producto y mover las dos constantes. Si
 * nadie lo hace, desde ese día el sitio vuelve solo a la transferencia.
 */
export const QR_ESTATICO_VENCE_EL = "2027-09-25";

/** Medianoche de La Paz del día que vence: ese día ya no se ofrece. */
const CORTE_QR_ESTATICO = new Date(`${QR_ESTATICO_VENCE_EL}T00:00:00-04:00`).getTime();

export function qrEstaticoVigente(hoy: Date = new Date()): boolean {
  return hoy.getTime() < CORTE_QR_ESTATICO;
}

/**
 * El medio de pago que el lead se va a ENCONTRAR al llegar al checkout.
 *
 * `qrDisponible` describe producción, no un deseo: es true sólo si el contenedor
 * tiene las credenciales del banco (`BCP_QR_*`) y el checkout puede emitir un QR.
 * Sin eso, la vigencia del QR estático decide entre él y la transferencia, igual
 * que `medioSinApi()` en el producto.
 */
export function medioDePagoOnia(qrDisponible: boolean): MedioDePagoOnia {
  if (qrDisponible) {
    return {
      alTerminarLaPrueba:
        "Elegís un plan y pagás por QR desde tu app bancaria, mensual o semanal.",
      siTeSirve: "Si te sirve, pagás por QR; si no, no pagás nada.",
    };
  }
  if (qrEstaticoVigente()) {
    // Nuestro QR del BCP con monto abierto: el dueño escanea, escribe el monto
    // y sube el comprobante, que verificamos nosotros. No se activa solo.
    return {
      alTerminarLaPrueba:
        "Elegís un plan y lo pagás con nuestro QR desde la app de tu banco: subís el comprobante y lo verificamos. Mensual o semanal.",
      siTeSirve: "Si te sirve, lo pagás con nuestro QR; si no, no pagás nada.",
    };
  }
  // Sin credenciales del banco y con el QR estático vencido no hay ningún QR:
  // el checkout pasa los datos de pago por WhatsApp y el comprobante lo
  // verificamos nosotros. Es el camino que corre entonces, dicho completo.
  return {
    alTerminarLaPrueba:
      "Elegís un plan y lo pagás por transferencia: te pasamos los datos por WhatsApp, subís el comprobante y lo verificamos. Mensual o semanal.",
    siTeSirve: "Si te sirve, lo pagás por transferencia; si no, no pagás nada.",
  };
}

/**
 * ¿El checkout puede emitir un QR para cobrarle al cliente?
 *
 * **NO se cambia a `true` a ojo.** Es cierto sólo cuando el contenedor de
 * producción tiene las credenciales del banco cargadas, y eso se mide:
 *
 *     docker exec onia-platform env | grep -c '^BCP_QR_'    # 0 = no hay QR
 *
 * Lo cruza `npm run medio-de-pago:vivo` contra producción en cada vuelta, así
 * que una constante que se despegue de la realidad sale en rojo en vez de
 * volver a prometerle al lead algo que no existe.
 *
 * Medido el 2026-09-11: 0 variables `BCP_QR_*` en `onia-platform`.
 */
export const QR_PARA_PAGARLE_A_ONIA = false;

/**
 * Lo que importan las superficies de venta. Nunca escriban el medio a mano.
 *
 * ponytail: se evalúa al construir el sitio (es estático), así que la vigencia
 * del QR estático queda congelada en la fecha del build; un build posterior al
 * vencimiento cambia solo a transferencia. Si alguna vez pasa un año sin deploy,
 * hace falta evaluarlo por request.
 */
export const MEDIO_DE_PAGO: MedioDePagoOnia = medioDePagoOnia(
  QR_PARA_PAGARLE_A_ONIA,
);
