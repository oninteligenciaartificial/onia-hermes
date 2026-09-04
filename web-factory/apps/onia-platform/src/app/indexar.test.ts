import { describe, expect, it } from "vitest";

import {
  PAGINAS,
  RUTAS_DEL_SITEMAP,
  RUTAS_PROHIBIDAS,
  declaraNoindex,
  estaProhibida,
  metadataDe,
} from "./rutas";

/**
 * El sitemap y las etiquetas `robots` tienen que decir LO MISMO.
 *
 * Un sitemap no es un índice de contenidos: es un pedido —"rastreá e indexá
 * estas URLs"—. Una que además declara `noindex` es una contradicción que el
 * sitio se hace a sí mismo, y Search Console la reporta como error
 * (*"Submitted URL marked 'noindex'"*) sobre una página que vos mismo excluiste.
 *
 * El 2026-09-03 pasaba en `/terminos`, medido en producción contra el
 * contenedor que sirve el dominio:
 *   curl -s https://onia.com.bo/terminos | grep -o 'name="robots"[^>]*'
 *     → content="noindex"
 *   curl -s https://onia.com.bo/sitemap.xml | grep terminos
 *     → <loc>https://onia.com.bo/terminos</loc>
 *
 * Se resolvió sacándola del sitemap y no quitándole el `noindex`, porque el
 * `noindex` es el lado deliberado: su propio archivo ya dejaba escrito que
 * *"esta página no la querés en Google, pero sí se manda por WhatsApp"*.
 * Quitárselo es una decisión, no la salida barata de un gate en rojo.
 * `/privacidad` sí es indexable, y con su motivo escrito: el rastreador de Meta
 * valida esa URL al publicar la app del chatbot.
 *
 * ⚠️ **Acá decía además que los Términos son "un borrador pendiente de revisión
 * por abogado". Es falso, y se corrigió el 2026-09-03**: el documento se declara
 * `status: "vigente"` en su frontmatter (`src/content/legal/terminos.md`), y por
 * eso la página no muestra ningún cartel de borrador. La frase venía de la
 * `description` de `/terminos`, que arrastraba el mismo texto viejo y ya se
 * limpió (ver `obra.test.ts`). Queda escrito porque una premisa vencida dentro
 * de la justificación de un gate se lee como vigente y decide por la próxima
 * sesión: el `noindex` sigue en pie por lo de arriba, no por un borrador que no
 * existe.
 *
 * El sitio ya tenía la regla escrita en `v1/layout.tsx` (*"robots.ts y fuera
 * del sitemap"*) y la cumplía en `/patrones` y en `/v1`. Lo que faltaba no era
 * la regla: era algo que la midiera.
 *
 * Corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del
 * deploy, no un script paralelo que no llama nadie.
 */

describe("el sitemap sólo promete páginas que el sitio quiere indexadas", () => {
  it("encuentra las tres listas", () => {
    // Sin este ancla, romper cualquiera de los tres barridos (carpeta movida,
    // `page.tsx` renombrado, `disallow` reescrito) dejaría los `it.each` de
    // abajo corriendo sobre una lista VACÍA: cero casos, verde, defecto suelto.
    expect(PAGINAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
    expect(
      RUTAS_DEL_SITEMAP.length,
      "no se pudo leer la lista de rutas de sitemap.ts",
    ).toBeGreaterThan(9);
    expect(
      RUTAS_PROHIBIDAS.length,
      "no se pudo leer el disallow de robots.ts",
    ).toBeGreaterThan(0);
  });

  it.each(RUTAS_DEL_SITEMAP.map((ruta) => [ruta || "/", ruta]))(
    "%s se puede indexar",
    (rotulo, ruta) => {
      const pagina = PAGINAS.find((p) => p.ruta === ruta);
      expect(
        pagina,
        `${rotulo} está en el sitemap y no tiene page.tsx: el sitemap publica un 404`,
      ).toBeTruthy();

      expect(
        estaProhibida(ruta),
        `${rotulo} está en el sitemap y robots.ts se la prohíbe al rastreador ` +
          `(disallow: ${RUTAS_PROHIBIDAS.join(", ")}). El sitio se contradice solo.`,
      ).toBe(false);

      expect(
        declaraNoindex(metadataDe(pagina!)),
        `${pagina!.archivo} declara noindex y ${rotulo} está en el sitemap. Un ` +
          `sitemap pide indexar: o sale de la lista, o pierde el noindex. ` +
          `Search Console lo reporta como error.`,
      ).toBe(false);
    },
  );
});
