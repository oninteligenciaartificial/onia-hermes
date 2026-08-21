import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { CAL_DEMO_URL, CAL_CONSULTA_URL, WA_URL_LANDING } from "@/lib/site";
import { EMPEZAR_URL } from "../nav";
import { Block, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

/**
 * /preview/contacto — hasta acá, el que no se registra sin hablar con alguien
 * solo tenía WhatsApp.
 *
 * Los dos eventos son la agenda PROPIA (Cal.com self-hosted en el VPS, cuenta
 * `onia`), declarados en lib/site.ts. Verificados en vivo antes de linkearlos:
 * los dos responden 200 en público (2026-08-21). No se inventa teléfono fijo,
 * dirección ni correo: lo que existe es lo que se publica.
 *
 * El orden es el del embudo, no el del ego: primero los 20 minutos del que
 * todavía no sabe si le sirve, después los 45 del que ya vio precios.
 */

export const metadata: Metadata = {
  title: "Contacto — preview del rediseño",
};

const CITAS = [
  {
    id: "consulta",
    paso: "20 minutos",
    salto: "Sin compromiso",
    nombre: "Consulta comercial",
    resultado:
      "Nos contás qué negocio tenés y te decimos, de frente, si Onia te sirve o no. Si no te sirve, te lo decimos ahí.",
    para: "Para el que todavía no sabe si esto es para su rubro.",
    href: CAL_CONSULTA_URL,
    cta: "Agendar 20 minutos",
    destacado: false,
  },
  {
    id: "demo",
    paso: "45 minutos",
    salto: "Ver el sistema",
    nombre: "Demo y diagnóstico",
    resultado:
      "Recorremos el sistema con tu caso adelante: tu agenda, tus cobros, tus agentes. Salís sabiendo qué se enciende primero.",
    para: "Para el que ya vio los precios y quiere verlo funcionando.",
    href: CAL_DEMO_URL,
    cta: "Agendar la demo",
    destacado: true,
  },
] as const;

export default function PreviewContacto() {
  return (
    <>
      <Block surface="paper">
        <Reveal>
          <Kicker>Hablemos</Kicker>
          <h1 className={s.display}>
            Elegí el horario y <em>hablamos</em>.
          </h1>
          <p className={s.lead}>
            No hay formulario que caiga en un buzón. Elegís vos el día y la
            hora en nuestra agenda, y del otro lado hay alguien que conoce el
            sistema.
          </p>
        </Reveal>
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
            <Btn href={EMPEZAR_URL}>Empezá gratis</Btn>
            <Btn href="/precios" variant="line">
              Ver precios
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
