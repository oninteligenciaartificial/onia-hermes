import { Reveal } from "@/motion";
import {
  PLANES,
  GRUPO,
  PRUEBA,
  ADDONS,
  NO_INCLUYE,
  CONDICIONES,
  NOTA_FISCAL,
  bs,
} from "@/lib/pricing";
import { WA_URL_LANDING } from "@/lib/site";
import { EMPEZAR_URL } from "../nav";
import { Block, Btn, Kicker } from "../ui";
import s from "../preview.module.css";

/**
 * Apartado de PRECIOS. Cada número sale de lib/pricing.ts (planes, add-ons, no
 * incluye, condiciones, nota fiscal). El add-on del chatbot ya no es excepción:
 * desde 2026-08-21 pricing.ts → ADDONS LEE su precio de
 * content/chatbot-precios.ts, así que esta pantalla, la landing y
 * /preview/chatbot muestran el mismo número sin que nadie lo copie a mano.
 */

export default function PreviewPrecios() {
  return (
    <>
      <Block surface="paper">
        <Reveal>
          <Kicker>Precios claros</Kicker>
          <h1 className={s.display}>
            Tres pasos. Sin implementación, sin <em>permanencia</em>.
          </h1>
          <p className={s.lead}>
            {PRUEBA.copy}
          </p>
        </Reveal>
      </Block>

      {/* Planes */}
      <Block surface="paperDim" labelledBy="planes">
        <h2 id="planes" className={s.h2} style={{ position: "absolute", left: "-9999px" }}>
          Planes
        </h2>
        <Reveal>
          <div className={s.plans}>
            {PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`${s.plan} ${plan.destacado ? s.planStar : ""}`}
              >
                <span className={s.planStep}>
                  {plan.paso} · {plan.salto}
                </span>
                <h3 className={s.planName}>{plan.nombre}</h3>
                <div className={s.planPrice}>
                  <span className={s.planNum}>{bs(plan.mensual)}</span>
                  <span className={s.planUnit}>Bs / mes</span>
                </div>
                <p className={`${s.mono} ${s.planUnit}`} style={{ marginTop: "0.2em" }}>
                  {bs(plan.anual)} Bs/año
                  {plan.semanal !== null ? ` · ${bs(plan.semanal)} Bs/sem` : ""}
                </p>
                <p className={s.planResult}>{plan.resultado}</p>
                <ul className={s.planList}>
                  {plan.incluye.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={s.note} style={{ marginTop: "1em" }}>
                  {plan.cuando}
                </p>
                <div className={s.planFoot}>
                  <Btn href={EMPEZAR_URL}>Probar {plan.nombre}</Btn>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Grupo / Empresarial */}
      <Block surface="ink" labelledBy="grupo">
        <Reveal>
          <Kicker>{GRUPO.nombre}</Kicker>
          <p id="grupo" className={s.h2} style={{ maxWidth: "22ch" }}>
            {bs(GRUPO.mensual)} Bs/mes, con implementación desde {bs(GRUPO.implementacionDesde)} Bs.
          </p>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {GRUPO.copy}
          </p>
          <div className={s.actions}>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Cotizar Grupo
            </Btn>
          </div>
        </Reveal>
      </Block>

      {/* Add-ons */}
      <Block surface="paper" labelledBy="addons">
        <Reveal>
          <Kicker>Add-ons</Kicker>
          <h2 id="addons" className={s.h2}>
            Lo que sumás cuando lo necesitás.
          </h2>
          <div className={s.rows}>
            {ADDONS.map((addon) => {
              const esChatbot = addon.nombre.includes("Chatbot");
              return (
                <div key={addon.nombre} className={s.row}>
                  <span className={s.rowName}>
                    {esChatbot ? (
                      <a className={s.link} href="/preview/chatbot">
                        {addon.nombre} →
                      </a>
                    ) : (
                      addon.nombre
                    )}
                  </span>
                  <p className={s.rowText}>{addon.copy}</p>
                  <span className={s.rowPrice}>{addon.precio}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Block>

      {/* No incluye */}
      <Block surface="paperDim" labelledBy="no-incluye">
        <Reveal>
          <Kicker>Lo que no incluye</Kicker>
          <h2 id="no-incluye" className={s.h2}>
            Los costos de terceros, de frente.
          </h2>
          <div className={s.rows}>
            {NO_INCLUYE.map((x) => (
              <div key={x.que} className={s.row}>
                <span className={s.rowName}>{x.que}</span>
                <p className={s.rowText}>{x.detalle}</p>
                <span />
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Condiciones */}
      <Block surface="paper" labelledBy="condiciones">
        <Reveal>
          <Kicker>Condiciones</Kicker>
          <h2 id="condiciones" className={s.h2}>
            Cómo se paga.
          </h2>
          <ul className={s.planList} style={{ marginTop: "2em", maxWidth: "52em" }}>
            {CONDICIONES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* Nota fiscal — honestidad de producto */}
      <Block surface="green" labelledBy="fiscal">
        <Reveal>
          <Kicker>Facturación fiscal</Kicker>
          <p id="fiscal" className={s.body} style={{ fontSize: "1.2em", maxWidth: "50em" }}>
            {NOTA_FISCAL}
          </p>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>Probá {PRUEBA.dias} días gratis</Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
