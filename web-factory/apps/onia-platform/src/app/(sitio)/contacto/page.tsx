import type { Metadata } from "next";
import { Entrada, Reveal } from "@/motion";
import {
  AGENDA_DEMO_URL,
  AGENDA_CONSULTA_URL,
  CITA_DURACION_MIN,
  WA_URL_LANDING,
} from "@/lib/site";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

/**
 * /contacto — hasta acá, el que no se registra sin hablar con alguien
 * solo tenía WhatsApp.
 *
 * Las dos citas salen por el WhatsApp que atiende la web, declaradas en
 * lib/site.ts, cada una diciendo cuál eligió el que escribe. No se inventa
 * teléfono fijo, dirección ni correo: lo que existe es lo que se publica.
 *
 * ⚠️ Antes apuntaban a un Cal.com self-hosted que dejó de existir. El host
 * seguía resolviendo y devolvía 302 a /empezar, así que los dos botones daban
 * 200 y mandaban al lead a un formulario de alta — en la página que promete,
 * dos párrafos más arriba, que acá no hay formularios. Ver lib/site.ts y el
 * gate `(sitio)/enlaces.test.ts`.
 *
 * El orden es el del embudo, no el del ego: primero el que todavía no sabe si
 * le sirve, después el que ya vio precios y quiere verlo funcionando.
 *
 * ⚠️ Las dos duran lo mismo y el número sale de `CITA_DURACION_MIN`, que sigue
 * a lo que el motor RESERVA. Hasta el 2026-09-25 esta página vendía 20 y 45
 * minutos mientras el bot bloqueaba 30: se diferenciaban por un reloj que no
 * existía. Lo que de verdad las separa es lo que pasa adentro, y eso ya está
 * escrito abajo en `resultado` y `para`. Ver `lib/duracion-de-la-cita.test.ts`.
 */

export const metadata: Metadata = {
  title: "Hablemos — agendá una demo de Onia | Bolivia",
  description:
    `Elegí el horario por WhatsApp: ${CITA_DURACION_MIN} minutos de consulta comercial para saber si Onia te sirve, o la demo con tu caso adelante. Del otro lado hay alguien que conoce el sistema.`,
  alternates: { canonical: "/contacto" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Elegí el horario y hablamos — Onia",
    description:
      "No hay formulario que caiga en un buzón: elegís vos el día y la hora, y del otro lado hay alguien que conoce el sistema.",
    url: "/contacto",
  },
};

const CITAS = [
  {
    id: "consulta",
    paso: `${CITA_DURACION_MIN} minutos`,
    salto: "Sin compromiso",
    nombre: "Consulta comercial",
    resultado:
      "Nos contás qué negocio tenés y te decimos, de frente, si Onia te sirve o no. Si no te sirve, te lo decimos ahí.",
    para: "Para el que todavía no sabe si esto es para su rubro.",
    href: AGENDA_CONSULTA_URL,
    cta: "Agendar la consulta",
    destacado: false,
  },
  {
    id: "demo",
    paso: `${CITA_DURACION_MIN} minutos`,
    salto: "Ver el sistema",
    nombre: "Demo y diagnóstico",
    resultado:
      "Recorremos el sistema con tu caso adelante: tus clientes, tus cobros, tus agentes. Salís sabiendo qué se enciende primero.",
    para: "Para el que ya vio los precios y quiere verlo funcionando.",
    href: AGENDA_DEMO_URL,
    cta: "Agendar la demo",
    destacado: true,
  },
] as const;

export default function Contacto() {
  return (
    <>
      <Block surface="paper">
        <Entrada>
          <Kicker>Hablemos</Kicker>
          <h1 className={s.display}>
            Elegí el horario y <em>hablamos</em>.
          </h1>
          <p className={s.lead}>
            No hay formulario que caiga en un buzón. Elegís vos el día y la
            hora por WhatsApp, y del otro lado hay alguien que conoce el
            sistema.
          </p>
        </Entrada>
      </Block>

      {/* Las dos citas */}
      <Block surface="paperDim" labelledBy="citas">
        <h2 id="citas" className={s.h2} style={{ position: "absolute", left: "-9999px" }}>
          Agendar
        </h2>
        <Reveal>
          <div className={`${s.plans} ${s.plansTwo}`}>
            {CITAS.map((cita) => (
              <div
                key={cita.id}
                className={`${s.plan} ${cita.destacado ? s.planStar : ""}`}
              >
                <span className={s.planStep}>
                  {cita.paso} · {cita.salto}
                </span>
                <h3 className={s.planName}>{cita.nombre}</h3>
                <p className={s.planResult}>{cita.resultado}</p>
                <p className={s.note} style={{ marginTop: "1em" }}>
                  {cita.para}
                </p>
                <div className={s.planFoot}>
                  <Btn href={cita.href} external>
                    {cita.cta}
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* WhatsApp — para el que no quiere agendar nada */}
      <Block surface="ink" labelledBy="wa">
        <Reveal>
          <Kicker>Ahora mismo</Kicker>
          <h2 id="wa" className={s.h2} style={{ maxWidth: "20ch" }}>
            ¿Una sola pregunta? Escribinos y listo.
          </h2>
          <p className={s.body} style={{ maxWidth: "46em" }}>
            El mismo WhatsApp que atiende a los clientes. Si tu rubro es otro y
            querés saber si entra, este es el lugar para preguntarlo.
          </p>
          {/* «¿Quiénes son estos?» se contesta ANTES de que escriba, no después.

              `/nosotros` salió del nav el 2026-09-08 («ok C» de Sergio Urcullo):
              el menú público es el sistema + Chatbot. Pero salir del menú no es
              salir del sitio, y ésta es la única pantalla que mata esa objeción
              —empresa boliviana, SEPREC, NIT, Santa Cruz—, que con cero clientes
              pagando es el sustituto legítimo del testimonio que no tenemos.

              Va acá y no en la portada porque el sujeto es el mismo que el de
              esta página: el que no se registra sin hablar con alguien. Y es el
              enlace que la mantiene alcanzable e indexada: sin él,
              `alcance.test.ts` la manda al disallow de `robots.ts`. Medido. */}
          <p className={s.note} style={{ maxWidth: "46em", marginTop: "1em" }}>
            ¿Querés saber quién está del otro lado?{" "}
            <a className={s.link} href="/nosotros">
              Quiénes somos
            </a>
            .
          </p>
          <div className={s.actions}>
            <Btn href={WA_URL_LANDING} external>
              Escribir por WhatsApp
            </Btn>
          </div>
        </Reveal>
      </Block>

      {/* Salida para el que no quiere hablar con nadie */}
      <Block surface="signal" labelledBy="solo">
        <Reveal>
          <h2 id="solo" className={s.display} style={{ maxWidth: "18ch" }}>
            ¿Preferís probarlo solo? También se puede.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href="/precios" variant="line">
              Ver precios
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
