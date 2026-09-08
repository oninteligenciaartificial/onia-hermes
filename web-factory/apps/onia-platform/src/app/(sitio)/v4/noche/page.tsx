// Las dos variantes de «la noche», una debajo de la otra, para elegir.
//
// Existe porque comparar dos piezas de memoria no funciona: hay que verlas en
// la misma pantalla, con el mismo ancho y el mismo scroll. Cuando Sergio
// Urcullo elija, la que gana se queda en `/v4` y esta ruta se borra.
//
// Hereda el `noindex` de la rama: `/v4` entero está en el disallow de
// robots.ts, y esto cuelga de ahí.

import type { Metadata } from "next";

import { Block, Kicker } from "../../ui";
import s from "../../sitio.module.css";
import v from "../v4.module.css";

import { NocheFoto } from "../noche-foto";
import { NocheBurbujas } from "../noche-burbujas";

export const metadata: Metadata = {
  title: "Onia · la noche, dos variantes",
  robots: { index: false, follow: false },
};

export default function CompararNoche() {
  return (
    <>
      <Block surface="paperDim">
        <div className={v.centro}>
          <Kicker>Comparación interna</Kicker>
          <h1 className={s.h2}>La misma sección, dos maneras.</h1>
          <p className={v.heroLead}>
            Arriba, con la foto del dueño durmiendo. Abajo, sin foto: la mecánica de halos
            difusos de Hostinger, en la base clara de Onia. Las dos dicen lo mismo y
            respetan el mismo límite —{" "}
            <b>los agentes dejan el borrador, vos aprobás</b>.
          </p>
        </div>
      </Block>

      <Block surface="paperDim">
        <div className={v.centro}>
          <Kicker>Variante A</Kicker>
          <p className={v.heroLead}>Con foto. Es la que hoy está montada en /v4.</p>
        </div>
      </Block>
      <NocheFoto />

      <Block surface="paperDim">
        <div className={v.centro}>
          <Kicker>Variante B</Kicker>
          <p className={v.heroLead}>Sin foto, con burbujas. Todo dibujado, nada fotográfico.</p>
        </div>
      </Block>
      <NocheBurbujas />
    </>
  );
}
