import type { NextConfig } from "next";
import path from "node:path";

import { CHATWOOT_BASE_URL } from "./src/lib/chat-diferido";

// Raiz del monorepo. La usan dos cosas distintas: turbopack en desarrollo y el
// trazado de archivos del build standalone.
const monorepoRoot = path.resolve(process.cwd(), "../..");

/**
 * El único tercero de la landing **que el código carga**: Chatwoot,
 * self-hosted. El origen se DERIVA de `chat-diferido.ts` —la fuente única del
 * snippet que inyecta el SDK— porque si ese host se mueve, la CSP tiene que
 * moverse con él o el widget muere mudo.
 */
const CHATWOOT_WS = CHATWOOT_BASE_URL.replace(/^https:/, "wss:");

/**
 * El otro tercero: el que **no** carga el código, sino Cloudflare.
 *
 * `onia.com.bo` no va del contenedor al navegador — pasa por el proxy de
 * Cloudflare, que le inyecta su Web Analytics DESPUÉS de que el build terminó.
 * No hay import ni `<script>` que derivar: para este repositorio el beacon no
 * existe, y por eso una CSP escrita mirando sólo lo que el código pide lo deja
 * afuera **sin que nada se ponga rojo**.
 *
 * Y lo deja afuera de la peor manera: la portada sigue cargando perfecta, así
 * que ninguna captura lo ve; lo que se pierde es la analítica de la única
 * página que capta leads, más un error de CSP en la consola de cada visitante.
 *
 * Medido el 2026-09-25 con Chromium contra el dominio vivo (los dos únicos
 * orígenes de tercero en toda la portada fueron Chatwoot y éste):
 *
 *     GET  script https://static.cloudflareinsights.com/beacon.min.js/v31edd…
 *     POST xhr    https://onia.com.bo/cdn-cgi/rum?
 *
 * El `POST` del beacon sale al MISMO origen, así que `connect-src 'self'` ya lo
 * cubre: acá sólo hace falta abrir `script-src`.
 */
const CLOUDFLARE_INSIGHTS = "https://static.cloudflareinsights.com";

/**
 * CSP de onia.com.bo, derivada de lo que el NAVEGADOR carga de verdad.
 *
 * No es lo mismo que "lo que el código carga", y la diferencia ya mordió una
 * vez: entre el contenedor y el visitante está Cloudflare, que suma un script
 * propio (ver `CLOUDFLARE_INSIGHTS`). Cada vez que se toque esta lista, los
 * sujetos se cuentan abriendo el dominio vivo, no grepeando el repositorio.
 *
 * No es la de `app.onia.com.bo`: esa corre `frame-src 'none'` y pide los dos
 * orígenes de Google Fonts. Copiarla acá apagaría el widget que capta los leads
 * (la burbuja de Chatwoot es un iframe) y regalaría permisos que esta app no
 * usa (las tipografías entran por `next/font/google`, que las auto-hospeda en
 * el build y las sirve desde `/_next/static/media/…`).
 *
 * Renglón por renglón, con el sujeto que lo obliga:
 *
 *  - `'unsafe-inline'` en `script-src`: `layout.tsx` cuelga dos `<script>`
 *    inline —el tema antes del primer paint y el diferido del chat— y ninguno
 *    puede pasar a archivo sin perder justamente la propiedad de correr antes
 *    del bundle. `'unsafe-eval'` NO va en el build —nada del bundle lo pide— y
 *    SÍ en `next dev`, que evalúa cada módulo con `eval`: sin él el sitio local
 *    no hidrata y se ve idéntico (ver `ejecutaEval`, medido el 2026-09-25).
 *  - `static.cloudflareinsights.com` en `script-src`: el beacon que inyecta el
 *    proxy. Es el único origen de esta lista que no sale del código, así que es
 *    también el único que un `grep` no puede defender: ver `CLOUDFLARE_INSIGHTS`.
 *  - `'unsafe-inline'` en `style-src`: Next inyecta estilos críticos inline, y
 *    el SDK de Chatwoot se dibuja con estilos propios.
 *  - `img-src ... data: blob:` + Chatwoot: los SVG de marca viajan como `data:`
 *    y los adjuntos/avatares del chat salen de su origen.
 *  - `connect-src` con `https:` Y `wss:`: la conversación se mantiene viva por
 *    ActionCable; `wss:` no se hereda de `https:`.
 *  - `frame-src` con Chatwoot: el widget ES un iframe de su propio origen.
 *  - `media-src` con Chatwoot: el sonido de mensaje nuevo.
 *  - `object-src 'none'` y `base-uri 'self'`: las dos que `default-src` no
 *    cubre en la práctica.
 *  - `form-action 'self'`: los formularios de contacto postean acá y nada más.
 */
export function cspDeLaLanding(entorno = process.env.NODE_ENV): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${ejecutaEval(entorno)} ${CHATWOOT_BASE_URL} ${CLOUDFLARE_INSIGHTS}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${CHATWOOT_BASE_URL}`,
    "font-src 'self' data:",
    `connect-src 'self' ${CHATWOOT_BASE_URL} ${CHATWOOT_WS}`,
    `frame-src ${CHATWOOT_BASE_URL}`,
    `media-src 'self' ${CHATWOOT_BASE_URL}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

/**
 * El ÚNICO permiso de esta CSP que depende del entorno, y el único que no se
 * puede derivar mirando el dominio vivo — porque en el dominio vivo no hace
 * falta.
 *
 * `next dev` evalúa cada módulo del cliente con `eval`. Con la CSP de arriba y
 * sin `'unsafe-eval'`, el bundle del navegador muere antes de hidratar:
 *
 *     EvalError: Evaluating a string as JavaScript violates the following
 *       Content Security Policy directive… 'unsafe-eval' is not an allowed
 *       source of script
 *
 * La página sigue dando 200 y se ve idéntica —el HTML es server-rendered— así
 * que nada lo delata salvo apretar algo: medido el 2026-09-25 en el puerto
 * 3320, el formulario de `/guia-facturacion` respondía con un submit GET
 * **nativo** (`?email=sin-arroba&whatsapp=`), que es la firma de "React nunca
 * tomó el control". Producción, medida el mismo día, hidrata perfecto.
 *
 * Lo que costó: el gate de punta a punta de la captura de leads
 * (`scripts/verificar-guia-facturacion.mjs`) corre contra el sitio LOCAL a
 * propósito —apretar el botón contra producción nace un lead en la bandeja
 * real— y quedó en **8 FALLAS** fijas sobre una pantalla sana.
 *
 * En el build NO entra, y eso lo afirma `src/lib/csp-de-la-landing.test.ts`:
 * `eval` en producción es la primitiva que convierte un XSS en ejecución, y acá
 * nada del bundle la pide.
 */
function ejecutaEval(entorno: string | undefined): string {
  return entorno === "development" ? " 'unsafe-eval'" : "";
}

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },

  /**
   * `standalone` = la landing se autohospeda en el VPS, no en Vercel. Produce un
   * bundle con su propio server.js y solo las dependencias que realmente usa.
   *
   * OJO, leccion pagada con la app: este bundle hay que construirlo con webpack.
   * Con Turbopack, el standalone le pone un sufijo con hash a cada modulo
   * externo y en ejecucion ninguno resuelve, asi que TODAS las rutas devuelven
   * 500. En Vercel no se nota porque Vercel no usa este bundle: el fallo
   * aparece recien al auto-hospedar.
   *
   * En ESTA app (Next 15.5.19) webpack YA es el default de `next build`:
   * alcanza con `next build` a secas, y `--webpack` no existe como flag.
   * OJO: el producto (onia-platform, Next 16) es lo CONTRARIO — alla Turbopack
   * es el default y hay que pasar `--webpack` obligatorio (su standalone
   * hashea los modulos externos: incidente jul-2026, todas las rutas 500).
   * Dos apps, dos majors de Next, defaults opuestos. La clave `turbopack` de
   * arriba solo afecta a `next dev`.
   */
  output: "standalone",

  /**
   * En un monorepo hay que decir desde donde trazar, o el standalone sale sin
   * las dependencias que viven en la raiz.
   */
  outputFileTracingRoot: monorepoRoot,

  /**
   * URLs de la v1 que dejaron de existir el 2026-08-21 al publicar la v3.
   *
   * Las tres circulan: /prueba-gratis es el destino de firmas de correo y de
   * los CTA de las paginas viejas, /modulos/dental estaba en el sitemap desde
   * hace meses, y /funciones/facturacion-electronica-siat es la que capta la
   * busqueda del plazo del SIN. Un 404 en cualquiera de las tres es plata
   * perdida y autoridad tirada.
   *
   * `permanent: true` = 308: el buscador traslada la senal a la URL nueva y el
   * navegador cachea. Solo se usa donde el destino cubre la MISMA intencion.
   *
   * Ninguna choca con una pagina real: los archivos de esas rutas viven ahora
   * bajo /v1/... y siguen sirviendose desde ahi (noindex).
   */
  /**
   * Headers de seguridad EN LA APP (auditoría 2026-09-11: no había ninguno; si
   * Cloudflare agrega los suyos, eso no vive en este repo y no se ve en
   * local/staging).
   *
   * La CSP se sumó el 2026-09-25, y hasta entonces faltaba a propósito: *"hay
   * dos scripts inline y el SDK de Chatwoot, y una CSP escrita a ciegas rompe
   * el sitio en silencio"*. El motivo seguía siendo bueno; lo que cambió es que
   * los sujetos están medidos uno por uno en `CSP_DE_LA_LANDING`, y el gate
   * `src/lib/csp-de-la-landing.test.ts` los vuelve a cruzar en cada corrida.
   */
  async headers() {
    return [
      {
        source: "/:ruta*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // DENY y no SAMEORIGIN: nada del sitio se embebe en iframes, ni propios.
          // Ojo: gobierna quién nos embebe a NOSOTROS. A quién embebemos lo
          // decide `frame-src` de la CSP, y ahí Chatwoot SÍ entra.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: cspDeLaLanding() },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/prueba-gratis", destination: "/empezar", permanent: true },
      { source: "/modulos/dental", destination: "/rubros", permanent: true },
      { source: "/modulos", destination: "/rubros", permanent: true },
      {
        source: "/funciones/facturacion-electronica-siat",
        destination: "/facturacion",
        permanent: true,
      },
      // El preview interno del rediseno: se anuncio por interno y quedo en
      // historiales. Ahora ES el sitio.
      { source: "/preview", destination: "/", permanent: true },
      { source: "/preview/:ruta*", destination: "/:ruta*", permanent: true },
    ];
  },
};

export default nextConfig;
