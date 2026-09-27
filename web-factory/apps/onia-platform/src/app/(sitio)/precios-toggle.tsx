"use client";

// Precios CON el interruptor mensual/anual, dentro de la landing.
//
// Es lo que la referencia (Fincash) hace bien y nosotros no: el precio vive en
// el camino de lectura, no en otra pagina, y el ahorro del anual se ve sin
// tener que calcularlo.
//
// El ahorro NO se escribe a mano: sale de PLANES (mensual y anual son datos de
// `lib/pricing.ts`, la fuente unica). Si manana cambia el precio anual, el
// porcentaje de esta pantalla cambia solo. Un "-20%" hardcodeado seria una
// cuarta lista de precios, que es justo el problema que la regla de la casa
// existe para evitar.

import { useState } from "react";

import { PLANES, bs, resultadoSegunCiclo } from "@/lib/pricing";

import { Btn } from "./ui";
import { ctaAltaPlan } from "./alta";
import { EMPEZAR_URL } from "./nav";
import s from "./sitio.module.css";
import v from "./portada.module.css";

/** Cuanto se ahorra pagando el año entero, en %, redondeado hacia abajo. */
function ahorroAnual(mensual: number, anual: number): number {
  return Math.floor((1 - anual / (mensual * 12)) * 100);
}

export function PreciosConCiclo() {
  const [anual, setAnual] = useState(false);

  // El descuento que se anuncia es el MENOR de los planes, no el mayor: si un
  // plan ahorra 17 % y otro 20 %, prometer 20 % deja a alguien sintiendose
  // enganado al llegar a su fila.
  const ahorroMinimo = Math.min(...PLANES.map((p) => ahorroAnual(p.mensual, p.anual)));

  return (
    <>
      <div className={v.ciclo}>
        <button
          type="button"
          className={`${v.cicloBtn} ${!anual ? v.cicloOn : ""}`}
          onClick={() => setAnual(false)}
          aria-pressed={!anual}
        >
          Mensual
        </button>
        <button
          type="button"
          className={`${v.cicloBtn} ${anual ? v.cicloOn : ""}`}
          onClick={() => setAnual(true)}
          aria-pressed={anual}
        >
          Anual
          <span className={v.cicloTag}>−{ahorroMinimo} %</span>
        </button>
      </div>

      <div className={s.plans}>
        {PLANES.map((plan) => {
          const precio = anual ? plan.anual : plan.mensual;
          return (
            <div key={plan.id} className={`${s.plan} ${plan.destacado ? s.planStar : ""}`}>
              <span className={s.planStep}>
                {plan.paso} · {plan.salto}
              </span>
              <h3 className={s.planName}>{plan.nombre}</h3>
              <div className={s.planPrice}>
                <span className={s.planNum}>{bs(precio)}</span>
                <span className={s.planUnit}>Bs / {anual ? "año" : "mes"}</span>
              </div>
              {/* Al ver el precio anual, lo primero que uno hace es dividir por
                  doce. Se lo damos hecho, en chico y debajo. */}
              <p className={v.planEquivale}>
                {anual
                  ? `Equivale a Bs ${bs(Math.round(plan.anual / 12))} por mes`
                  : `Bs ${bs(plan.anual)} pagando el año — ahorrás ${ahorroAnual(plan.mensual, plan.anual)} %`}
              </p>
              {/* La cuenta «este plan trae el chatbot adentro» va en el ciclo QUE SE ESTÁ
                  MOSTRANDO. Con el interruptor en Anual esta línea decía «Bs 10 más al mes»
                  —la cuenta del mensual— debajo de un precio anual, y en anual son Bs 100 más
                  al año: el lead que restaba con los números de la propia tarjeta (1.075 contra
                  742 + 325) obtenía 8 y leía 10. */}
              <p className={s.planResult}>
                {resultadoSegunCiclo(plan, anual ? "anual" : "mensual")}
              </p>
              <ul className={s.planList}>
                {plan.incluye.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={s.planFoot}>
                <Btn href={EMPEZAR_URL}>{ctaAltaPlan(plan.nombre)}</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
