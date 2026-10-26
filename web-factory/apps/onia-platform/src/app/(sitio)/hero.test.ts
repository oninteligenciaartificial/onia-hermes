import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El hero de la portada NO lleva capturas del sistema.
 *
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". El hero que aprobó ese día dibuja el día
 * del negocio con divs y color — cero imagen, cero SVG, cero sombra.
 *
 * El guard existe porque la tentación es exactamente la contraria: la columna
 * derecha del hero fue una captura del panel durante toda la v3, y todos los
 * demás bloques de la página siguen usando <Shape src=...>. Copiar el patrón de
 * al lado es el error que va a pasar, y un `grep` a mano no lo va a atrapar
 * seis meses después.
 *
 * Se mira la SECCIÓN, no el archivo: el resto de la portada sí lleva capturas
 * reales y eso está bien. Los comentarios numerados (`1 · HERO`, `2 · BANDA`)
 * son la estructura del archivo y sirven de ancla.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const PORTADA = readFileSync(join(AQUI, "page.tsx"), "utf8");
const CSS = readFileSync(join(AQUI, "sitio.module.css"), "utf8");

function seccionHero(src: string): string {
  const desde = src.indexOf("{/* 1 · HERO");
  const hasta = src.indexOf("{/* 2 ·", desde + 1);
  return src.slice(desde, hasta);
}

/**
 * La sección SIN sus comentarios: lo que un lead ve, no lo que la próxima
 * sesión lee.
 *
 * Existe porque el guard de abajo prohíbe nombrar al asistente en el hero, y
 * el comentario que explica POR QUÉ salió lo nombra cinco veces. Sin esto, el
 * gate obliga a borrar la historia del defecto para pasar en verde — la misma
 * trampa que el barrido de palabras clave de Lucía encontró el 2026-09-04: un
 * gate que no separa la pieza de la prosa hace reescribir la bitácora.
 */
function copyHero(src: string): string {
  return seccionHero(src)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ");
}

describe("el hero de la portada se DIBUJA, no se captura", () => {
  it("encuentra la sección del hero", () => {
    const hero = seccionHero(PORTADA);
    expect(hero.length).toBeGreaterThan(500);
    // el titular vigente: si esto no está, el ancla apunta a otra cosa
    expect(hero).toContain("en <em>una</em> pantalla");
  });

  it.each([
    ["<img", /<img\b/],
    ["<svg", /<svg\b/],
    ["<video", /<video\b/],
    ["<Shape", /<Shape\b/],
    ["background-image", /background-image/],
    ["url(", /\burl\(/],
  ])("no usa %s", (que, patron) => {
    expect(seccionHero(PORTADA), `el hero volvió a usar ${que}`).not.toMatch(
      patron,
    );
  });

  /**
   * La OFERTA es el sistema de gestión; el asistente es un add-on de
   * `lib/pricing.ts` y NUNCA el titular (CLAUDE.md §3, Sergio 2026-09-03:
   * "el sistema no ofrece directamente el bot, ofrece solo el sistema").
   *
   * El hero anterior lo desobedecía entero y nadie lo veía: kicker "Un negocio
   * abre 9 horas", el gráfico grande era el día partido en 9/15 —la escena que
   * hace el asistente, no el plan— y cerraba con "El asistente es la puerta".
   * El add-on de Bs 390 era el argumento y el sistema de Bs 320 el relleno.
   *
   * Se mira la PRIMERA PANTALLA, no la página: el asistente sigue teniendo su
   * sección propia más abajo (6 · CHATBOT), que es donde le toca vender.
   */
  it("el titular vende el SISTEMA, no el asistente", () => {
    const copy = copyHero(PORTADA);
    // el ancla, ya sin comentarios: si esto falla, el filtro se comió el JSX
    expect(copy).toContain("en <em>una</em> pantalla");
    expect(copy, "el hero volvió a titular con el add-on").not.toMatch(
      /asistente|chatbot|\bbot\b|recepcionista/i,
    );
  });

  /**
   * El <head> dice lo mismo que el hero, y por eso se vigila igual.
   *
   * No es simetría de estilo: el título de la pestaña, el snippet de Google y
   * la tarjeta que se ve al compartir el link por WhatsApp son superficie de
   * cliente que NINGUNA captura mira (medido el 2026-09-03 en /terminos: el
   * cartel de borrador se sacó de la pantalla y la meta description lo siguió
   * anunciando). Probando este mismo guard se inyectó "El asistente contesta"
   * en `OG_TITULO` creyendo que iba al h1, y los doce tests pasaron en verde
   * con el bot de titular en lo primero que ve un lead por WhatsApp.
   */
  it("la pestaña, el buscador y el link compartido tampoco titulan con el add-on", () => {
    // sin comentarios, por lo mismo que `copyHero`: el JSDoc de `ADDONS_RESTO`
    // cae dentro del tramo y nombra al chatbot cuatro veces
    const head = PORTADA.slice(
      PORTADA.indexOf("const DESDE_MES"),
      PORTADA.indexOf("const JSON_LD"),
    ).replace(/\/\*[\s\S]*?\*\//g, " ");
    expect(head.length).toBeGreaterThan(300);
    expect(head).toContain("Todo el negocio");
    expect(head, "el <head> volvió a vender el asistente").not.toMatch(
      /asistente|chatbot|\bbot\b|recepcionista/i,
    );
    // Y el precio también acá sale de la fuente, no tipeado — con el MISMO
    // criterio que el hero cuatro tests más abajo: derivado del piso de la
    // escalera, no de un id escrito a mano. Hasta el 2026-09-26 esta línea
    // exigía el literal `plan("basico").mensual`, o sea que un gate estaba
    // DEFENDIENDO el defecto que su propio vecino ya había curado: la cura del
    // 2026-09-19 llegó al hero y no a su `<head>`, que es la mitad que se ve
    // antes de abrir el sitio.
    expect(head).toMatch(/PLAN_DE_ENTRADA\.mensual/);
    expect(head).not.toMatch(/plan\(\s*"[a-z]+"\s*\)\.mensual/);
  });

  /**
   * El precio de entrada está en la primera pantalla y sale de la FUENTE.
   *
   * Es la mitad que faltaba del punto anterior: sacar al bot del titular sin
   * poner qué se compra deja un hero que no vende nada. Lety y Dapta, miradas
   * el 2026-09-03, ponen las dos un precio o un "empezá gratis" arriba.
   *
   * Interpolado, nunca tipeado: `precios.test.ts` prohíbe el literal en toda
   * la app, y acá se exige además que el hero SÍ traiga el número.
   *
   * Y el plan tampoco se tipea. Acá se exigía `plan("basico").mensual`, que es
   * el mismo defecto un escalón más adentro: la escalera C metió el Crece entre
   * Básico y Pro el 2026-09-12, y un id escrito a mano sobrevive a eso
   * compilando y anunciando el plan equivocado. Desde el 2026-09-19 el hero
   * deriva el plan de entrada del PRECIO (`planDeEntrada`, lib/pricing.ts) —
   * y no es cosmético: ese mismo valor es el que decide qué módulos dibuja el
   * panel de abajo, así que la línea y el dibujo no pueden discrepar, que es
   * justo lo que estaban haciendo.
   */
  it("el hero publica el precio de entrada, derivado de lib/pricing", () => {
    const hero = seccionHero(PORTADA);
    expect(hero).toMatch(/PLAN_DE_ENTRADA\.mensual/);
    expect(hero).not.toMatch(/plan\(\s*"[a-z]+"\s*\)\.mensual/);
    expect(PORTADA).toMatch(/const\s+PLAN_DE_ENTRADA\s*=\s*planDeEntrada\(\)/);
    expect(hero).toMatch(/PRUEBA\.dias/);
  });

  /**
   * La banda del día (9 h / 15 h) es el argumento del ASISTENTE, así que vive
   * en su sección y no en la portada de la oferta. Si vuelve al hero, vuelve
   * el problema entero: es la pieza más grande de la primera pantalla.
   *
   * ⚠️ Los dos guards de abajo citaban `s.day` y `repeat(24, minmax(0, 1fr))`.
   * El 11-sep la banda se rehizo —los slabs con cuadraditos salieron, entró la
   * línea del día con una barra flex— y esa clase dejó de existir: la primera
   * mitad del guard pasó a cumplirse sola (nadie puede poner una clase que no
   * está en la hoja) y la otra mitad quedó ROJA en `main`, trabando el merge de
   * todos los carriles. Un guard anclado al NOMBRE de la implementación muere
   * así: o se apaga en silencio, o acusa al producto por cambiar.
   *
   * Ahora se ancla a la PROPIEDAD (dónde vive la barra, y que dibuje las horas
   * en proporción), y lo primero que pregunta es si la clase que vigila sigue
   * existiendo — para que el próximo rediseño lo deje rojo diciendo qué pasó.
   */
  it("la portada corta conserva cinco bloques y deriva al detalle del chatbot", () => {
    expect(PORTADA.match(/<Block\s/g)).toHaveLength(5);
    expect(PORTADA).not.toMatch(/className=\{s\.diaBarra\}/);
    expect(PORTADA).toContain('href: "/chatbot"');
  });

  it("los agentes no mandan nada solos", () => {
    // onia-core/contract.json:838 y app/api/cron/onia-agents/route.ts: todo lo
    // que contacta a un cliente queda en la cola de aprobación. Tres
    // diseñadores prometieron lo contrario acá antes de que existiera el guard.
    const tareas = PORTADA.slice(
      PORTADA.indexOf("const TAREAS"),
      PORTADA.indexOf("export default function Portada"),
    );
    expect(tareas).toContain("Vos aprobás cada envío");
    expect(tareas).toMatch(/primerPlanCon\("agentes"\)/);
    expect(tareas).not.toMatch(
      /te avisa|manda sol|env[ií]a sol|cobra sol|autom[áa]ticamente/i,
    );
  });
});

/**
 * La IMAGEN de la tarjeta dice lo mismo que el `<head>` que la acompaña.
 *
 * Es el eslabón que el barrido del 2026-09-04 no alcanzó, y el más caro de los
 * tres: el hero cambió, `TITULO`/`DESCRIPCION`/`OG_*` cambiaron con él, y
 * `tarjeta-social.tsx` se quedó con el hero ANTERIOR entero —"Cerrás vos / El
 * negocio no", "Un negocio abre 9 horas. Onia atiende las otras 15" y la banda
 * del día partida en 9/15, que es justo la pieza que `hero.test.ts` acababa de
 * echar de la portada por ser el argumento del add-on—. La tarjeta quedaba
 * contradiciéndose sola: el título ofrecía el sistema y el dibujo, que pesa
 * más y se ve primero, seguía vendiendo al asistente.
 *
 * Duele acá más que en la página porque se ve ANTES de que el sitio cargue, y
 * al que nunca abre el link es lo ÚNICO que ve: es el canal por el que Sergio
 * manda onia.com.bo a un lead. Ninguna captura del sitio la mira y `curl` a la
 * ruta tampoco —`forma.test.ts` sólo exige que la tarjeta EXISTA, no qué dice—,
 * así que el defecto no tenía un solo instrumento encima.
 *
 * Se vigila el copy, no el dibujo: qué promete, no cómo se ve.
 */
describe("la tarjeta que se ve al compartir el link vende lo mismo que el head", () => {
  const TARJETA = readFileSync(join(AQUI, "tarjeta-social.tsx"), "utf8");

  /** Sin comentarios: la bitácora de arriba nombra el defecto que explica. */
  const copy = TARJETA.replace(/\/\*[\s\S]*?\*\//g, " ");

  it("no titula con el add-on ni con su escena", () => {
    expect(copy, "la tarjeta volvió a vender el asistente").not.toMatch(
      /asistente|chatbot|\bbot\b|recepcionista|atiende las otras|abre 9 horas/i,
    );
  });

  it("dice el titular vigente, el mismo del h1", () => {
    expect(copy).toMatch(/Todo el negocio/);
    expect(copy).toMatch(/en una pantalla/i);
  });

  it("el precio de la tarjeta sale de la fuente, no tipeado", () => {
    // mismo criterio que el hero: si la tarjeta publica un número, lo lee de
    // lib/pricing.ts. Una cifra a mano acá se comparte por WhatsApp durante
    // meses sin que ninguna pantalla la muestre.
    //
    // Y lee el PISO de la escalera, no un id tipeado. Acá es donde más caro
    // sale equivocarse: el número va horneado en píxeles y las 24 superficies
    // de venta comparten esta única imagen (medido el 2026-09-26: mismo md5 en
    // las 24). Un monto dentro de un PNG no lo ve ningún grep ni ningún
    // barrido de HTML — ni el propio `precios:vivos`, que sale verde igual.
    expect(copy).toMatch(/planDeEntrada\(\)\.mensual/);
    expect(copy).not.toMatch(/plan\(\s*"[a-z]+"\s*\)\.mensual/);
  });

  it("sigue dibujada: cero captura, como el hero", () => {
    expect(copy).not.toMatch(/<img\b/);
    expect(copy).not.toMatch(/backgroundImage/);
  });

  it("el alt describe lo que la tarjeta dibuja hoy", () => {
    // el alt es la versión en texto de la misma promesa: si queda viejo, el
    // lector de pantalla y el buscador leen el hero anterior.
    const alt = /export const alt =\s*([\s\S]*?);/.exec(TARJETA)?.[1] ?? "";
    expect(alt).toMatch(/Todo el negocio/);
    expect(alt).not.toMatch(/atiende las otras|abre 9 horas|asistente/i);
  });
});
