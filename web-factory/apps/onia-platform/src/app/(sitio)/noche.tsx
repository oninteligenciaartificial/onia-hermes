// LA NOCHE, variante A — con la foto del dueno durmiendo.
//
// Vive en su propio archivo desde que existe la variante B (burbujas): asi las
// dos se pueden poner una al lado de la otra en /v4/noche para elegir, sin que
// ninguna sea "la del medio de page.tsx" y la otra la alternativa.

import { Reveal } from "@/motion";

import { Block, Kicker, PanelDibujado } from "./ui";
import s from "./sitio.module.css";
import v from "./portada.module.css";

/**
 * Lo que pasa mientras el negocio esta cerrado. Son los tres momentos que la
 * home ya tiene aprobados, sin cambiarles el sentido.
 *
 * ⚠️ El tercero NO se toca: los agentes dejan el borrador en la cola de
 * aprobacion — no avisan, no mandan y no cobran solos (onia-core/contract.json
 * · app/api/cron/onia-agents, "SIN ningun envio externo"). La home avisa que
 * tres disenadores se equivocaron en esto antes.
 */
const MOMENTOS_NOCHE = [
  { hora: "23:40", que: "Preguntan el precio. Contesta el asistente.", vos: null },
  { hora: "Domingo", que: "Reservan la cita solos, por tu agenda pública.", vos: null },
  {
    hora: "07:00",
    que: "Los recordatorios y los avisos de pago quedan escritos.",
    vos: "Vos los aprobás.",
  },
] as const;

export function NocheFoto() {
  return (
      <Block surface="paper" labelledBy="v4-noche">
        <Reveal>
          <div className={v.centro}>
            <Kicker>18:00 → 09:00</Kicker>
            <h2 id="v4-noche" className={s.h2}>
              Cerrás vos. El negocio no.
            </h2>
            <p className={v.heroLead}>
              Un negocio abre nueve horas. Las otras quince alguien pregunta, alguien
              quiere reservar y alguien se cansa de esperar. Ahí está el sistema.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={v.noche}>
            <figure className={v.nocheFoto}>
              {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS */}
              <img
                src="/fotos/dueno-duerme.webp"
                alt="El dueño de un negocio durmiendo de noche, con la luz de una lámpara encendida."
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
              />
              <figcaption className={v.nocheRotulo}>
                <p className={v.nocheHora}>02:14 · cerrado</p>
                <p className={v.nocheFrase}>Vos dormís.</p>
              </figcaption>
            </figure>

            <div className={v.nocheLado}>
              <div className={v.capacidadArte}>
                <PanelDibujado panel="chat" />
              </div>
              <ul className={v.momentos}>
                {MOMENTOS_NOCHE.map((m) => (
                  <li key={m.hora}>
                    <span className={v.momentoHora}>{m.hora}</span>
                    <span className={v.momentoQue}>
                      {m.que}
                      {m.vos ? <> <span className={v.momentoVos}>{m.vos}</span></> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Block>
  );
}
