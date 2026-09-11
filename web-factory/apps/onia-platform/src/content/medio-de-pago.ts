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
 * El medio de pago que el lead se va a ENCONTRAR al llegar al checkout.
 *
 * `qrDisponible` describe producción, no un deseo: es true sólo si el contenedor
 * tiene las credenciales del banco (`BCP_QR_*`) y el checkout puede emitir un QR.
 */
export function medioDePagoOnia(qrDisponible: boolean): MedioDePagoOnia {
  return qrDisponible
    ? {
        alTerminarLaPrueba:
          "Elegís un plan y pagás por QR desde tu app bancaria, mensual o semanal.",
        siTeSirve: "Si te sirve, pagás por QR; si no, no pagás nada.",
      }
    : {
        // Sin credenciales del banco no hay ningún QR: el checkout pasa los datos
        // de pago por WhatsApp y el comprobante lo verificamos nosotros. Es el
        // camino que corre hoy, dicho completo — no una versión recortada.
        alTerminarLaPrueba:
          "Elegís un plan y lo pagás por transferencia: te pasamos los datos por WhatsApp, subís el comprobante y lo verificamos. Mensual o semanal.",
        siTeSirve:
          "Si te sirve, lo pagás por transferencia; si no, no pagás nada.",
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

/** Lo que importan las superficies de venta. Nunca escriban el medio a mano. */
export const MEDIO_DE_PAGO: MedioDePagoOnia = medioDePagoOnia(
  QR_PARA_PAGARLE_A_ONIA,
);
