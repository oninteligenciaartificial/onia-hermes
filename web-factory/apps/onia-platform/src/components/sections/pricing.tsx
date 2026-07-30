"use client";

import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { CountUp, PressableCta, Reveal, easeOutExpo, springs, viewportOnce } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { waLink } from "@/lib/site";
import {
  ADDONS,
  CONDICIONES,
  NOTA_FISCAL,
  NO_INCLUYE,
  RUBROS_PLANES,
  bs,
  precioAnual,
  precioMes,
  rubroPlanes,
  textoDudaPrecio,
  textoPlan,
  textoRubroEnConstruccion,
} from "@/lib/pricing";
import type { Ciclo, Plan, RubroPlanes } from "@/lib/pricing";
import styles from "./pricing.module.css";

/**
 * Seccion "Precios" — la estructura de compra.
 *
 * Decision tomada: los precios van VISIBLES. A este ticket, esconderlos genera
 * friccion, no deseo. Lo unico que no se publica es lo que todavia NO tiene
 * precio decidido, y eso se dice de frente en vez de inventarlo.
 *
 * Forma: una ESCALERA, no tres cards iguales. Cada plan arranca mas alto que
 * el anterior (offset vertical) y su medidor de nivel se llena mas — el salto
 * de valor (ordenar -> recuperar -> automatizar) es la forma de la seccion, no
 * una linea de texto. El recomendado manda por color y ancho, no por altura:
 * dos ejes distintos de jerarquia para que no se lea como grilla.
 */

export function Pricing() {
  const { rubro, setRubro } = useRubro();
  const [ciclo, setCiclo] = useState<Ciclo>("mensual");
  const actual = rubroPlanes(rubro);

  return (
    <section id="precios" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal>
          <p className="kicker">Precios</p>
          <h2 className="h2">El precio está acá. No hay que llamar para saberlo.</h2>
          <p className="lead">
            Una suscripción mensual por negocio, sin permanencia y sin letra
            chica. Lo que sube de nivel no es la cantidad de pantallas: es
            cuánto trabajo deja de ser tuyo.
          </p>
        </Reveal>

        <div className={styles.controls}>
          <fieldset className={styles.control}>
            <legend className={styles.legend}>Elegí tu rubro</legend>
            <div className={styles.chipRow}>
              {RUBROS_PLANES.map((r) => (
                <label
                  key={r.id}
                  className={`${styles.chip} ${r.id === rubro ? styles.chipOn : ""}`}
                >
                  <input
                    type="radio"
                    name="rubro-precios"
                    value={r.id}
                    checked={r.id === rubro}
                    onChange={() => setRubro(r.id)}
                    className={styles.srOnly}
                  />
                  <span className={styles.chipDot} aria-hidden />
                  {r.label}
                  {r.planes === null ? (
                    <span className={styles.chipSoon}>sin precio aún</span>
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.control}>
            <legend className={styles.legend}>Ciclo de pago</legend>
            <div className={styles.cicloRow}>
              <m.span
                className={styles.cicloPill}
                aria-hidden
                initial={false}
                animate={{ x: ciclo === "anual" ? "100%" : "0%" }}
                transition={springs.snappy}
              />
              {(["mensual", "anual"] as const).map((c) => (
                <label
                  key={c}
                  className={`${styles.cicloOpt} ${ciclo === c ? styles.cicloOn : ""}`}
                >
                  <input
                    type="radio"
                    name="ciclo"
                    value={c}
                    checked={ciclo === c}
                    onChange={() => setCiclo(c)}
                    className={styles.srOnly}
                  />
                  {c === "mensual" ? "Mensual" : "Anual"}
                  {c === "anual" ? (
                    <span className={styles.cicloSave}>2 meses gratis</span>
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={actual.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.gentle}
          >
            {actual.planes ? (
              <Escalera rubro={actual} planes={actual.planes} ciclo={ciclo} />
            ) : (
              <SinPrecio rubro={actual} />
            )}
          </m.div>
        </AnimatePresence>

        <Letra rubro={actual} />
      </div>
    </section>
  );
}

/* ---------- la escalera ---------- */

function Escalera({
  rubro,
  planes,
  ciclo,
}: {
  rubro: RubroPlanes;
  planes: readonly Plan[];
  ciclo: Ciclo;
}) {
  return (
    <>
      <div className={styles.escalera}>
        {planes.map((plan, i) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            rubro={rubro}
            ciclo={ciclo}
            nivel={(i + 1) / planes.length}
            hereda={i > 0 ? planes[i - 1].nombre : null}
            delay={i * 0.08}
          />
        ))}
      </div>
      <p className={styles.escaleraPie}>
        Básico ordena · Pro recupera lo que hoy se te escapa · Full opera sola.
        Los tres cobran, agendan y guardan la historia — la diferencia es cuánto
        hace el sistema sin vos.
      </p>
    </>
  );
}

function PlanCard({
  plan,
  rubro,
  ciclo,
  nivel,
  hereda,
  delay,
}: {
  plan: Plan;
  rubro: RubroPlanes;
  ciclo: Ciclo;
  nivel: number;
  hereda: string | null;
  delay: number;
}) {
  const href = waLink(textoPlan(rubro, plan, ciclo));
  return (
    <m.article
      className={`${styles.plan} ${plan.destacado ? styles.planTop : ""}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springs.gentle, delay }}
    >
      <header className={styles.planHead}>
        <span className={`mono ${styles.planPaso}`}>{plan.paso}</span>
        <span className={styles.planSalto}>{plan.salto}</span>
        {plan.destacado ? (
          <span className={`badge badge-on ${styles.planTag}`}>EL RECOMENDADO</span>
        ) : null}
      </header>

      {/* medidor de nivel: cuanto trabajo deja de ser tuyo */}
      <span className={styles.medidor} aria-hidden>
        <m.span
          className={styles.medidorFill}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: nivel }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: delay + 0.15 }}
        />
      </span>

      <h3 className={styles.planNombre}>{plan.nombre}</h3>
      <p className={styles.planResultado}>{plan.resultado}</p>

      <p className={styles.planPrecio}>
        <span className={`mono ${styles.planCifra}`}>
          <span className={styles.planMoneda}>Bs</span>
          <CountUp value={precioMes(plan, ciclo)} />
        </span>
        <span className={styles.planUnidad}>/mes</span>
      </p>
      <p className={styles.planPrecioNota}>
        {ciclo === "anual"
          ? `Bs ${bs(precioAnual(plan))} al año — 12 meses, pagás 10.`
          : `Precio de lanzamiento. La lista es Bs ${bs(plan.lista)}/mes.`}
      </p>

      <PressableCta className={styles.planCtaWrap}>
        <a href={href} className={plan.destacado ? "btn btn-wa" : "btn btn-ghost"}>
          {plan.destacado ? <span className="btn-dot" aria-hidden /> : null}
          Quiero el {plan.nombre}
        </a>
      </PressableCta>

      <p className={styles.planCuando}>{plan.cuando}</p>

      <p className={`mono ${styles.planHereda}`}>
        {hereda ? `Todo lo del ${hereda}, y además enciende:` : "Enciende:"}
      </p>
      <ul className={styles.planLista}>
        {plan.enciende.map((f) => (
          <li key={f} className={styles.planItem}>
            <span className={styles.planItemDot} aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <p className={`mono ${styles.planLimites}`}>
        {plan.usuarios} · {plan.soporte}
      </p>
    </m.article>
  );
}

/* ---------- rubro sin precio publicado ---------- */

function SinPrecio({ rubro }: { rubro: RubroPlanes }) {
  return (
    <div className={styles.sinPrecio}>
      <div>
        <span className="badge badge-soon">EN CONSTRUCCIÓN</span>
        <h3 className={styles.sinTitulo}>
          {rubro.label}: todavía no tiene precio publicado.
        </h3>
        <p className={styles.sinBody}>{rubro.nota}</p>
        <p className={styles.sinBody}>
          Podríamos inventar una cifra para llenar el cuadro. No lo hacemos: el
          precio de un rubro sale cuando el pack está listo para operarlo, no
          antes. Si tu negocio es de este rubro, hablemos igual — hay cosas que
          sí podemos hacer hoy.
        </p>
        <div className={styles.sinCtas}>
          <PressableCta>
            <a href={waLink(textoRubroEnConstruccion(rubro))} className="btn btn-wa">
              <span className="btn-dot" aria-hidden />
              Hablemos de mi caso
            </a>
          </PressableCta>
          <a href="/empezar" className="btn btn-ghost">
            Ver qué encenderíamos
          </a>
        </div>
      </div>
      <aside className={styles.sinHoy}>
        <p className={`mono ${styles.sinHoyTitulo}`}>Esto sí existe hoy</p>
        <ul className={styles.sinHoyLista}>
          <li>Web del negocio conectada al sistema</li>
          <li>Chatbot de WhatsApp</li>
          <li>Automatizaciones a medida</li>
        </ul>
        <p className={styles.sinHoyNota}>
          Se cotizan según tu caso — y si después sale el pack de tu rubro, lo
          que ya tenés no se tira.
        </p>
      </aside>
    </div>
  );
}

/* ---------- la letra que nadie escribe grande ---------- */

function Letra({ rubro }: { rubro: RubroPlanes }) {
  return (
    <div className={styles.letra}>
      <Reveal className={styles.fiscal}>
        <p className={`mono ${styles.bloqueTitulo}`}>Sobre la factura fiscal</p>
        <p className={styles.fiscalBody}>{NOTA_FISCAL}</p>
      </Reveal>

      <Reveal className={styles.bloque} delay={0.06}>
        <p className={`mono ${styles.bloqueTitulo}`}>Qué NO está en el precio</p>
        <ul className={styles.noLista}>
          {NO_INCLUYE.map((x) => (
            <li key={x.que} className={styles.noItem}>
              <strong className={styles.noQue}>{x.que}</strong>
              <span className={styles.noDetalle}>{x.detalle}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className={styles.bloque} delay={0.1}>
        <p className={`mono ${styles.bloqueTitulo}`}>Add-ons opcionales</p>
        <ul className={styles.addLista}>
          {ADDONS.map((a) => (
            <li key={a.nombre} className={styles.addItem}>
              <strong className={styles.addNombre}>{a.nombre}</strong>
              <span className={styles.addCopy}>{a.copy}</span>
              <span className={`mono ${styles.addPrecio}`}>{a.precio}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className={styles.bloque} delay={0.14}>
        <p className={`mono ${styles.bloqueTitulo}`}>Condiciones</p>
        <ul className={styles.condLista}>
          {CONDICIONES.map((c) => (
            <li key={c} className={styles.condItem}>
              {c}
            </li>
          ))}
        </ul>
        <p className={styles.condCierre}>
          ¿Algo no te cierra?{" "}
          <a href={waLink(textoDudaPrecio(rubro))}>Preguntá por WhatsApp</a> —
          preferimos la pregunta incómoda antes de que pagues, no después.
        </p>
      </Reveal>
    </div>
  );
}
