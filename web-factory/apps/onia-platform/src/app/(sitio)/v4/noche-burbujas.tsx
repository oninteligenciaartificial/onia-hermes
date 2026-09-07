// LA NOCHE, variante B — sin foto, con burbujas.
//
// Pedido de Sergio Urcullo (2026-09-07): «dame una opción más pero sin esa
// imagen, más estilo como el de la web, mirá la de Hostinger, jugá con las
// burbujas de fondo».
//
// Qué se tomó de Hostinger: los halos de luz difusos DETRÁS del contenido, que
// dan profundidad sin dibujar nada. Qué NO: su fondo púrpura oscuro. Acá los
// halos son verdes sobre la base clara de Onia, así que apenas se insinúan —
// es la misma mecánica con nuestra identidad, que es la regla que este sitio
// ya venía aplicando con el referente anterior.
//
// La composición cuenta lo mismo que la variante con foto, pero con formas: el
// reloj de las quince horas, y los tres momentos flotando como burbujas
// alrededor de la pantalla que los contesta.
//
// ⚠️ El verde va en FORMAS y el texto SIEMPRE oscuro encima. Texto blanco
// sobre el verde de Onia da 1.48:1 — está prohibido por el lenguaje visual
// aprobado el 21-ago, y una burbuja verde con texto claro es justo la forma
// más fácil de romperlo sin darse cuenta.

import { Reveal } from "@/motion";

import { Block, Kicker, PanelDibujado } from "../ui";
import s from "../sitio.module.css";
import v from "./v4.module.css";

/** Los mismos tres momentos de la variante con foto, sin cambiarles el sentido. */
const MOMENTOS = [
  { hora: "23:40", que: "Preguntan el precio. Contesta el asistente.", vos: null },
  { hora: "Domingo", que: "Reservan la cita solos, por tu agenda pública.", vos: null },
  {
    hora: "07:00",
    que: "Los recordatorios y los avisos de pago quedan escritos.",
    // El límite del producto: los agentes dejan el borrador en la cola. No
    // avisan, no mandan y no cobran solos.
    vos: "Vos los aprobás.",
  },
] as const;

export function NocheBurbujas() {
  return (
    <Block surface="paper" labelledBy="v4b-noche">
      <Reveal>
        <div className={v.centro}>
          <Kicker>18:00 → 09:00</Kicker>
          <h2 id="v4b-noche" className={s.h2}>
            Cerrás vos. El negocio no.
          </h2>
          <p className={v.heroLead}>
            Un negocio abre nueve horas. Las otras quince alguien pregunta, alguien quiere
            reservar y alguien se cansa de esperar. Ahí está el sistema.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className={v.cielo}>
          {/* Los halos. Decorativos y detrás de todo: el contenido no depende
              de ellos para leerse. */}
          <span className={`${v.halo} ${v.haloA}`} aria-hidden="true" />
          <span className={`${v.halo} ${v.haloB}`} aria-hidden="true" />
          <span className={`${v.halo} ${v.haloC}`} aria-hidden="true" />

          <div className={v.cieloGrid}>
            {/* La columna de la izquierda: las quince horas, dichas con una
                cifra grande en vez de una foto. */}
            <div className={v.burbujaHoras}>
              <p className={v.horasNum}>15</p>
              <p className={v.horasTxt}>
                horas cerrado, todos los días.
                <br />
                También domingo.
              </p>
            </div>

            {/* El centro: la pantalla que contesta. Es el panel DIBUJADO, no
                una captura del sistema. */}
            <div className={v.cieloPanel}>
              <PanelDibujado panel="chat" />
            </div>

            {/* Los momentos, cada uno en su burbuja. */}
            <ul className={v.burbujas}>
              {MOMENTOS.map((m) => (
                <li className={v.burbuja} key={m.hora}>
                  <span className={v.burbujaHora}>{m.hora}</span>
                  <span className={v.burbujaQue}>
                    {m.que}
                    {m.vos ? (
                      <>
                        {" "}
                        <span className={v.momentoVos}>{m.vos}</span>
                      </>
                    ) : null}
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
