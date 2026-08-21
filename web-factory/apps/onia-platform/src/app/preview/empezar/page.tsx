import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import { REGISTRO_URL } from "../nav";
import { Block, Shape, Btn, Kicker } from "../ui";
import s from "../preview.module.css";

/**
 * /preview/empezar — la pantalla de ARRANQUE del preview.
 *
 * Por qué existe: los once CTA del preview apuntaban a `/prueba-gratis`, que es
 * la web VIEJA — otro header, otro pie, cero retorno. El visitante hacía clic
 * en el botón principal y se iba del sitio nuevo. Ahora el embudo termina
 * adentro: esta página vive bajo el layout del preview, así que hereda su
 * cromo sin portar una línea, y el ÚNICO salto hacia afuera es el que tiene
 * que serlo — el registro real del producto (app.onia.com.bo/register).
 *
 * Los tres pasos son el texto ya escrito y publicado en /prueba-gratis; no se
 * redactó nada nuevo. Lo que NO se trae es la lista de rubros de esa página:
 * enumera seis (con Veterinaria) y el registro entrega cinco. Acá el dato es
 * crítico — es la pantalla anterior al clic — así que no se enumera ninguno:
 * el rubro se elige en la primera pantalla del registro, que es la verdad.
 * (Hueco abierto, decisión de Sergio: seis vendidos vs cinco entregados.)
 */

export const metadata: Metadata = {
  title: "Empezá — preview del rediseño",
};

/** Copiado tal cual de app/prueba-gratis/page.tsx (PASOS). */
const PASOS: readonly { titulo: string; detalle: string }[] = [
  {
    titulo: "Elegí tu rubro",
    detalle:
      "Onia se arma para el tuyo: pantallas, vocabulario y agentes a tu medida. El rubro se elige en la primera pantalla del registro.",
  },
  {
    titulo: "Tu cuenta queda lista",
    detalle:
      "Sin instalación ni proyecto de meses. Le das el nombre de tu negocio y el sistema busca y carga tus datos.",
  },
  {
    titulo: `Usalo de verdad ${PRUEBA.dias} días`,
    detalle:
      "Todo encendido: agenda, caja, inventario, contabilidad y la cola de agentes. Si te sirve, pagás por QR; si no, no pagás nada.",
  },
];

export default function PreviewEmpezar() {
  return (
    <>
      <Block surface="paper">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Empezá</Kicker>
              <h1 className={s.display}>
                Creá tu cuenta y usala <em>de verdad</em> {PRUEBA.dias} días.
              </h1>
              <p className={s.lead}>
                No es una demo recortada: es tu cuenta real, con todos los
                módulos encendidos. Si al final no te sirve, no pagás nada — y
                tus datos los exportás cuando quieras.
              </p>
              <div className={s.actions}>
                <Btn href={REGISTRO_URL}>Crear mi cuenta gratis</Btn>
                <Btn href="/preview/contacto" variant="line">
                  Prefiero hablar antes
                </Btn>
              </div>
              <p className={s.note} style={{ marginTop: "1.2em" }}>
                Sin tarjeta · sin implementación · tus datos se exportan en CSV
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape tone="green" ratio="4 / 3" tag="Tu cuenta" />
          </Reveal>
        </div>
      </Block>

      {/* Los tres pasos */}
      <Block surface="paperDim" labelledBy="camino">
        <Reveal>
          <Kicker>El camino</Kicker>
          <h2 id="camino" className={s.h2}>
            Tres pasos, y el tercero ya es tu negocio adentro.
          </h2>
          <div className={s.cells}>
            {PASOS.map((paso, i) => (
              <div key={paso.titulo} className={s.cell}>
                <h3 className={s.h3}>
                  <span className={s.mono} style={{ opacity: 0.55 }}>
                    0{i + 1}
                  </span>{" "}
                  {paso.titulo}
                </h3>
                <p>{paso.detalle}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Qué pasa al día 15 — la letra chica, dicha fuerte */}
      <Block surface="ink" labelledBy="al-final">
        <Reveal>
          <Kicker>Cuando se termina</Kicker>
          <p id="al-final" className={s.h2} style={{ maxWidth: "24ch" }}>
            Al vencer, la cuenta queda en solo lectura. No se borra nada.
          </p>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {PRUEBA.copy}
          </p>
          <div className={s.actions}>
            <a className={s.link} href="/preview/precios">
              Ver los precios antes de entrar →
            </a>
          </div>
        </Reveal>
      </Block>

      {/* Cierre */}
      <Block surface="signal" labelledBy="cierre-empezar">
        <Reveal>
          <h2 id="cierre-empezar" className={s.display} style={{ maxWidth: "16ch" }}>
            Creá tu cuenta. Sin tarjeta.
          </h2>
          <div className={s.actions}>
            <Btn href={REGISTRO_URL}>Crear mi cuenta gratis</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Hablar por WhatsApp
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
