"use client";

import { useEffect } from "react";

/**
 * El ultimo recurso: cuando lo que falla es el propio layout raiz.
 *
 * Next reemplaza aca el documento ENTERO, asi que este archivo trae su propio
 * `<html>` y `<body>` y **no puede apoyarse en nada del sitio** — ni el cromo,
 * ni las fuentes, ni las clases de `globals.css`, porque justamente puede ser
 * eso lo que fallo. Por eso los estilos van en linea, con los valores de los
 * tokens (`--bg`, `--ink`, `--ink-soft` de `globals.css`) escritos a mano: es
 * la unica copia de un color en el sitio, y esta es la razon.
 *
 * Sin este archivo el lead ve la pantalla de Next: «Application error: a
 * client-side exception has occurred» — ingles, jerga, sin marca y sin salida.
 * Su hermana de segmento es `error.tsx`, con el detalle del criterio de copy.
 *
 * `lang="es"` no es cosmetico: sin el, el lector de pantalla lee este texto
 * con fonetica inglesa, que es la ultima pantalla donde uno quiere eso.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[onia] fallo al renderizar el layout raiz", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9FBFA",
          color: "#141A17",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          lineHeight: 1.5,
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem", fontWeight: 600 }}>
            Esta página no se pudo cargar
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "#424A46" }}>
            Volvé a intentarlo. Si sigue igual, entrá desde el inicio: el resto
            del sitio funciona.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              font: "inherit",
              cursor: "pointer",
              border: "1px solid #141A17",
              background: "#141A17",
              color: "#F9FBFA",
              borderRadius: "999px",
              padding: "0.7rem 1.4rem",
              marginRight: "0.6rem",
            }}
          >
            Volver a intentar
          </button>
          <a
            href="/"
            style={{
              display: "inline-block",
              border: "1px solid #141A17",
              borderRadius: "999px",
              padding: "0.7rem 1.4rem",
              color: "#141A17",
              textDecoration: "none",
            }}
          >
            Ir al inicio
          </a>
        </main>
      </body>
    </html>
  );
}
