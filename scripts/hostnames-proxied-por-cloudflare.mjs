#!/usr/bin/env node
// ¿Cerrar ufw a los rangos de Cloudflare corta algún hostname MUDO?
//
// La tarea t_9d970ada quiere cerrar 80/443 del VPS a los rangos publicados de
// Cloudflare, para que nadie pueda saltarse el rate limit pegándole a la IP directa
// (sin `CF-Connecting-IP` todos comparten un balde y el header es spoofeable).
//
// El riesgo NO es el `ufw` en sí: es que un hostname que NO pasa por Cloudflare
// resuelve directo al VPS, y cerrar el puerto lo corta **sin un solo error visible**
// — el cliente ve un timeout y Traefik nunca se enteró de que alguien lo buscaba.
// Por eso la tarea exige comprobar los hostnames UNO POR UNO antes de tocar nada.
//
// Este archivo existe para que esa comprobación NO sea un dato heredado. El cierre
// va en la ventana 23:00-06:00 La Paz, o sea horas después de medirlo: una lista
// pegada en un comentario ya nació vieja, y este repo ya pagó caro obedecer
// mediciones vencidas. Acá se DERIVA todo al ejecutarse:
//
//   - los hostnames, de la API VIVA de Traefik (los 37 routers), no de un `.yaml`.
//     Medido el 2026-09-26: el `grep` del archivo se comía los que EasyPanel genera
//     dinámicamente Y traía basura (`WEBHOOK_URL=https://...` es una env var metida
//     en una regla, no un hostname). El cuerpo de la tarea listaba `onia-mail`,
//     `onia-center` y `onia-entregas`: ninguno de los tres tiene router hoy.
//   - los rangos, de `cloudflare.com/ips-v4` y `-v6` en vivo. Cloudflare los cambia;
//     una copia en el repo es la próxima medición vencida.
//
// TRI-ESTADO, y acá es donde se gana o se pierde: «no pude preguntar» NO es «me
// dijeron que está proxied». Un falso verde acá se paga apagando un servicio a las
// tres de la mañana, que es exactamente el modo de falla que la tarea quiere evitar.
//
//   exit 0 = todos proxied: cerrar ufw no corta nada
//   exit 1 = hay al menos uno DIRECTO: cerrarlo lo apaga MUDO
//   exit 2 = NO MEDIDO: algo no contestó, y por lo tanto no se cierra nada

import { spawnSync } from "node:child_process";
import dns from "node:dns/promises";
import { SSH_ARGS, VPS } from "./lib/vps-o-local.mjs";

const TRAEFIK_API = "http://127.0.0.1:8080/api/http/routers";

/**
 * Un hostname de verdad. El filtro no es cosmético: la regla
 * `Host(`WEBHOOK_URL=https://n8n-...`)` existe HOY en producción, y contarla como
 * hostname la manda a resolver, falla, y ensucia el veredicto con un `NO MEDIDO`
 * que no es de nadie — tapando el único estado que importa.
 */
export function esHostnameReal(h) {
  if (typeof h !== "string" || h.length === 0) return false;
  if (/[=\s]/.test(h)) return false;
  if (h.includes("://")) return false;
  if (h.startsWith(".") || h.endsWith(".")) return false;
  return h.includes(".");
}

/** Los hostnames de TODAS las reglas de router, sin repetir. */
export function hostnamesDeRouters(routers) {
  const hosts = new Set();
  for (const r of routers ?? []) {
    for (const m of String(r?.rule ?? "").matchAll(/Host\(`([^`]+)`\)/g)) {
      if (esHostnameReal(m[1])) hosts.add(m[1]);
    }
  }
  return [...hosts].sort();
}

// ---------------------------------------------------------------------------
// CIDR. Se hace a mano para no meter una dependencia por esto, y en BigInt para
// que v4 y v6 compartan un solo camino: dos implementaciones es una que nadie mira.
// ---------------------------------------------------------------------------

/** `null` = no es una IP que sepa leer (NO MEDIDO, nunca «no está en rango»). */
export function ipANumero(ip) {
  if (typeof ip !== "string") return null;

  if (ip.includes(":")) {
    const [izq, der] = ip.split("::");
    const a = izq ? izq.split(":").filter(Boolean) : [];
    const b = der ? der.split(":").filter(Boolean) : [];
    if (a.length + b.length > 8) return null;
    const ceros = new Array(8 - a.length - b.length).fill("0");
    const partes = ip.includes("::") ? [...a, ...ceros, ...b] : ip.split(":");
    if (partes.length !== 8) return null;
    let n = 0n;
    for (const p of partes) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(p)) return null;
      n = (n << 16n) | BigInt(parseInt(p, 16));
    }
    return { n, bits: 128 };
  }

  const octetos = ip.split(".");
  if (octetos.length !== 4) return null;
  let n = 0n;
  for (const o of octetos) {
    if (!/^\d{1,3}$/.test(o)) return null;
    const v = Number(o);
    if (v > 255) return null;
    n = (n << 8n) | BigInt(v);
  }
  return { n, bits: 32 };
}

/** `null` = no pude leer el CIDR. */
export function enCidr(ip, cidr) {
  const [red, prefijoTxt] = String(cidr).split("/");
  const prefijo = Number(prefijoTxt);
  const a = ipANumero(ip);
  const b = ipANumero(red);
  if (!a || !b || !Number.isInteger(prefijo)) return null;
  if (a.bits !== b.bits || prefijo < 0 || prefijo > a.bits) return null;
  const mascara = ((1n << BigInt(prefijo)) - 1n) << BigInt(a.bits - prefijo);
  return (a.n & mascara) === (b.n & mascara);
}

/**
 * Clasifica un hostname ya resuelto.
 *
 * Sin IPs no se responde «directo»: se responde NO MEDIDO. Un hostname que no
 * resuelve puede ser uno que ya no existe (inofensivo) o un DNS que falló justo
 * ahora (y entonces sigue vivo y se va a cortar).
 */
export function clasificar(ips, rangos) {
  if (!Array.isArray(ips) || ips.length === 0) {
    return { estado: "NO_MEDIDO", motivo: "no resolvió a ninguna IP" };
  }
  if (!Array.isArray(rangos) || rangos.length === 0) {
    return { estado: "NO_MEDIDO", motivo: "no tengo los rangos de Cloudflare" };
  }

  const fuera = [];
  for (const ip of ips) {
    let dentro = false;
    let leible = false;
    for (const c of rangos) {
      const r = enCidr(ip, c);
      if (r === null) continue;
      leible = true;
      if (r) {
        dentro = true;
        break;
      }
    }
    if (!leible) return { estado: "NO_MEDIDO", motivo: `no pude leer la IP ${ip}` };
    if (!dentro) fuera.push(ip);
  }

  if (fuera.length > 0) {
    return { estado: "DIRECTO", motivo: `resuelve fuera de Cloudflare: ${fuera.join(", ")}` };
  }
  return { estado: "PROXIED", motivo: `${ips.length} IP(s), todas de Cloudflare` };
}

// ---------------------------------------------------------------------------
// Qué se PUEDE hacer con un DIRECTO. Nombrarlo no alcanza: el consejo equivocado
// se ejecuta a las tres de la mañana.
//
// `ufw` decide con (puerto destino, IP de origen). El hostname es capa 7 y `ufw`
// NO lo ve: medido el 2026-09-26, sus seis reglas son `22|80|443/tcp ALLOW IN
// Anywhere` y los cuatro `*.hqdqgh.easypanel.host` resuelven a 187.77.16.63 — la
// misma IP y el mismo puerto 443 que `app.onia.com.bo`. Por lo tanto **no existe
// una excepción de ufw por hostname**: dejar 443 abierto para que siga entrando
// EasyPanel lo deja abierto para cualquiera que conozca la IP, que es exactamente
// el agujero que el cierre venía a tapar (sin `CF-Connecting-IP` todos comparten
// un balde de rate limit y el header es spoofeable).
//
// El único remedio real de un DIRECTO es que empiece a entrar por Cloudflare, y
// eso sólo se puede cuando la zona está en NUESTRA cuenta. Eso no se hardcodea:
// se DERIVA de la propia medición — si otro hostname de la misma zona ya resuelve
// a Cloudflare, ahí está la prueba viva de que la zona es administrable. Si mañana
// alguien mete EasyPanel detrás de nuestro Cloudflare, esto lo nota solo.
// ---------------------------------------------------------------------------

/** `null` si no tiene padre (un apex de dos labels no es zona de nadie acá). */
export function padreInmediato(host) {
  const labels = String(host ?? "").split(".").filter(Boolean);
  if (labels.length < 3) return null;
  return labels.slice(1).join(".");
}

/**
 * Las zonas con PRUEBA de estar en nuestro Cloudflare: las que tienen **al menos
 * dos hostnames PROXIED hermanos**.
 *
 * El «dos» no es cosmético y lo cazó su propio caso de prueba. Sin una Public
 * Suffix List no se puede distinguir un apex de un subdominio por la cantidad de
 * labels: `onia.com.bo` (apex) y `hqdqgh.easypanel.host` (subdominio) tienen tres
 * los dos. Con un solo hijo alcanzaba, el apex `onia.com.bo` aportaba su padre
 * `com.bo` como «zona nuestra», y cualquier `x.com.bo` ajeno pasaba por
 * administrable. Dos hermanos proxied en la misma zona sí son prueba de que la
 * zona es nuestra y no un sufijo público por casualidad.
 *
 * Falla CERRADO a propósito: con un solo hostname proxied no se declara ninguna
 * zona, así que el remedio sale «no puedo probarlo» en vez de autorizar un cierre.
 * Acá equivocarse apaga servicios a las tres de la mañana.
 */
export function zonasConPruebaDeCloudflare(filas) {
  const hijosPorZona = new Map();
  for (const f of filas ?? []) {
    if (f?.estado !== "PROXIED") continue;
    const padre = padreInmediato(f.host);
    if (!padre) continue;
    if (!hijosPorZona.has(padre)) hijosPorZona.set(padre, new Set());
    hijosPorZona.get(padre).add(f.host);
  }
  return new Set([...hijosPorZona].filter(([, hijos]) => hijos.size >= 2).map(([z]) => z));
}

export function remedioDelDirecto(host, zonas) {
  const z = zonas instanceof Set ? zonas : new Set(zonas ?? []);
  const padre = padreInmediato(host);
  if ((padre && z.has(padre)) || z.has(String(host))) {
    return {
      remedio: "DNS_PROXIED",
      nota: `zona ${padre ?? host} ya tiene hostnames en nuestro Cloudflare: se arregla poniendo el DNS en proxied`,
    };
  }
  return {
    remedio: "SIN_REMEDIO_EN_UFW",
    nota: "dominio ajeno (ningún hostname de su zona pasa por nuestro Cloudflare): no se puede proxiar NI exceptuar por hostname",
  };
}

/**
 * El consejo que va a leer la vuelta que abra la ventana 23:00-06:00. Es una
 * función y no un `console.log` para que el self-check lo pueda medir: la versión
 * anterior decía «ponerlos detrás de Cloudflare o exceptuarlos», y esa segunda
 * salida no existe.
 */
export function consejoParaDirectos(directos, zonas) {
  const lineas = [];
  const conDns = directos.filter((f) => remedioDelDirecto(f.host, zonas).remedio === "DNS_PROXIED");
  const sinRemedio = directos.filter(
    (f) => remedioDelDirecto(f.host, zonas).remedio === "SIN_REMEDIO_EN_UFW",
  );

  lineas.push("🔴 Cerrar 80/443 a los rangos de Cloudflare APAGA los de arriba, y sin un error visible.");

  if (conDns.length > 0) {
    lineas.push(
      `Se arreglan poniendo el DNS en proxied (${conDns.length}): ${conDns.map((f) => f.host).join(", ")}`,
    );
    lineas.push("  Antes de proxiarlos, comprobar que el servicio de atrás aguante el proxy, y volver a medir acá.");
  }

  if (sinRemedio.length > 0) {
    lineas.push(
      `SIN remedio por DNS (${sinRemedio.length}, dominio ajeno): ${sinRemedio.map((f) => f.host).join(", ")}`,
    );
    lineas.push(
      "  Y NO se arregla con una excepción de ufw: ufw filtra por puerto e IP de origen, no ve el hostname.",
    );
    lineas.push(
      "  Dejar 443 abierto para que sigan entrando lo deja abierto para cualquiera que conozca la IP: el agujero queda ENTERO, no reducido.",
    );
    lineas.push(
      "  Salidas que sí existen: mover el servicio a un hostname de zona propia, o permitir 443 sólo desde IPs de origen conocidas, o aceptar perder ese acceso por HTTPS y entrar por túnel SSH.",
    );
  }

  return lineas;
}

// ---------------------------------------------------------------------------
// Las tres preguntas al mundo. Cada una devuelve `null` cuando no pudo preguntar.
// ---------------------------------------------------------------------------

function correrEnVps(comando) {
  const r = spawnSync("ssh", [...SSH_ARGS, VPS, comando], {
    encoding: "utf8",
    timeout: 120_000,
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout;
}

/** Los routers vivos de Traefik. Local si este nodo es el VPS, por SSH si no. */
export function routersVivos({ correr = correrEnVps } = {}) {
  const cmd =
    'C=$(docker ps --format "{{.Names}}" | grep -i traefik | head -1); ' +
    `[ -n "$C" ] && docker exec "$C" wget -qO- ${TRAEFIK_API}`;
  const salida = correr(cmd);
  if (salida === null) return null;
  try {
    const j = JSON.parse(salida);
    return Array.isArray(j) ? j : null;
  } catch {
    return null;
  }
}

/** Los rangos publicados de Cloudflare, en vivo. */
export function rangosDeCloudflare({ bajar = bajarConCurl } = {}) {
  const v4 = bajar("https://www.cloudflare.com/ips-v4");
  const v6 = bajar("https://www.cloudflare.com/ips-v6");
  if (v4 === null || v6 === null) return null;
  const rangos = [...String(v4).split("\n"), ...String(v6).split("\n")]
    .map((l) => l.trim())
    .filter((l) => l.includes("/"));
  return rangos.length > 0 ? rangos : null;
}

function bajarConCurl(url) {
  // `curl` y no `fetch`: en nodo-casa, Node >=20 corta cada intento de conexión a
  // 250 ms y devuelve ETIMEDOUT sobre hosts vivos, mientras curl da 200.
  const r = spawnSync("curl", ["-sS", "--max-time", "25", url], {
    encoding: "utf8",
    timeout: 40_000,
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout;
}

async function resolver(host) {
  const ips = [];
  for (const fn of [dns.resolve4, dns.resolve6]) {
    try {
      ips.push(...(await fn.call(dns, host)));
    } catch {
      /* una familia que no existe no es un fallo: v6 falta en muchos hostnames */
    }
  }
  return ips;
}

// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const ok = (que, cond) => casos.push([que, cond]);

  ok("basura de env var NO es hostname", !esHostnameReal("WEBHOOK_URL=https://n8n.x.host"));
  ok("hostname con espacio se descarta", !esHostnameReal("app.onia.com.bo "));
  ok("hostname sin punto se descarta", !esHostnameReal("localhost"));
  ok("hostname real pasa", esHostnameReal("app.onia.com.bo"));

  ok(
    "deriva hostnames de las reglas y descarta la basura",
    JSON.stringify(
      hostnamesDeRouters([
        { rule: "Host(`app.onia.com.bo`) && PathPrefix(`/x`)" },
        { rule: "Host(`WEBHOOK_URL=https://n8n.x.host`)" },
        { rule: "Host(`a.onia.com.bo`) || Host(`b.onia.com.bo`)" },
        { rule: "PathPrefix(`/.well-known/`)" },
      ]),
    ) === JSON.stringify(["a.onia.com.bo", "app.onia.com.bo", "b.onia.com.bo"]),
  );

  ok("v4 dentro del rango", enCidr("104.16.1.1", "104.16.0.0/13") === true);
  ok("v4 fuera del rango", enCidr("187.77.16.63", "104.16.0.0/13") === false);
  ok("la IP del VPS no está en ningún rango v4 de CF", enCidr("187.77.16.63", "172.64.0.0/13") === false);
  ok("v6 dentro del rango", enCidr("2606:4700::1", "2606:4700::/32") === true);
  ok("v6 fuera del rango", enCidr("2001:db8::1", "2606:4700::/32") === false);
  ok("prefijo /32 exacto en v4", enCidr("1.2.3.4", "1.2.3.4/32") === true);
  ok("basura de CIDR devuelve null, no false", enCidr("1.2.3.4", "no-es-cidr") === null);
  ok("IP basura devuelve null, no false", enCidr("no-es-ip", "104.16.0.0/13") === null);
  ok("no se mezclan familias", enCidr("1.2.3.4", "2606:4700::/32") === null);

  const CF = ["104.16.0.0/13", "2606:4700::/32"];
  ok("todas en CF -> PROXIED", clasificar(["104.16.1.1", "2606:4700::1"], CF).estado === "PROXIED");
  ok("una fuera -> DIRECTO", clasificar(["104.16.1.1", "187.77.16.63"], CF).estado === "DIRECTO");
  ok("la IP pelada del VPS -> DIRECTO", clasificar(["187.77.16.63"], CF).estado === "DIRECTO");
  ok("sin IPs -> NO MEDIDO, no DIRECTO", clasificar([], CF).estado === "NO_MEDIDO");
  ok("sin rangos -> NO MEDIDO, no PROXIED", clasificar(["104.16.1.1"], []).estado === "NO_MEDIDO");
  ok("rangos ilegibles -> NO MEDIDO", clasificar(["104.16.1.1"], ["basura"]).estado === "NO_MEDIDO");

  ok("Traefik que no contesta -> null, no lista vacía", routersVivos({ correr: () => null }) === null);
  ok("Traefik con basura -> null", routersVivos({ correr: () => "no es json" }) === null);
  ok(
    "Traefik que contesta -> lista",
    JSON.stringify(routersVivos({ correr: () => '[{"rule":"Host(`a.b.c`)"}]' })) ===
      JSON.stringify([{ rule: "Host(`a.b.c`)" }]),
  );
  // --- qué se puede hacer con un DIRECTO (los 11 hostnames reales del 2026-09-26)
  const FILAS_REALES = [
    { host: "app.onia.com.bo", estado: "PROXIED" },
    { host: "onia.com.bo", estado: "PROXIED" },
    { host: "www.onia.com.bo", estado: "PROXIED" },
    { host: "chat.onia.com.bo", estado: "PROXIED" },
    { host: "cal.onia.com.bo", estado: "DIRECTO" },
    { host: "forms.onia.com.bo", estado: "DIRECTO" },
    { host: "postiz.onia.com.bo", estado: "DIRECTO" },
    { host: "n8n-sergio-n8n.hqdqgh.easypanel.host", estado: "DIRECTO" },
    { host: "onia-chatbot-chatwoot.hqdqgh.easypanel.host", estado: "DIRECTO" },
    { host: "hqdqgh.easypanel.host", estado: "DIRECTO" },
    { host: "traefik.hqdqgh.easypanel.host", estado: "DIRECTO" },
  ];
  const ZONAS = zonasConPruebaDeCloudflare(FILAS_REALES);

  ok("padre de un subdominio", padreInmediato("cal.onia.com.bo") === "onia.com.bo");
  ok("un apex de dos labels no tiene zona padre", padreInmediato("easypanel.host") === null);
  ok("hostname basura no tiene padre", padreInmediato("") === null);
  ok("la zona propia se deriva de los proxied", ZONAS.has("onia.com.bo"));
  ok(
    "el apex proxied NO aporta com.bo como zona administrable",
    !ZONAS.has("com.bo") && !ZONAS.has("bo"),
  );
  ok(
    "un directo de zona propia se arregla con DNS proxied",
    remedioDelDirecto("cal.onia.com.bo", ZONAS).remedio === "DNS_PROXIED",
  );
  ok(
    "un directo de dominio ajeno NO tiene remedio en ufw",
    remedioDelDirecto("traefik.hqdqgh.easypanel.host", ZONAS).remedio === "SIN_REMEDIO_EN_UFW",
  );
  ok(
    "el apex ajeno tampoco",
    remedioDelDirecto("hqdqgh.easypanel.host", ZONAS).remedio === "SIN_REMEDIO_EN_UFW",
  );
  ok(
    "sin ningún proxied, nada se declara administrable",
    remedioDelDirecto("cal.onia.com.bo", zonasConPruebaDeCloudflare([])).remedio ===
      "SIN_REMEDIO_EN_UFW",
  );

  const CONSEJO = consejoParaDirectos(
    FILAS_REALES.filter((f) => f.estado === "DIRECTO"),
    ZONAS,
  ).join("\n");

  // El caso que nace de un plan escrito que NO se podía ejecutar: la vuelta anterior
  // decidió «los 4 de *.easypanel.host se EXCEPTUAN en ufw», y el instrumento lo
  // avalaba diciendo «o exceptuarlos». ufw no ve el hostname: la excepción no existe.
  ok(
    "el consejo NO ofrece exceptuar por hostname",
    !/o exceptuarlos/.test(CONSEJO) && /no ve el hostname/.test(CONSEJO),
  );
  ok(
    "el consejo dice que dejar 443 abierto NO reduce el agujero",
    /queda ENTERO/.test(CONSEJO),
  );
  ok("el consejo separa los 3 de zona propia", /cal\.onia\.com\.bo/.test(CONSEJO) && /proxied \(3\)/.test(CONSEJO));
  ok(
    "el consejo separa los 4 de dominio ajeno",
    /SIN remedio por DNS \(4, dominio ajeno\)/.test(CONSEJO),
  );
  ok("el consejo ofrece salidas que sí existen", /túnel SSH/.test(CONSEJO));

  ok("un ips-v4 que no baja -> null (no rangos a medias)", rangosDeCloudflare({ bajar: () => null }) === null);
  ok(
    "si sólo falla v6 tampoco se concluye",
    rangosDeCloudflare({ bajar: (u) => (u.endsWith("v6") ? null : "104.16.0.0/13") }) === null,
  );

  const fallidos = casos.filter(([, c]) => !c);
  console.log(`self-check hostnames-proxied: ${casos.length - fallidos.length}/${casos.length}`);
  for (const [q] of fallidos) console.log(`  FALLA: ${q}`);
  return fallidos.length === 0 ? 0 : 1;
}

async function main() {
  if (process.argv.includes("--self-check")) return selfCheck();

  const routers = routersVivos();
  if (routers === null) {
    console.log("NO MEDIDO: no pude leer los routers vivos de Traefik (¿sin SSH al VPS?).");
    console.log("No se cierra ufw sin esta lista: un hostname que no veo se corta MUDO.");
    return 2;
  }

  const rangos = rangosDeCloudflare();
  if (rangos === null) {
    console.log("NO MEDIDO: no pude bajar los rangos publicados de Cloudflare.");
    console.log("No se cierra ufw con una copia vieja de los rangos.");
    return 2;
  }

  const hosts = hostnamesDeRouters(routers);
  const filas = [];
  for (const h of hosts) filas.push({ host: h, ...clasificar(await resolver(h), rangos) });

  const directos = filas.filter((f) => f.estado === "DIRECTO");
  const noMedidos = filas.filter((f) => f.estado === "NO_MEDIDO");
  const proxied = filas.filter((f) => f.estado === "PROXIED");

  console.log(
    `routers vivos: ${routers.length} · hostnames: ${hosts.length} · ` +
      `rangos de Cloudflare: ${rangos.length}`,
  );
  console.log(
    `proxied (seguro): ${proxied.length} · DIRECTO (se corta mudo): ${directos.length} · ` +
      `NO MEDIDO: ${noMedidos.length}`,
  );
  for (const f of filas) {
    const marca = f.estado === "PROXIED" ? "  ok  " : f.estado === "DIRECTO" ? " 🔴   " : "  ?   ";
    console.log(`${marca}${f.estado.padEnd(10)} ${f.host} — ${f.motivo}`);
  }

  if (noMedidos.length > 0) {
    console.log("\nNO se cierra ufw todavía: hay hostnames que no pude medir.");
    return 2;
  }
  if (directos.length > 0) {
    const zonas = zonasConPruebaDeCloudflare(filas);
    console.log("");
    for (const l of consejoParaDirectos(directos, zonas)) console.log(l);
    return 1;
  }
  console.log("\nTodos los hostnames entran por Cloudflare: cerrar 80/443 no corta ninguno.");
  return 0;
}

main().then(
  (c) => process.exit(c),
  (e) => {
    console.log(`NO MEDIDO: el instrumento falló — ${e?.message ?? e}`);
    process.exit(2);
  },
);
