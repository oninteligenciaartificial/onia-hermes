import { describe, expect, it } from "vitest";

import { PAGINAS_PUBLICAS, archivoDe, cadenaHastaTexto } from "../rutas";

/**
 * Los agentes se nombran por lo que HACEN — decisión de Sergio Urcullo del
 * 2026-09-29, la misma que se aplicó en el producto.
 *
 * Hasta ese día la venta usaba los nombres de ROL del runtime (Recall, Cobrador,
 * Reponedor…), que al dueño de un negocio no le dicen nada, y dos de ellos
 * mentían por el verbo: el agente de cobros no cobra —redacta el recordatorio y
 * el dueño lo aprueba— y el de stock no repone —deja una tarea, no compra nada—.
 * Por eso lo prohibido no es sólo el nombre de rol: es también «Cobra» y
 * «Repone» como nombre de agente.
 *
 * El sujeto es toda página que el sitio PUBLICA (`PAGINAS_PUBLICAS`, derivada
 * del disco), recorrida por su grafo de imports con `cadenaHastaTexto`: el
 * nombre casi nunca está escrito en el `page.tsx`, lo pinta un dato importado
 * (`lib/pricing.ts` lo pone en la tarjeta de cada plan).
 */
const NOMBRES = [
  "Vuelve a citar",
  "Recuerda cobros",
  "Confirma citas",
  "Reprograma",
  "Avisa stock bajo",
  "Sigue cotizaciones",
] as const;

/** Nombres de rol del runtime y los dos verbos que prometen de más. Sensible a mayúsculas: «Meta cobra» no es un agente. */
const NOMBRE_VIEJO = /\b(?:Recall|Cobrador|Reponedor|Confirmador|Seguidor|Reprogramador|Cobra|Repone)\b/;

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const AGENTES = PAGINAS_PUBLICAS.find((p) => p.ruta === "/agentes");

describe("los agentes se nombran por lo que hacen", () => {
  it("el instrumento ve lo que tiene que ver", () => {
    // Anclas: sin la página o con la regex rota, los casos de abajo firmarían
    // verde sobre nada.
    expect(AGENTES, "/agentes salió de las páginas publicadas").toBeTruthy();
    expect(PAGINAS_PUBLICAS.length).toBeGreaterThan(9);
    for (const viejo of [
      "Agente Cobrador: te propone a quién reclamarle la deuda vencida",
      "Recall detecta al cliente que no vuelve",
      "Repone stock cuando baja del mínimo",
      "Cobra la deuda vencida",
    ]) {
      expect(NOMBRE_VIEJO.test(viejo), viejo).toBe(true);
    }
    for (const sano of ["Meta cobra las respuestas", "No cobra nada: vos aprobás", "Recuerda cobros"]) {
      expect(NOMBRE_VIEJO.test(sano), sano).toBe(false);
    }
  });

  it.each(NOMBRES)("/agentes pinta «%s»", (nombre) => {
    expect(
      cadenaHastaTexto(archivoDe(AGENTES!), new RegExp(escapar(nombre))),
      `/agentes no nombra a «${nombre}»: la página que explica los agentes se saltó uno`,
    ).not.toBeNull();
  });

  it.each(PAGINAS_PUBLICAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no nombra a un agente con su nombre viejo",
    (_ruta, pagina) => {
      const hallado = cadenaHastaTexto(archivoDe(pagina), NOMBRE_VIEJO);
      expect(
        hallado,
        hallado
          ? `«${hallado.encontrado}» llega por ${hallado.cadena.join(" → ")}. Los agentes se ` +
              `llaman ${NOMBRES.join(", ")}; nunca «Cobra» ni «Repone».`
          : "",
      ).toBeNull();
    },
  );
});
