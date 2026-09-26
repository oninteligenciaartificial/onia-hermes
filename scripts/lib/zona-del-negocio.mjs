// ONIA — La zona horaria con la que se MIRA una pantalla del producto.
//
// EL BUG QUE CIERRA (medido el 2026-09-26 en /inbox de produccion): `mirar_bandeja_dueno.mjs`
// abria el navegador sin `timezoneId`, asi que Playwright heredaba la zona del PROCESO — UTC en
// el VPS y en nodo-casa. La misma bandeja, el mismo mensaje, la misma corrida:
//
//     sin zona fijada        →  "Sonda QA carril chatbot   10:16 p.m."
//     TZ=America/La_Paz      →  "Sonda QA carril chatbot   06:16 p.m."
//
// Las pantallas que muestran hora son `"use client"` (InboxClient.tsx:61 formatea con
// `toLocaleTimeString` sin `timeZone`), o sea que el PRODUCTO esta sano: formatea con la zona
// del navegador del cliente, y un dueno en Bolivia ve bien. El que mentia era el instrumento.
//
// POR QUE IMPORTA MAS DE LO QUE PARECE — falla en las dos direcciones:
//   1. Falso POSITIVO: un carril mira la captura, ve una hora de noche que no ocurrio y reporta
//      un bug de zona horaria que no existe. Casi se escribe hoy. Es el mismo modo de fallo que
//      el canario visual, que gasto TRES dias reportando texto roto que era su rasterizador.
//   2. Falso NEGATIVO, que es peor: el corrimiento es CONSISTENTE, asi que un bug real de horas
//      queda tapado — todo se ve corrido por igual y nada canta.
//   3. Y cruzando la medianoche UTC la captura muestra el DIA siguiente: entre las 20:00 y las
//      24:00 de La Paz, "hoy" y "manana" se invierten en pantalla. Ahi no es una hora rara: es
//      una fecha que contradice al calendario del que mira.
//
// POR QUE NO UNA CONSTANTE PELADA: el producto guarda la zona POR NEGOCIO
// (`clinicSettings.timezone`, cascada con default). Clavar 'America/La_Paz' en el instrumento
// haria que mirar el panel de un negocio de otra zona vuelva a mentir, y esta vez sin aviso.
// Se lee la del negocio que se esta mirando; el default es el ultimo escalon, no el primero.
//
// TRI-ESTADO A PROPOSITO: devuelve de donde salio la zona (`fuente`). "No pude preguntarle a la
// base" y "la base dice La Paz" NO son lo mismo, y aplanarlos a la misma cadena es como nacen
// los verdes falsos. Lo que nunca devuelve es vacio: sin zona, Playwright hereda UTC y volvemos
// al bug. El default es explicito y se IMPRIME.

export const ZONA_POR_DEFECTO = "America/La_Paz";

/**
 * Valida una zona IANA preguntandole a `Intl`, que es quien la va a usar. No hay lista blanca:
 * una lista se queda vieja y rechaza zonas validas. Si `Intl` la acepta, Playwright tambien.
 */
export function zonaValida(raw) {
  const s = String(raw || "").trim();
  if (!s) return false;
  try {
    new Intl.DateTimeFormat("es-BO", { timeZone: s });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resuelve la zona con la que hay que abrir el navegador.
 *
 * `raw` es lo que dijo la base (o `null`/`undefined` si no se pudo preguntar). Devuelve SIEMPRE
 * una zona usable y la fuente de donde salio:
 *   - `negocio`     la base contesto y la zona es valida
 *   - `defecto`     la base contesto vacio, o no se pudo preguntar
 *   - `invalida`    la base contesto algo que `Intl` rechaza (dato roto: se avisa, no se calla)
 */
export function resolverZona(raw, { defecto = ZONA_POR_DEFECTO } = {}) {
  const s = raw == null ? "" : String(raw).trim();
  if (!s) return { zona: defecto, fuente: "defecto", crudo: null };
  if (!zonaValida(s)) return { zona: defecto, fuente: "invalida", crudo: s };
  return { zona: s, fuente: "negocio", crudo: s };
}

/**
 * Le pregunta a produccion la zona del negocio al que pertenece `email`.
 *
 * `psql` se INYECTA (lo trae `sesion_dueno.mjs`) para que este modulo siga siendo probable sin
 * base y sin docker: el gate de arriba corre en cualquier maquina.
 *
 * Tolerante por contrato: no tira NUNCA. Si la base no contesta, devuelve `null` y el llamador
 * cae al defecto — un instrumento de mirar no puede quedarse sin abrir la pantalla porque no
 * pudo resolver una zona horaria.
 */
export function leerZonaDelNegocio(email, psql) {
  if (typeof psql !== "function" || !email) return null;
  const limpio = String(email).replace(/'/g, "''");
  try {
    const salida = psql(
      "select coalesce(cs.timezone, '') from public.profiles p " +
        'join public.clinic_settings cs on cs."organizationId" = p."organizationId" ' +
        `where p.email = '${limpio}' limit 1`
    );
    return String(salida || "").trim() || null;
  } catch {
    return null;
  }
}

/** Resuelve de punta a punta: pregunta a la base y deja lista la zona para `newContext`. */
export function zonaParaMirar(email, psql, { defecto = ZONA_POR_DEFECTO } = {}) {
  return resolverZona(leerZonaDelNegocio(email, psql), { defecto });
}

/** Una linea para el log del instrumento. Que se lea sin saber que es un tri-estado. */
export function describirZona({ zona, fuente, crudo }) {
  if (fuente === "negocio") return `zona: ${zona} (del negocio)`;
  if (fuente === "invalida")
    return `zona: ${zona} (POR DEFECTO — la base dice "${crudo}" y no es una zona valida)`;
  return `zona: ${zona} (por defecto — la base no dio una)`;
}
