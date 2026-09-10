"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CTA_ALTA } from "./(sitio)/alta";
import { EMPEZAR_URL } from "./(sitio)/nav";

/**
 * Camino de FALLO del sitio de venta — la pantalla que ve un lead cuando algo
 * revienta en runtime.
 *
 * Sin este archivo, Next sirve su propia pantalla: «Application error: a
 * client-side exception has occurred (see the browser console for more
 * information)» — en ingles, con jerga tecnica, sin marca y sin salida. Es
 * EXACTAMENTE el defecto que `not-found.tsx` dice haber arreglado para el 404
 * («antes esta ruta caia en la pantalla por defecto de Next»): se arreglo esa
 * instancia y la hermana quedo abierta, con 25 rutas y 15 componentes cliente
 * detras.
 *
 * Por que ningun gate del sitio podia verlo: todos —`obra`, `indexar`,
 * `compartir`, `alcance`, `precios`— derivan sus sujetos de los `page.tsx` del
 * disco, y esto no es una pagina. No sobra ni falta una palabra, no hay precio
 * ni enlace roto, y cuando el sitio anda no se ve nunca. Lo cubre
 * `camino-de-fallo.test.ts`, que deriva del disco y exige que toda ruta tenga
 * un boundary ancestro.
 *
 * Reglas del copy, iguales que en el 404:
 *  - **No se exhibe obra.** «Estamos arreglando esto», «volve mas tarde» o
 *    «en mantenimiento» le dicen al lead que el producto no esta listo. Un
 *    error puntual se maneja, no se convierte en un cartel de estado.
 *  - **Cero jerga**: ni el codigo, ni el `digest`, ni «excepcion». Eso va a la
 *    consola, que es donde se diagnostica.
 *  - **Con salida**, como el 404: reintentar, el inicio y el precio.
 *
 * Sin CSS propio a proposito: usa el cromo del sitio y las clases globales.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Sin esto no queda rastro de por que fallo: el lead ve una pantalla digna y
  // nosotros nos quedamos sin diagnostico. El detalle va a la consola, nunca a
  // la pantalla.
  useEffect(() => {
    console.error("[onia] fallo al renderizar la pagina", error);
  }, [error]);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="section">
        <div className="container">
          <p className="kicker">Error</p>
          <h1 className="h2">Esta página no se pudo cargar</h1>
          <p className="lead">
            Volvé a intentarlo. Si sigue igual, entrá desde el inicio: el resto
            del sitio funciona.
          </p>
          <div className="actions">
            <button type="button" className="btn" onClick={() => reset()}>
              Volver a intentar
            </button>
            <a href="/" className="btn btn-ghost">
              Ir al inicio
            </a>
            <a href="/precios" className="btn btn-ghost">
              Ver precios
            </a>
            <a href={EMPEZAR_URL} className="btn btn-ghost">
              {CTA_ALTA}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
