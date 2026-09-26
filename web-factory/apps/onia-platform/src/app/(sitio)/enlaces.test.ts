import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio de venta sólo manda al lead a hosts que existen.
 *
 * El 2026-09-03, siguiendo a mano cada enlace que SALE del sitio, los dos
 * botones grandes de `/contacto` —hoy «Agendar la consulta» y «Agendar la demo»,
 * los únicos CTA de la página cuyo trabajo entero es que un lead consiga
 * hablar con alguien— apuntaban a `cal.onia.com.bo`, un Cal.com self-hosted
 * que **ya no existe**: no hay contenedor con ese nombre en el VPS y Sergio
 * eligió el 2026-09-02 los horarios fijos del bot en vez de revivirlo.
 *
 * El host resolvía igual (187.77.16.63) y devolvía **302 a /empezar**. O sea:
 * `curl -L` daba **200**, ninguna herramienta veía un enlace roto, y el lead
 * que quería CONVERSAR aterrizaba en el asistente de alta —un formulario— en
 * una página que promete, textual, *«No hay formulario que caiga en un buzón.
 * Elegís vos el día y la hora en nuestra agenda»*. La página se contradecía a
 * sí misma en su último clic, en silencio, y el `<a>` seguía viéndose sano.
 *
 * Por eso el gate mira **el host**, no el código de respuesta: un 302 a
 * cualquier lado es 200 para todo el mundo, y un enlace muerto que redirige
 * es indistinguible de uno vivo salvo que sepas a dónde tenía que llegar.
 *
 * ⚠️ Corre en `prebuild` (`tsc --noEmit && vitest run`), sin red. Lo que
 * vigila es que nadie publique un destino que no declaramos servir; que el
 * host declarado siga en pie se mide contra producción, no acá.
 *
 * La lista de archivos se DERIVA DEL DISCO —todo `(sitio)/**` más los módulos
 * de `@/lib` y `@/content` que esas páginas importan— y no de una lista de
 * rutas escrita a mano. Una lista de inclusión falla abierto: el día que
 * alguien agrega una página, nace sin gate y nada se pone en rojo.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = dirname(dirname(AQUI));

/**
 * Hosts a los que el sitio SÍ puede mandar a alguien, cada uno con el motivo
 * por el que se lo considera vivo. Agregar uno es una decisión, no un
 * descuido: si no está acá, el gate lo frena antes del deploy.
 */
const HOSTS_PERMITIDOS: Record<string, string> = {
  "onia.com.bo": "este mismo sitio (SITE_URL): canonical, sitemap y OG",
  "app.onia.com.bo": "la app — contenedor onia-platform; /login y /register medidos en 200",
  "wa.me": "WhatsApp del negocio, el canal que atiende hoy (WA_PHONE)",
  "www.impuestos.gob.bo": "sitio oficial del SIN, citado en la guía de facturación",
  "siatinfo.impuestos.gob.bo": "portal oficial del SIAT, citado en la guía de facturación",
  // No es un enlace que alguien visite: es el namespace del JSON-LD.
  "schema.org": "namespace de schema.org en los datos estructurados",
};

/** Todos los archivos de código bajo una carpeta, sin los tests. */
function archivosDe(carpeta: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) salida.push(...archivosDe(ruta));
    else if (/\.tsx?$/.test(entrada.name) && !/\.test\.tsx?$/.test(entrada.name)) salida.push(ruta);
  }
  return salida;
}

/**
 * Las páginas del sitio más los módulos que importan de `@/lib` y `@/content`.
 * Ese salto importa: los enlaces al SIN no están en ninguna página, viven en
 * `lib/siat.ts`, y un gate que sólo mirara `(sitio)/` sería ciego a ellos.
 */
function superficieDeVenta(): string[] {
  const paginas = archivosDe(join(SRC, "app", "(sitio)"));
  const modulos = new Set<string>();
  for (const archivo of paginas) {
    const texto = readFileSync(archivo, "utf8");
    for (const [, alias] of texto.matchAll(/from\s+"@\/((?:lib|content)\/[\w/-]+)"/g)) {
      for (const ext of [".ts", ".tsx"]) {
        const ruta = join(SRC, `${alias}${ext}`);
        if (existsSync(ruta)) modulos.add(ruta);
      }
    }
  }
  return [...paginas, ...modulos];
}

/**
 * El archivo sin sus comentarios.
 *
 * Un host nombrado en un comentario NO es un enlace: nadie puede hacer clic en
 * una explicación. Sin este filtro, el gate le cobra a la bitácora el defecto
 * que la bitácora explica — pasó acá mismo el 2026-09-05: al documentar por qué
 * se borró `dentalgest.app`, el comentario lo volvió a «declarar» y el test se
 * puso rojo. Las dos salidas obvias eran malas: borrar la explicación, o meter
 * el host muerto de vuelta en la lista blanca, que es exactamente el bug que se
 * estaba arreglando.
 */
function sinComentarios(texto: string): string {
  return (
    texto
      // Bloque /* … */ (incluidos los JSDoc). Se conservan los saltos de línea:
      // colapsarlos pegaría el comentario a la línea siguiente y `export` dejaría
      // de estar al principio de renglón, que es como se parten los símbolos.
      .replace(/\/\*[\s\S]*?\*\//g, (bloque) => bloque.replace(/[^\n]/g, " "))
      // Línea `// …`, sin comerse el `//` de `https://`.
      .replace(/(^|[^:])\/\/.*$/gm, "$1")
  );
}

/** Cada host absoluto que aparece en la superficie, con los archivos donde está. */
function hostsDeclarados(): Map<string, Set<string>> {
  const encontrados = new Map<string, Set<string>>();
  for (const archivo of superficieDeVenta()) {
    const texto = sinComentarios(readFileSync(archivo, "utf8"));
    for (const [, host] of texto.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      const clave = host.toLowerCase();
      if (!encontrados.has(clave)) encontrados.set(clave, new Set());
      encontrados.get(clave)!.add(archivo.slice(SRC.length + 1));
    }
  }
  return encontrados;
}

/** El archivo donde viven los destinos del sitio. */
const SITE_TS = join(SRC, "lib", "site.ts");

/**
 * Nombres de los símbolos exportados por `lib/site.ts` que apuntan a ese host.
 *
 * Mira `export const` Y `export function`, porque los dos declaran destinos y
 * el segundo es el caso que importa: `wa.me` no es una constante, lo arman
 * `waLink()` y `waServiciosLink()` con un template. Buscando sólo constantes,
 * el host quedaba sin dueño y el gate lo acusaba de huérfano estando vivo —
 * medido acá el 2026-09-05, con `wa.me` saliendo junto a `dentalgest.app`.
 */
function simbolosQueApuntanA(host: string): string[] {
  const texto = sinComentarios(readFileSync(SITE_TS, "utf8"));
  const nombres: string[] = [];
  // Cada bloque va desde un `export` hasta el siguiente: alcanza para saber
  // qué símbolo tiene el host en su cuerpo, sin necesidad de un parser.
  const bloques = texto.split(/^export /m).slice(1);
  for (const bloque of bloques) {
    const nombre = bloque.match(/^(?:const|function|async function)\s+(\w+)/)?.[1];
    if (!nombre) continue;
    for (const [, encontrado] of bloque.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      if (encontrado.toLowerCase() === host) nombres.push(nombre);
    }
  }
  return [...new Set(nombres)];
}

/** Cada símbolo exportado por `lib/site.ts`, con el cuerpo de su bloque. */
function simbolosDeSite(): Map<string, string> {
  const texto = sinComentarios(readFileSync(SITE_TS, "utf8"));
  const bloques = new Map<string, string>();
  for (const bloque of texto.split(/^export /m).slice(1)) {
    const nombre = bloque.match(/^(?:const|function|async function)\s+(\w+)/)?.[1];
    if (nombre) bloques.set(nombre, bloque);
  }
  return bloques;
}

/**
 * Símbolos de `site.ts` que una página termina usando, siguiendo la cadena.
 *
 * El cierre transitivo NO es un lujo: `wa.me` lo arma `waLink()`, que ninguna
 * página llama directo — lo consumen `WA_URL` y `AGENDA_DEMO_URL`, y ESAS son
 * las que están en los botones. Mirando un solo salto, `waLink` parecía muerto
 * y el gate acusaba de huérfano al canal que atiende hoy. De paso, la
 * transitividad caza lo contrario: una constante muerta escondida detrás de dos
 * saltos, que un chequeo de un nivel daría por viva.
 */
function simbolosVivos(): Set<string> {
  const simbolos = simbolosDeSite();
  const vivos = new Set<string>();

  // Semilla: lo que menciona cualquier archivo de la superficie que no sea site.ts.
  const consumidores = superficieDeVenta().filter((archivo) => archivo !== SITE_TS);
  const textos = consumidores.map((archivo) => readFileSync(archivo, "utf8"));
  for (const nombre of simbolos.keys()) {
    const patron = new RegExp(`\\b${nombre}\\b`);
    if (textos.some((texto) => patron.test(texto))) vivos.add(nombre);
  }

  // Y todo lo que un símbolo vivo usa en su cuerpo, hasta que no crezca más.
  for (let creció = true; creció; ) {
    creció = false;
    for (const vivo of [...vivos]) {
      const cuerpo = simbolos.get(vivo) ?? "";
      for (const nombre of simbolos.keys()) {
        if (vivos.has(nombre) || nombre === vivo) continue;
        if (new RegExp(`\\b${nombre}\\b`).test(cuerpo)) {
          vivos.add(nombre);
          creció = true;
        }
      }
    }
  }
  return vivos;
}

/** ¿El host aparece escrito literal en algún archivo que no sea `site.ts`? */
function apareceFueraDeLasConstantes(host: string): boolean {
  return [...(hostsDeclarados().get(host) ?? [])].some(
    (relativo) => join(SRC, relativo) !== SITE_TS,
  );
}

describe("el sitio de venta no manda a nadie a un host que no servimos", () => {
  it("mira una superficie de verdad, no una carpeta vacía", () => {
    // Si el descubrimiento se rompe, todo lo de abajo pasa en verde sobre cero
    // archivos: el modo más silencioso que tiene un gate de morirse.
    expect(superficieDeVenta().length).toBeGreaterThan(10);
    expect(hostsDeclarados().size).toBeGreaterThan(2);
  });

  it("todo host enlazado está declarado y vivo", () => {
    const intrusos = [...hostsDeclarados()]
      .filter(([host]) => !(host in HOSTS_PERMITIDOS))
      .map(([host, archivos]) => `${host} (en ${[...archivos].join(", ")})`);

    expect(
      intrusos,
      `El sitio enlaza hosts que no declaramos servir:\n  ${intrusos.join("\n  ")}\n\n` +
        `Si el host está vivo, agregalo a HOSTS_PERMITIDOS con el motivo MEDIDO. ` +
        `Si no lo está, el lead que haga clic se pierde — y como un host caído ` +
        `suele redirigir en vez de dar 404, nadie se va a enterar.`,
    ).toEqual([]);
  });

  it("ninguna entrada de la lista está de más", () => {
    // El 2026-09-05 `dentalgest.app` llevaba meses acá, con el motivo «embudo
    // dental propio (DENTALGEST_URL)», y estaba MUERTO: 404 con
    // `x-vercel-error: DEPLOYMENT_NOT_FOUND`, un proyecto de Vercel borrado. Y
    // encima `DentalGest` es un nombre de pack retirado que `CLAUDE.md` prohíbe
    // nombrarle a un cliente.
    //
    // Sobrevivió porque el agujero está EXACTAMENTE ENTRE los dos gates de
    // enlaces, y cada uno tenía razón por separado:
    //   · éste (offline) lo daba por bueno porque estaba en la lista;
    //   · `scripts/enlaces-vivos.mjs` (con red) sigue los enlaces PUBLICADOS en
    //     las páginas, y ninguna página lo usaba, así que nunca lo visitó.
    // Un host permitido que nadie enlaza no lo mide NADIE, y no es inofensivo:
    // queda PRE-APROBADO. El día que alguien escriba `href={DENTALGEST_URL}`,
    // este gate le da verde y el lead cae en un 404 — el destino entra ya
    // bendecido, porque nadie audita una entrada que «ya estaba».
    //
    // Atarla al uso real cierra el hueco de los dos lados: una entrada huérfana
    // se pone roja acá, y como toda entrada que queda tiene un enlace vivo que
    // la usa, `enlaces-vivos.mjs` termina midiéndolas todas contra la red.
    //
    // ⚠️ Y NO alcanza con `hostsDeclarados()`: eso grepea el TEXTO de los
    // archivos, y `site.ts` es parte de la superficie porque las páginas lo
    // importan, así que una constante que nadie consume aparece igual y la
    // entrada pasa en verde. Medido acá mismo el 2026-09-05: la primera
    // versión de este test daba VERDE sobre `dentalgest.app`. Lo que distingue
    // un destino vivo de uno muerto es que su CONSTANTE tenga un consumidor.
    const vivos = simbolosVivos();
    const huerfanos = Object.keys(HOSTS_PERMITIDOS).filter((host) => {
      const simbolos = simbolosQueApuntanA(host);
      // Sin símbolo propio, el host está escrito literal en una página: es uso
      // directo (los enlaces al SIN viven así, dentro del copy).
      if (simbolos.length === 0) return !apareceFueraDeLasConstantes(host);
      return !simbolos.some((nombre) => vivos.has(nombre));
    });

    expect(
      huerfanos,
      `HOSTS_PERMITIDOS declara hosts que ninguna página enlaza:\n  ${huerfanos.join("\n  ")}\n\n` +
        `Una entrada sin uso no la mide nadie —este gate no sale a la red y ` +
        `enlaces-vivos.mjs sólo sigue lo publicado— y deja el destino ` +
        `pre-aprobado para el día que alguien lo cablee. Si el host ya no se ` +
        `usa, borrá la entrada Y la constante que la apuntaba.`,
    ).toEqual([]);
  });

  it("ningún subdominio nuestro que no publiquemos", () => {
    // El caso exacto de `cal.onia.com.bo`: un subdominio propio da la
    // impresión de ser seguro, resuelve a nuestra IP y contesta algo. Sólo
    // publicamos dos hosts, y esta regla lo dice en voz alta.
    const propios = [...hostsDeclarados().keys()].filter((h) => h.endsWith("onia.com.bo"));
    const publicados = ["onia.com.bo", "app.onia.com.bo"];
    expect(
      propios.filter((h) => !publicados.includes(h)),
      `Hay enlaces a subdominios de onia.com.bo que no publicamos. Resuelven a ` +
        `nuestra IP y contestan 200 tras un redirect, así que ninguna herramienta ` +
        `los ve rotos: el lead termina en otra página sin que nadie lo note.`,
    ).toEqual([]);
  });
});
