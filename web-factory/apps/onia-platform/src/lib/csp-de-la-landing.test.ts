import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";
import { CHATWOOT_BASE_URL, CHATWOOT_SDK_PATH } from "./chat-diferido";

/**
 * La landing declara una CSP, y esa CSP deja vivo al widget que capta los leads.
 *
 * **El defecto que este gate deja rojo.** Medido el 2026-09-25 contra el
 * dominio vivo: `curl -sI https://onia.com.bo/` devolvía cinco headers de
 * seguridad —HSTS, nosniff, X-Frame-Options, Referrer-Policy,
 * Permissions-Policy— y NINGUNA `content-security-policy`, mientras
 * `app.onia.com.bo/login` ya servía una completa. Sin CSP, un script que se
 * cuele en la portada puede mandar a donde quiera lo que el visitante escriba,
 * y la portada es la que capta TODOS los leads.
 *
 * **Por qué faltaba, y por qué ya se puede.** `next.config.ts` lo dejaba
 * afuera a propósito: *"hay dos scripts inline y el SDK de Chatwoot, y una CSP
 * escrita a ciegas rompe el sitio en silencio"*. El motivo era correcto. Lo que
 * cambió es que los sujetos ya están medidos uno por uno (abajo), así que no
 * hace falta escribirla a ciegas.
 *
 * **Por qué NO se copia la CSP de la hermana, que es la trampa de esta tarea.**
 * `app.onia.com.bo` corre `frame-src 'none'` y pide `fonts.googleapis.com` y
 * `fonts.gstatic.com`. Sobre ESTA app las dos cosas están mal:
 *
 *  - el widget de Chatwoot se dibuja **dentro de un iframe** de su propio
 *    origen, así que `frame-src 'none'` apaga el canal de contacto del sitio
 *    —el fallo más caro posible acá— y lo apaga **mudo**: la página carga con
 *    200, se ve perfecta, y la burbuja simplemente no está;
 *  - las tipografías entran por `next/font/google`, que las **auto-hospeda** en
 *    el build (`/_next/static/media/…`), así que los dos orígenes de Google son
 *    permiso regalado por una dependencia que esta app no tiene.
 *
 * Por eso el gate no compara contra la hermana: afirma, directiva por
 * directiva, lo que ESTA landing carga de verdad.
 *
 * **Por qué se EJECUTA `headers()` y no se grepea el archivo.** Lo que hay que
 * afirmar es qué recibe el navegador. Un `grep` de `content-security-policy`
 * sobre `next.config.ts` da verde igual si la directiva quedó en un comentario,
 * si la entrada apunta a un `source` que no cubre la portada, o si el valor
 * contradice al snippet de al lado. Correr `headers()` y leer el valor es la
 * única forma de ver las tres cosas.
 *
 * **Y el origen de Chatwoot se DERIVA de `chat-diferido.ts`, no se tipea.** Es
 * la fuente única del snippet que inyecta el SDK: si ese host se mueve, la CSP
 * tiene que moverse con él o el widget muere. Un literal repetido acá sería un
 * cuarto lugar donde el host puede quedar viejo.
 */

/** La CSP que el navegador recibiría, partida en `directiva → orígenes`. */
async function directivasDeLaCsp(): Promise<Map<string, string[]>> {
  const entradas = await nextConfig.headers!();

  /* La portada es `/`. Sólo cuentan las entradas cuyo `source` la cubre: una
   * CSP declarada bajo `/panel/:x*` existe y no protege nada de lo que ve un
   * lead. */
  const queCubrenLaPortada = entradas.filter((entrada) =>
    /^\/(:[A-Za-z]+\*)?$/.test(entrada.source),
  );

  const csp = queCubrenLaPortada
    .flatMap((entrada) => entrada.headers)
    .find((header) => header.key.toLowerCase() === "content-security-policy");

  expect(
    csp,
    "ninguna entrada de headers() que cubra la portada declara content-security-policy",
  ).toBeDefined();

  const directivas = new Map<string, string[]>();
  for (const trozo of csp!.value.split(";")) {
    const [nombre, ...origenes] = trozo.trim().split(/\s+/);
    if (nombre) directivas.set(nombre.toLowerCase(), origenes);
  }
  return directivas;
}

describe("la CSP de la landing", () => {
  it("existe, y cubre la portada", async () => {
    const directivas = await directivasDeLaCsp();

    /* `default-src` es la red que atrapa todo lo que no tenga directiva propia.
     * Sin ella, lo no declarado queda permitido y la CSP es decorativa. */
    expect(directivas.get("default-src")).toEqual(["'self'"]);
  });

  it("deja correr los dos scripts inline del layout", async () => {
    const directivas = await directivasDeLaCsp();

    /* `layout.tsx` cuelga dos `<script dangerouslySetInnerHTML>`: el que aplica
     * el tema antes del primer paint y el que difiere el chat. Sin
     * `'unsafe-inline'` el sitio arranca con el tema equivocado (parpadeo
     * claro/oscuro) y el chat NUNCA se pide: el visitante se queda sin canal. */
    expect(directivas.get("script-src")).toContain("'unsafe-inline'");
  });

  it("deja bajar el SDK de Chatwoot, que no es un script propio", async () => {
    const directivas = await directivasDeLaCsp();

    expect(directivas.get("script-src")).toContain(CHATWOOT_BASE_URL);
  });

  it("deja al widget hablar con su servidor, incluido el websocket", async () => {
    const directivas = await directivasDeLaCsp();
    const conexiones = directivas.get("connect-src") ?? [];

    /* Chatwoot conversa por HTTPS y mantiene la conversación viva por
     * ActionCable (WebSocket). `connect-src` gobierna los dos, y `wss:` no lo
     * hereda de `https:`: si falta, el mensaje del lead se manda y la respuesta
     * del bot nunca aparece en pantalla. */
    expect(conexiones).toContain(CHATWOOT_BASE_URL);
    expect(conexiones).toContain(CHATWOOT_BASE_URL.replace(/^https:/, "wss:"));
  });

  it("deja al widget dibujarse: frame-src no puede ser 'none'", async () => {
    const directivas = await directivasDeLaCsp();
    const marcos = directivas.get("frame-src") ?? [];

    /* ÉSTA es la línea que rompería copiar la CSP de `app.onia.com.bo`, que
     * corre `frame-src 'none'` con razón (allá nada se embebe). Acá la burbuja
     * de Chatwoot ES un iframe de su propio origen: con `'none'` la portada
     * sigue dando 200, se ve igual, y el canal de contacto desaparece sin una
     * línea de error del lado del servidor. */
    expect(marcos).not.toContain("'none'");
    expect(marcos).toContain(CHATWOOT_BASE_URL);
  });

  it("no regala permisos que esta app no usa", async () => {
    const directivas = await directivasDeLaCsp();
    const todos = [...directivas.values()].flat();

    /* Las tipografías entran por `next/font/google`, que las auto-hospeda en el
     * build. Si algún día aparece un origen de Google Fonts acá, es que alguien
     * copió la CSP de la hermana en vez de derivarla — el modo de fallo que
     * este archivo existe para frenar. */
    expect(todos.join(" ")).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);

    /* `object-src 'none'` y `base-uri 'self'` son las dos directivas que
     * `default-src` NO cubre en la práctica y que cierran inyección de plugins
     * y secuestro de URLs relativas. */
    expect(directivas.get("object-src")).toEqual(["'none'"]);
    expect(directivas.get("base-uri")).toEqual(["'self'"]);
  });

  it("los cinco headers que ya protegían la landing siguen puestos", async () => {
    const entradas = await nextConfig.headers!();
    const puestos = entradas
      .flatMap((entrada) => entrada.headers)
      .map((header) => header.key.toLowerCase());

    /* Agregar la CSP no es excusa para perder ninguno: `X-Frame-Options`
     * gobierna quién nos embebe a NOSOTROS y es una pregunta distinta de
     * `frame-src`, que gobierna a quién embebemos. Las dos tienen que convivir. */
    for (const header of [
      "strict-transport-security",
      "x-content-type-options",
      "x-frame-options",
      "referrer-policy",
      "permissions-policy",
    ]) {
      expect(puestos, `se perdió ${header}`).toContain(header);
    }
  });

  it("el snippet del chat no pide nada que la CSP no permita", async () => {
    const directivas = await directivasDeLaCsp();

    /* Cruce de las dos fuentes: el snippet arma la URL del SDK como
     * `BASE_URL + CHATWOOT_SDK_PATH`. Si mañana el SDK se sirviera desde otro
     * host, este cruce lo deja rojo antes de que el widget muera en vivo. */
    const urlDelSdk = CHATWOOT_BASE_URL + CHATWOOT_SDK_PATH;
    const permitidos = directivas.get("script-src") ?? [];
    expect(
      permitidos.some((origen) => urlDelSdk.startsWith(origen)),
      `script-src no cubre ${urlDelSdk}`,
    ).toBe(true);
  });
});
