import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { EMPEZAR_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Btn, Kicker } from "../ui";
import { Switcher } from "../switcher";
import { CUANTOS_RUBROS_CAPITAL } from "@/content/rubros";
import s from "../sitio.module.css";

export const metadata: Metadata = {
  title: "Un sistema por rubro — dental, comercio, importadora y más | Onia",
  description:
    "Elegís tu rubro y la cuenta viene armada con sus pantallas y su vocabulario: pacientes y odontograma en dental, productos y fiados en comercio, lotes y costos en importadora. El mismo núcleo, hecho para Bolivia.",
  alternates: { canonical: "/rubros" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Elegís tu rubro y la cuenta ya viene armada",
    description:
      "No es un software distinto por industria: es el mismo núcleo con módulos y vocabulario propios de tu negocio.",
    url: "/rubros",
  },
};

/**
 * Apartado de RUBROS. Un producto, muchos rubros — el conmutador es la estrella.
 * Cinco rubros vivos y vendibles hoy; el vocabulario por rubro es lo que cada
 * negocio ve en la misma base (no son productos distintos). Ningún rubro
 * linkea afuera: la vieja /modulos/dental ya no existe como página — redirige
 * acá (308 en next.config.ts) porque mandar al visitante a otro cromo sin
 * retorno era la fuga del embudo. Cero "muy pronto" (regla: la venta nunca
 * exhibe obra).
 */

/**
 * Los cinco rubros PUBLICADOS. No se agrega ninguno acá: la lista es la misma
 * que el conmutador (RUBROS en switcher.tsx) y la misma que dice la portada
 * ("cinco rubros vivos y vendibles hoy").
 *
 * `resultado` es lo que el negocio GANA; `ve` es lo que el sistema le pone
 * delante. El resultado va primero porque un sustantivo no vende: cinco
 * renglones de features seguidos se leen como un índice, no como una razón.
 * Cada resultado sale de la pantalla real que ese rubro ya muestra en el
 * conmutador — la fuente va anotada rubro por rubro.
 *
 * `foto` es una imagen de CONTEXTO: la persona en su negocio, sin ninguna
 * pantalla legible. Arriba, en el conmutador, tampoco hay captura: es el panel
 * DIBUJADO de cada rubro (ui.tsx). Reglas y gate:
 * hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md
 */
const RUBROS: readonly {
  id: string;
  nombre: string;
  resultado: string;
  ve: string;
  alt: string;
  w: number;
  h: number;
}[] = [
  {
    // panel "dental" (ui.tsx) — agenda del día con hora y tratamiento.
    id: "dental",
    nombre: "Dental",
    resultado:
      "Llegás a la mañana sabiendo quién viene, a qué hora y a qué teléfono llamar si no aparece.",
    ve: "Pacientes, tratamientos, odontograma y agenda por profesional.",
    alt: "Recepcionista de un consultorio dental con el celular en una mano y el dedo siguiendo un renglón del cuaderno de citas abierto.",
    w: 1280,
    h: 960,
  },
  {
    // panel "comercio" (ui.tsx) — la caja cortada por método de pago.
    id: "comercio",
    nombre: "Comercio",
    resultado:
      "Cerrás el día con la caja cuadrada y sabiendo quién te quedó debiendo.",
    ve: "Productos, stock, ventas y fiados.",
    alt: "Dueño de una ferretería detrás del mostrador, con el cuaderno de fiados abierto y una tablet apoyada boca abajo al lado.",
    w: 1280,
    h: 960,
  },
  {
    // panel "importadora" (ui.tsx) — cotizaciones con su estado.
    id: "importadora",
    nombre: "Importadora",
    resultado:
      "Sabés cuánto te costó cada lote puesto en depósito y qué cotización sigue viva.",
    ve: "Depósito, lotes y costeo de importación con alerta de reprecio.",
    alt: "Dueño de una importadora junto al rack del depósito, con una guía impresa en la mano y una laptop cerrada apoyada sobre una caja.",
    w: 1280,
    h: 874,
  },
  {
    // panel "estetica" (ui.tsx) — el tratamiento a medias y el control en
    // agenda. Las palabras salen del vocabulario del PRODUCTO para este track
    // (`lib/onboarding/vocabulario.ts`: clientas, tratamientos), no de otra
    // pantalla de este sitio.
    id: "estetica",
    nombre: "Estética",
    resultado:
      "La clienta que dejó el tratamiento a medias no se pierde: te queda el mensaje escrito con tu link para que vuelva a reservar, y vos lo aprobás.",
    ve: "Clientas, tratamientos, agenda y recordatorios.",
    alt: "Dueña de un centro de estética junto a la camilla vacía con papel nuevo puesto, con el celular en la mano.",
    w: 1280,
    h: 960,
  },
  {
    // panel "servicios" (ui.tsx) — el IVA y el IT del mes, y el reporte por revisar.
    id: "servicios",
    nombre: "Servicios",
    resultado:
      "Con lo que cobrás en Onia, llegás al cierre de mes con el IVA y el IT ya armados, en vez de juntando papeles.",
    ve: "Clientes, agenda, servicios y cobros.",
    alt: "Contadora trabajando de noche en su escritorio, con un archivador de palanca abierto, una calculadora y una lámpara encendida.",
    w: 1280,
    h: 1078,
  },
];

export default function Rubros() {
  return (
    <>
      <Block surface="paper">
        <Reveal>
          <Kicker>Un solo sistema</Kicker>
          <h1 className={s.display}>
            Elegís tu rubro y la cuenta ya viene <em>armada</em>.
          </h1>
          <p className={s.lead}>
            No es un software distinto por industria: es el mismo núcleo con
            módulos y vocabulario propios de tu negocio.
          </p>
        </Reveal>
        <Switcher />
      </Block>

      {/* Qué ve cada rubro */}
      <Block surface="paperDim" labelledBy="que-ve">
        <Reveal>
          <Kicker>Vocabulario por rubro</Kicker>
          <h2 id="que-ve" className={s.h2}>
            La misma base, con las palabras de tu negocio.
          </h2>
          <div className={s.cells}>
            {RUBROS.map((r) => (
              <div key={r.id} className={`${s.cell} ${s.cellFoto}`}>
                <h3 className={s.h3}>{r.nombre}</h3>
                <div className={s.cellTexto}>
                  <p className={s.rubroResultado}>{r.resultado}</p>
                  <p>{r.ve}</p>
                </div>
                <div className={s.foto}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS */}
                  <img
                    src={`/contexto/${r.id}.webp`}
                    alt={r.alt}
                    width={r.w}
                    height={r.h}
                    loading="lazy"
                    decoding="async"
                    className={s.fotoImg}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className={s.note} style={{ marginTop: "2em" }}>
            {CUANTOS_RUBROS_CAPITAL} rubros vivos y vendibles hoy. ¿El tuyo es
            otro? Escribinos y lo vemos con tu caso.
          </p>
        </Reveal>
      </Block>

      {/* Cierre */}
      <Block surface="green" labelledBy="cierre-rubros">
        <Reveal>
          <h2 id="cierre-rubros" className={s.display} style={{ maxWidth: "16ch" }}>
            Armá tu cuenta con tu rubro.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
