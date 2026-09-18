// LA NOCHE, variante A — con la foto del dueno durmiendo.
//
// Vive en su propio archivo porque la portada la COMPONE en vez de escribirla
// adentro: `page.tsx` la monta como <NocheFoto /> y es la que ve el cliente
// en `/`.
//
// ⚠️ Hasta el 2026-09-08 estas lineas decian que existia una variante B
// (burbujas) y que las dos se comparaban "una al lado de la otra en
// /v4/noche". Las dos mitades son falsas: la variante B no esta en el arbol,
// y `/v4` —la exploracion de portada del 07-sep— se borro ese mismo dia,
// cuando Sergio Urcullo dijo "reemplaza la home con la v4" (2c3ce027). La
// CITA sobrevivio a la ruta, otra sesion le creyo, y le ofrecio a Sergio
// Urcullo abrir esa pantalla para elegir entre dos portadas: da 404, asi que
// la decision quedo trabada por un comentario (tarea t_8e566d50).
// Lo cuida ahora `src/app/ruta-citada.test.ts`.

import { Reveal } from "@/motion";

import { Block, Kicker, PanelDibujado } from "./ui";
import s from "./sitio.module.css";
import v from "./portada.module.css";

/**
 * ⚠️ Esta seccion NO lleva la lista de los tres momentos (23:40 · Domingo ·
 * 07:00). Los tenia, COPIADOS de la home — el comentario viejo de este archivo
 * lo decia con todas las letras: "son los tres momentos que la home ya tiene
 * aprobados". El problema es que la home TAMBIEN los muestra, mil pixeles mas
 * arriba, en la linea del dia (`page.tsx` → MOMENTOS): mirada renderizada el
 * 2026-09-18, la portada se los decia al lead DOS VECES, palabra por palabra,
 * en las dos primeras secciones despues del hero.
 *
 * Nadie lo decidio: las dos piezas se aprobaron por separado (la noche con la
 * v4 el 07-sep, la linea del dia el 11-sep). Aprobar dos piezas nunca es
 * aprobar su suma. Quitada la lista, la seccion queda con lo que si es suyo
 * —la foto y la conversacion de las 23:40— y la foto y la tarjeta siguen
 * parejas (medido: 1.066 px → 877 px, las dos columnas alineadas).
 *
 * Lo cuida `no-decir-dos-veces-lo-mismo.test.ts`, que camina el grafo de la
 * portada y se pone rojo si una oracion vuelve a vivir en dos archivos.
 */
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
                srcSet="/fotos/dueno-duerme-480.webp 480w, /fotos/dueno-duerme-960.webp 960w, /fotos/dueno-duerme.webp 1600w"
                sizes="(min-width: 1024px) 501px, (min-width: 560px) 85vw, 75vw"
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
            </div>
          </div>
        </Reveal>
      </Block>
  );
}
