import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio de venta sólo manda al lead a hosts que existen.
 *
 * El 2026-09-03, siguiendo a mano cada enlace que SALE del sitio, los dos
 * botones grandes de `/contacto` —«Agendar 20 minutos» y «Agendar la demo»,
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
  "dentalgest.app": "embudo dental propio (DENTALGEST_URL)",
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

/** Cada host absoluto que aparece en la superficie, con los archivos donde está. */
function hostsDeclarados(): Map<string, Set<string>> {
  const encontrados = new Map<string, Set<string>>();
  for (const archivo of superficieDeVenta()) {
    const texto = readFileSync(archivo, "utf8");
    for (const [, host] of texto.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      const clave = host.toLowerCase();
      if (!encontrados.has(clave)) encontrados.set(clave, new Set());
      encontrados.get(clave)!.add(archivo.slice(SRC.length + 1));
    }
  }
  return encontrados;
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
