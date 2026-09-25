import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Proof } from "@/components/sections/proof";
import { Reveal } from "@/motion";
import { HUECO } from "@/lib/proof";

/**
 * ⚠️ La `description` cerraba con *"Y lo que Onia todavía no hace."* hasta el
 * 2026-09-04, y ésta es la MISMA frase que `(sitio)/comparativa` sacó el
 * 2026-09-03 por anunciar la carencia en el renglón que busca el clic. Se
 * arregló allá y su gemela de acá quedó atrás.
 *
 * Que esta página esté en el `disallow` de `robots.ts` no la apagaba: medido
 * contra producción el 2026-09-04, `curl -A "WhatsApp/2.23.20.0"` sobre
 * `/v1/comparativa` devuelve **HTTP 200** con esa `description` entera — o sea
 * que era lo que veía un lead al recibir el enlace reenviado. Ahora dice lo
 * mismo que su canónica, que es el texto ya decidido.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://onia.com.bo/"),
  title: "Onia comparada con los sistemas que se venden en Bolivia",
  description:
    "Qué cobra y qué resuelve cada sistema que se vende en Bolivia: Portal del SIN, facturadores y software dental de la región. Con precio público y fecha de consulta.",
  alternates: { canonical: "/comparativa" },
  /**
   * Sin este bloque la página NO declaraba una sola etiqueta Open Graph: las
   * heredaba enteras del layout raíz, así que el enlace reenviado dibujaba la
   * tarjeta de la PORTADA —«Onia — El sistema con IA que maneja tu negocio
   * completo»— sobre una página de comparación, y sin `og:url` propia.
   *
   * Medido el 2026-09-08 contra producción, con el fetcher que arma la tarjeta:
   *
   *     curl -A "WhatsApp/2.23.20.0" https://onia.com.bo/v1/comparativa
   *     → HTTP 200 · og:title "Onia — El sistema con IA…" · og:url ausente
   *
   * `url` apunta a `/comparativa` y no a sí misma, igual que el `canonical` y
   * que sus hermanas de `/v1`: esta ruta es el archivo de la web anterior, así
   * que quien reciba el enlace viejo tiene que aterrizar en la página viva.
   */
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Onia comparada con los sistemas que se venden en Bolivia",
    description:
      "Qué cobra y qué resuelve cada sistema que se vende en Bolivia: Portal del SIN, facturadores y software dental de la región. Con precio público y fecha de consulta.",
    url: "/comparativa",
  },
};

/**
 * Subpagina de comparacion.
 *
 * Era la seccion mas densa del home y solo la lee quien ya esta comparando:
 * por eso salio del embudo y quedo acá, enlazada desde precios y desde la
 * card de honestidad. El contenido es el mismo <Proof> de siempre — la tabla
 * con nombres, precios publicos y fuente, mas el ledger de lo que no hacemos.
 */
export default function ComparativaPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Reveal>
              <p className="kicker">Comparación</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                Onia comparada con lo que se vende en Bolivia.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                {HUECO} Todos los precios de abajo son públicos: abrí cualquiera
                de esas webs y comprobalo vos mismo.
              </p>
            </Reveal>
          </div>
        </section>
        <Proof />
      </main>
      <SiteFooter />
    </>
  );
}
