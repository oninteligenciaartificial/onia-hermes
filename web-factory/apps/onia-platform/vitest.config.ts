import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Resuelve el alias `@/` que usa la app, para que los gates puedan importar el
 * código que miden.
 *
 * **Por qué existe.** Hasta hoy no había config de vitest, así que `@/…` no se
 * resolvía en los tests. Eso no era una molestia de tipeo: dejaba un árbol
 * entero SIN PODER TENER GATE. `v1/empezar` —el asistente de 4 pasos, que
 * producción sirve con 200— importa `@/lib/site` desde `data.ts`, y `data.ts`
 * lo importa `recommend.ts`, así que cualquier test que tocara el wizard moría
 * en el import con `Cannot find package '@/lib/site'`. El único gate que había
 * ahí (`precio-web.test.ts`) esquiva el problema importando por ruta relativa,
 * que funciona para un módulo hoja y no para el motor del wizard.
 *
 * El costo de esa ausencia está medido dos veces sobre la MISMA pantalla: el
 * precio de la web vencido (Bs 790 en vez de 2.000) vivió doce días, y el
 * mensaje de WhatsApp que le hacía decir al lead *"(todavía en construcción)"*
 * vivió hasta el 2026-09-04. Las dos son copy que se pinta del lado del
 * cliente tras responder el cuestionario: no salen en el HTML servido, así que
 * ni `curl` ni `grep` ni una captura las ven. La única forma de vigilarlas es
 * importar el módulo — y para importarlo hace falta esto.
 *
 * Sólo declara el alias: todo lo demás queda en los defaults de vitest, para
 * no cambiar en silencio qué archivos corren.
 *
 * **Y el JSX (2026-10-02).** `tsconfig.json` dice `"jsx": "preserve"` —es lo
 * que Next pide: el JSX lo compila SWC en el build—, y vite lo respeta: deja
 * el JSX sin tocar y su análisis de imports muere al leer cualquier `.tsx`.
 * Eso dejaba sin gate posible a lo que el navegador recibe del servidor: el
 * `<h1>` de /precios salía con `opacity:0` en línea (LCP 3,4-3,7 s) y ningún
 * test podía renderizar la página para verlo. Con `runtime: "automatic"` vite
 * compila el JSX como lo hace Next, y `titular-visible-sin-js.test.ts`
 * renderiza cada página con `react-dom/server`. No cambia qué archivos corren.
 */
export default defineConfig({
  resolve: {
    alias: { "@": resolve(dirname(fileURLToPath(import.meta.url)), "src") },
  },
  oxc: {
    jsx: { runtime: "automatic" },
  },
});
