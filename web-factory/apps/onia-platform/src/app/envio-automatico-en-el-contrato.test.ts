import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");
const TERMINOS = path.join(SRC, "content/legal/terminos.md");

/**
 * Si la venta ofrece un canal que le escribe SOLO al cliente del cliente, el
 * contrato tiene que declararlo — en presente, y con cómo se apaga.
 *
 * El defecto que lo trajo, medido en producción el 2026-09-08. `/terminos`
 * (status `vigente`, el documento que se acepta al crear la cuenta) decía:
 *
 *   §6.1 «Nada sale solo … Onia no envía comunicaciones en tu nombre sin esa
 *        aprobación.»
 *   §6.2 «Si Onia **llegara a ofrecer** modos de envío automático para casos
 *        acotados (por ejemplo, **recordatorios con plantilla fija**), serán
 *        opcionales, se activarán solo con tu **instrucción expresa**.»
 *
 * Los dos eran falsos, y el ejemplo que el §6.2 nombraba en condicional es
 * exactamente lo que corre hoy:
 *
 *   - `crontab -l` del VPS → `*​/15 * * * * run-onia-appointment-reminders.sh`:
 *     confirmaciones y recordatorios de cita al paciente, cada 15 minutos, a
 *     nombre del negocio, sin que nadie apruebe el mensaje.
 *   - `prisma/schema.prisma` → `emailNotifications Boolean @default(true)`, y
 *     las 10 organizaciones de producción lo tienen en `t`: vienen ENCENDIDOS,
 *     nadie dio una «instrucción expresa».
 *   - El add-on de WhatsApp contesta solo, y la venta lo vende así en cuatro
 *     páginas («contesta 24/7», «responde solo»).
 *
 * Y el hueco caro estaba en el §6.3, que asignaba la responsabilidad sólo por
 * «toda comunicación **aprobada**»: los mensajes automáticos —los únicos que
 * de verdad salen— caían fuera de las dos cláusulas a la vez.
 *
 * ⚠️ Por qué ningún gate podía verlo. No sobra una palabra prohibida (obra,
 * autobombo), no falta un rubro, ningún precio se aparta de la fuente, ningún
 * enlace está roto y la pantalla renderiza perfecto. La familia de gates de
 * este carril persigue lo que la venta AFIRMA de más o de menos; acá la venta
 * está bien y **lo que miente es el contrato que la respalda**. Es la
 * dirección inversa de `promesa-fiscal.test.ts`: allá la página afirmaba sin
 * la salvedad, acá el documento NIEGA una capacidad que el producto tiene.
 *
 * El sujeto es el CRUCE (lo que la venta ofrece × lo que el contrato declara),
 * así que el universo se DERIVA de la superficie de venta y no se escribe a
 * mano: el canal automático que alguien agregue mañana nace exigido.
 */

const leer = (rel: string) => readFileSync(path.join(SRC, rel), "utf8");

/**
 * Los canales de envío automático, detectados en la superficie de venta.
 *
 * `enLaVenta` NO es una declaración: se vuelve a medir contra el archivo en
 * cada corrida. Si un canal deja de venderse, sale del universo — y por eso
 * hace falta el caso ancla de más abajo, o el universo se encoge en silencio
 * y todo queda en verde sin vigilar nada.
 */
const CANALES = [
  {
    id: "recordatorios de cita",
    // Los planes venden el recordatorio por correo con su tope mensual.
    seVendeEn: "lib/pricing.ts",
    enLaVenta: /recordatorios? por email/i,
    enElContrato: /recordatorios? de cita/i,
  },
  {
    id: "agente conversacional de WhatsApp",
    // El add-on se vende como un canal que contesta sin que nadie lo toque.
    // El contrato lo nombra como la venta desde el 2026-10-01 (antes «asistente
    // de WhatsApp»; ver `(sitio)/nombre-del-addon.test.ts`).
    seVendeEn: "content/chatbot-precios.ts",
    enLaVenta: /contesta al instante|contesta 24\/7/i,
    enElContrato: /agente conversacional de WhatsApp/i,
  },
] as const;

/** Los canales que la venta ofrece HOY, releídos del disco. */
function canalesOfrecidos() {
  return CANALES.filter((c) => c.enLaVenta.test(leer(c.seVendeEn)));
}

/**
 * La sección del contrato que habla de quién manda qué.
 *
 * Se recorta la sección y no se mide el documento entero: una mención suelta
 * en otro apartado absolvería al gate sin que el cliente lea nunca esa
 * salvedad al lado de la promesa. Misma razón que la ventana de
 * `promesa-fiscal.test.ts`.
 */
function seccionDeEnvios(texto = readFileSync(TERMINOS, "utf8")): string {
  const desde = texto.indexOf("## 6.");
  const hasta = texto.indexOf("## 7.");
  expect(desde, "el contrato ya no tiene la sección de envíos (## 6.)").toBeGreaterThan(-1);
  expect(hasta, "no se pudo cerrar la sección de envíos (## 7.)").toBeGreaterThan(desde);
  return texto.slice(desde, hasta);
}

/** Oraciones de la sección, para medir en la VECINDAD y no en el bloque. */
const oracionesDe = (seccion: string) =>
  seccion
    .split(/(?<=\.)\s+/)
    .map((o) => o.replace(/\s+/g, " ").trim())
    .filter(Boolean);

/** Un envío puesto en futuro es un envío que el cliente no espera recibir. */
const CONDICIONAL = /\bsi\b[^.]*\bllegar|llegara a|llegáramos|en el futuro|m[áa]s adelante|eventualmente|cuando (ofrezcamos|lleguemos|lo ofrezcamos)/i;

/** Frases que niegan que algo salga sin aprobación. */
const NIEGA_ENVIO = /no env[ií]a[^.]*sin[^.]*aprob|sin[^.]*aprobaci[óo]n[^.]*no (sale|env[ií]a)|nada sale sol[oa]/i;

describe("el contrato declara los envíos automáticos que la venta ofrece", () => {
  it("el universo no puede encogerse solo: los dos canales conocidos siguen ofrecidos", () => {
    // Ancla. Sin este caso, borrar la promesa del lado de la VENTA vacía el
    // universo y los casos de abajo pasan en verde sin haber mirado nada.
    expect(canalesOfrecidos().map((c) => c.id)).toEqual([
      "recordatorios de cita",
      "agente conversacional de WhatsApp",
    ]);
  });

  it.each(canalesOfrecidos())("el contrato nombra «$id»", (canal) => {
    expect(
      canal.enElContrato.test(seccionDeEnvios()),
      `La venta ofrece «${canal.id}» (${canal.seVendeEn}) y la sección de envíos del ` +
        `contrato no lo nombra. El cliente acepta un documento que no menciona el canal ` +
        `que le escribe a SU cliente a nombre de su negocio.`,
    ).toBe(true);
  });

  it.each(canalesOfrecidos())("el contrato habla de «$id» en presente, no en condicional", (canal) => {
    const enCondicional = oracionesDe(seccionDeEnvios()).filter(
      (o) => canal.enElContrato.test(o) && CONDICIONAL.test(o),
    );
    expect(
      enCondicional,
      `El contrato pone «${canal.id}» en futuro condicional y el canal ya está vivo. ` +
        `Un envío descrito como hipotético es un envío que el cliente no sabe que va a salir.`,
    ).toEqual([]);
  });

  it("negar el envío sin aprobación sólo vale si la frase se acota a los agentes", () => {
    // El §6.1 viejo negaba TODO envío sin aprobación («Onia no envía
    // comunicaciones en tu nombre sin esa aprobación») mientras el cron
    // mandaba recordatorios cada 15 minutos. La negación es cierta de los
    // agentes y falsa de la plataforma: tiene que decir de quién habla.
    const sinAcotar = oracionesDe(seccionDeEnvios()).filter(
      (o) => NIEGA_ENVIO.test(o) && !/agente/i.test(o),
    );
    expect(
      sinAcotar,
      "El contrato niega el envío automático sin decir que habla sólo de los agentes.",
    ).toEqual([]);
  });

  it("dice cómo se apagan los envíos automáticos", () => {
    // Un canal que le escribe a tu cliente y no se puede parar es peor que no
    // declararlo. El interruptor existe de verdad: `organizations
    // .emailNotifications`, con su switch en /settings (SettingsClient.tsx).
    expect(
      /pausa|desactiv|apag/i.test(seccionDeEnvios()),
      "La sección de envíos no dice cómo se detienen los automáticos.",
    ).toBe(true);
  });
});
