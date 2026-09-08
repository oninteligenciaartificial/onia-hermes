// EXPLORACION de la home con la estructura de «Fincash» (21st.dev), pedida por
// Sergio Urcullo el 2026-09-07: «tomá de referencia esta landing pero con
// nuestros colores, datos y alma».
//
// NO reemplaza a `/`. Vive aparte y con `noindex` para poder MIRARLA terminada
// antes de decidir — que es el paso que faltó el 2026-08-20, cuando se publicó
// una v2 sin mostrarla, la rechazó entera y hubo que revertir en producción.
//
// Las cuatro decisiones que la gobiernan, ya tomadas por él:
//  1. BASE CLARA. La referencia es dark; nuestro lenguaje visual aprobado el
//     1-sep es claro y gana. Se porta la ESTRUCTURA, no el look.
//  2. Sus «Our Journey in Numbers» y sus testimonios con foto NO se traducen:
//     con cero clientes pagando serían inventados. En su lugar va lo que el
//     sistema HACE, que el visitante puede ir y comprobar.
//  3. Ruta nueva, se mira, después se publica.
//  4. Va ahora, antes de anunciar la 1.0.
//
// Lo que SÍ se porta de la referencia, que es donde de verdad gana:
//  · hero centrado con el título como protagonista y una palabra en el acento
//  · el precio EN la landing, con interruptor mensual/anual y un plan destacado
//  · features como tarjetas grandes de una sola idea, con su dibujo
//  · un CTA único repetido arriba, al medio y al cierre
//
// CERO cifras a mano: precios de `lib/pricing.ts`, chatbot de
// `content/chatbot-precios.ts`. Las capacidades que se listan salen de
// `PLANES[].incluye`, que ya es texto curado y verificable abriendo el producto.

import type { Metadata } from "next";

import { Reveal } from "@/motion";
import { PLANES, PRUEBA, bs } from "@/lib/pricing";
import { CHATBOT_PLAN } from "@/content/chatbot-precios";
import { WA_URL_LANDING } from "@/lib/site";

import { ALTA_VERBO_VOS, CTA_ALTA } from "../alta";
import { EMPEZAR_URL } from "../nav";
import { Block, Btn, Kicker, PanelDibujado } from "../ui";
import { Switcher } from "../switcher";
import s from "../sitio.module.css";

import { FAQ } from "../faq-datos";
import { NocheFoto } from "./noche-foto";
import { PreciosConCiclo } from "./precios-toggle";
import v from "./v4.module.css";

export const metadata: Metadata = {
  title: "Onia · exploración de portada",
  // Es una exploración interna: no puede competir con `/` en Google ni
  // aparecerle a nadie que busque Onia.
  robots: { index: false, follow: false },
};

/** Lo que el sistema hace hoy. Cada línea se puede comprobar entrando. */
const HECHOS = [
  {
    que: "Agenda, fichas, caja y cobros",
    como: "En una sola pantalla, no en cuatro programas que no se hablan.",
  },
  {
    que: "Inventario que avisa",
    como: "Existencias, costo y proveedor, con aviso cuando algo baja del mínimo.",
  },
  {
    que: "Contesta tu WhatsApp",
    como: CHATBOT_PLAN.resuelve,
  },
  {
    que: "Tus datos son tuyos",
    como: "Los exportás en CSV cuando quieras. Sin permanencia y sin pedir permiso.",
  },
] as const;

/** Las tres capacidades con peso de producto, cada una con su panel dibujado. */
const CAPACIDADES = [
  {
    panel: "cuenta" as const,
    nombre: "El día entero, en una pantalla",
    texto:
      "Lo que entró, lo que falta cobrar y lo que viene después. No hay que abrir un reporte para saber cómo va el negocio: es lo primero que ves al entrar.",
  },
  {
    panel: "chat" as const,
    nombre: "Los mensajes no se pierden",
    texto:
      "Lo que llega por WhatsApp entra al mismo lugar que el resto. El que atiende ve la ficha del cliente mientras le contesta, sin cambiar de app.",
  },
  {
    panel: "agentes" as const,
    nombre: "Trabajan de noche, no deciden solos",
    texto:
      "Los agentes preparan el mensaje, detectan al cliente que no volvió y arman el seguimiento. Vos aprobás. Nada sale sin que lo mires.",
  },
] as const;

export default function ExploracionPortada() {
  const desde = Math.min(...PLANES.map((p) => p.mensual));

  return (
    <>
      {/* ── 1 · HERO CENTRADO ────────────────────────────────────────────
          La referencia hace que el título SEA la página hasta que scrolleás.
          El texto es el aprobado el 1-sep; lo que cambia es la composición:
          de dos columnas a centrado, con «una» en el acento. */}
      <Block surface="green" className={v.heroVerde}>
        {/* Los halos de Hostinger. Van acá y no en el CSS del Block porque son
            de ESTA pieza: el resto del sitio sigue siendo papel. */}
        <span className={`${v.halo} ${v.haloA}`} aria-hidden="true" />
        <span className={`${v.halo} ${v.haloB}`} aria-hidden="true" />
        <Reveal>
          <div className={v.centro}>
            <Kicker>Un solo sistema para todo el negocio</Kicker>
            <h1 className={v.heroTitulo}>
              Todo el negocio, en <em>una</em> pantalla.
            </h1>
            <p className={v.heroLead}>
              Onia es el sistema con el que llevás tu negocio: agenda, clientes, caja,
              inventario y cobros, con agentes que trabajan de noche y te dejan las
              decisiones a vos.
            </p>
            <div className={v.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href={WA_URL_LANDING} variant="line" external>
                Preguntar por WhatsApp
              </Btn>
            </div>
            <p className={v.heroNota}>
              {PRUEBA.dias} días de prueba con el plan {PRUEBA.planQueCorre}, sin tarjeta.
              Después, desde Bs {bs(desde)} al mes.
            </p>

            {/* La escena que la referencia arma con mockups de su app. Acá va
                el panel DIBUJADO — nunca una captura del sistema. */}
            <div className={v.escena}>
              <div className={v.escenaPanel}>
                <PanelDibujado panel="cuenta" />
              </div>
              <span className={`${v.nodo} ${v.nodoA}`} aria-hidden="true">
                ✓
              </span>
              <span className={`${v.nodo} ${v.nodoB}`} aria-hidden="true">
                Bs
              </span>
              <span className={`${v.nodo} ${v.nodoC}`} aria-hidden="true">
                ◷
              </span>
            </div>
          </div>
        </Reveal>
      </Block>

      {/* ── 2 · LO QUE HACE (reemplaza «Our Journey in Numbers») ─────────
          Fincash llena esta franja con métricas de tracción. Nosotros no
          tenemos clientes pagando, así que no hay número honesto que poner:
          va lo que el sistema hace, que se comprueba entrando. */}
      <Block surface="paperDim" labelledBy="v4-hace">
        <Reveal>
          <div className={v.centro}>
            <Kicker>Lo que hace, hoy</Kicker>
            <h2 id="v4-hace" className={s.h2}>
              No es una promesa: es lo que vas a encontrar adentro.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={v.hechos}>
            {HECHOS.map((h) => (
              <div className={v.hecho} key={h.que}>
                <p className={v.hechoQue}>{h.que}</p>
                <p className={v.hechoComo}>{h.como}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* ── 3 · LA NOCHE (variante A, con foto) ── ver /v4/noche */}
      <NocheFoto />

      {/* ── 4 · CAPACIDADES EN TARJETAS GRANDES ──────────────────────────
          El patrón de features de la referencia: una idea por tarjeta, con su
          dibujo arriba, en vez de una lista de bullets. */}
      <Block surface="paper" labelledBy="v4-capacidades">
        <Reveal>
          <div className={v.centro}>
            <Kicker>Adentro</Kicker>
            <h2 id="v4-capacidades" className={s.h2}>
              Tres cosas que vas a usar todos los días.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={v.capacidades}>
            {CAPACIDADES.map((c) => (
              <article className={v.capacidad} key={c.panel}>
                <div className={v.capacidadArte}>
                  <PanelDibujado panel={c.panel} />
                </div>
                <h3 className={v.capacidadNombre}>{c.nombre}</h3>
                <p className={v.capacidadTexto}>{c.texto}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* ── 5 · RUBROS ───────────────────────────────────────────────────
          Esto NO está en la referencia y es lo que más nos separa de ella:
          el mismo núcleo cambia de vocabulario según el rubro. Se queda. */}
      <Block surface="paperDim" labelledBy="v4-rubros">
        <Reveal>
          <div className={v.centro}>
            <Kicker>Un solo sistema</Kicker>
            <h2 id="v4-rubros" className={s.h2}>
              Elegís tu rubro y la cuenta ya viene armada.
            </h2>
            <p className={v.heroLead}>
              No es un software distinto por industria: es el mismo núcleo con módulos y
              vocabulario propios. Un dentista ve pacientes; una ferretería ve productos y
              fiados.
            </p>
          </div>
        </Reveal>
        <Switcher />
      </Block>

      {/* ── 6 · PRECIOS EN LA LANDING ────────────────────────────────────
          Lo mejor que tiene la referencia y que nosotros mandábamos a otra
          página: el precio en el camino de lectura, con el ahorro anual a la
          vista y un plan destacado. */}
      <Block surface="paper" labelledBy="v4-precios">
        <Reveal>
          <div className={v.centro}>
            <Kicker>Precios claros</Kicker>
            <h2 id="v4-precios" className={s.h2}>
              Tres pasos. Sin implementación, sin permanencia.
            </h2>
            <p className={v.heroLead}>{PRUEBA.copy}</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={v.centro}>
            <PreciosConCiclo />
          </div>
        </Reveal>
      </Block>

      {/* ── 7 · FAQ ──────────────────────────────────────────────────────
          Las mismas ocho preguntas de la home, leidas de `faq-datos.ts`: son
          las que frenan la compra y cada respuesta cita su fuente en el repo.
          No se reescriben acá — una segunda lista con cifras se desincroniza
          en la primera edicion. */}
      <Block surface="paperDim" labelledBy="v4-faq">
        <Reveal>
          <div className={v.centro}>
            <Kicker>Antes de empezar</Kicker>
            <h2 id="v4-faq" className={s.h2}>
              Lo que preguntan antes de empezar.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={s.faq}>
            {FAQ.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary className={s.faqQ}>{item.q}</summary>
                <p className={s.faqA}>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* ── 8 · CIERRE ───────────────────────────────────────────────────
          El mismo CTA del hero, tercera y última vez. */}
      <Block surface="ink" labelledBy="v4-cierre">
        <Reveal>
          <div className={v.centro}>
            <h2 id="v4-cierre" className={s.display} style={{ maxWidth: "18ch" }}>
              {ALTA_VERBO_VOS} hoy y probalo con tu propio negocio.
            </h2>
            <div className={v.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href={WA_URL_LANDING} variant="line" external>
                Preguntar por WhatsApp
              </Btn>
            </div>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
