#!/usr/bin/env node
/**
 * correo_que_llega.mjs — ¿el correo del alta tiene CON QUÉ llegar a la bandeja?
 *
 * Hermano de `alta_correo_confirma.mjs`, y la pregunta es OTRA. Aquél contesta «si el
 * correo llega, ¿el enlace deja entrar?» — lee el `token_hash` de la base y abre la URL,
 * así que anda aunque el mail no salga nunca. Éste contesta la de antes: «¿el mail tiene
 * con qué aterrizar en Recibidos y no en Spam?».
 *
 * Nace de que el ítem 🔴 del alta (`hermes-content/docs/cola/plataforma-v1.md`) pedía tres
 * cosas y llevaba 14 días declarado bloqueado ENTERO por una sola: la de abrir el correo en
 * una bandeja real necesita el conector de Gmail, que sigue sin autorizar. Pero el pilar
 * SPF/DKIM/DMARC nunca dependió de eso y nunca se había medido. Un bloqueo que se traga las
 * partes desbloqueadas del ítem cuesta semanas.
 *
 * Los tres pilares, y por qué ESTE orden:
 *   1. SPF   — ¿el SIN... perdón, el VPS (187.77.16.63) está autorizado a mandar por
 *              onia.com.bo? Sin esto Gmail ve un remitente que dice ser quien no es.
 *   2. DKIM  — y acá está el fallo que NADIE ve: que exista una clave publicada no prueba
 *              nada. Lo que importa es que la clave publicada sea LA MISMA que firma
 *              (`/etc/opendkim/keys/onia.com.bo.private` dentro de `onia-mail`). Si rotan
 *              una y no la otra, cada correo sale firmado con una llave que no abre — y
 *              Postfix igual loguea `250 OK`, porque el 250 es del RECIBO, no del veredicto.
 *   3. DMARC — qué le pide el dominio a Gmail que haga cuando 1 o 2 fallan.
 *
 * ⚠️ Este instrumento DESCARTA, no confirma la bandeja. Verde acá = «el correo tiene con qué
 * llegar»; NO prueba que aterrice en Recibidos — eso sólo se sabe abriendo la bandeja. Es
 * exactamente la mitad del LISTO que no necesita a Gmail.
 *
 * Uso:
 *   node scripts/correo_que_llega.mjs               # medición viva (DNS + la llave que firma)
 *   node scripts/correo_que_llega.mjs --self-check  # puro, sin red: va en la cadena
 *
 * Salidas: 0 = los tres pilares dan verde · 1 = defecto real · 2 = no pude medir.
 */
import { spawnSync } from "node:child_process";
import dns from "node:dns/promises";
import { pathToFileURL } from "node:url";

const DOMINIO = "onia.com.bo";
const IP_VPS = "187.77.16.63";
/** El selector sale de `/etc/opendkim/SigningTable` del contenedor: `*@onia.com.bo mail._domainkey...`. */
const SELECTOR = "mail";
const CONTENEDOR_CORREO = "onia-mail";

// ---------------------------------------------------------------------------
// Puros — lo único que el --self-check puede fijar sin red
// ---------------------------------------------------------------------------

/**
 * El registro SPF de una lista de TXT. `null` = no pude mirar (no es lo mismo que «no hay»):
 * el que llama distingue el fallo de DNS pasando `null`, y la ausencia pasando `[]`.
 */
export function spfDe(txts) {
  if (txts === null || txts === undefined) return null;
  return txts.find((t) => t.trim().toLowerCase().startsWith("v=spf1")) ?? "";
}

/**
 * ¿El SPF autoriza a esta IP por un `ip4:` LITERAL?
 *
 * Tri-estado a propósito. Que el literal NO esté no prueba que la IP esté prohibida: un
 * `include:` anidado puede autorizarla y este instrumento no sigue includes. Así que
 * ausencia = `null` (no medido), nunca `false` — si no, un dominio sano daría rojo.
 */
export function spfAutorizaIp(spf, ip = IP_VPS) {
  if (spf === null || spf === undefined) return null;
  if (!spf) return false; // Pregunté y NO hay SPF: eso sí es un defecto, no una duda.
  const tokens = spf.split(/\s+/);
  const literal = tokens.some((t) => {
    const m = /^ip4:([0-9.]+)(\/(\d+))?$/i.exec(t);
    return m && m[1] === ip && (m[3] === undefined || m[3] === "32");
  });
  return literal ? true : null;
}

/** El calificador final del SPF (`~all`, `-all`, `?all`) o `null` si no lo trae. */
export function calificadorFinal(spf) {
  if (!spf) return null;
  const m = /([-~?+])all\b/.exec(spf);
  return m ? `${m[1]}all` : null;
}

/** El registro DMARC parseado. `null` = no medido · `{presente:false}` = pregunté y no hay. */
export function dmarcDe(txts) {
  if (txts === null || txts === undefined) return null;
  const crudo = txts.find((t) => t.trim().toLowerCase().startsWith("v=dmarc1"));
  if (!crudo) return { presente: false, politica: null, rua: null };
  const campo = (k) => {
    const m = new RegExp(`${k}\\s*=\\s*([^;]+)`, "i").exec(crudo);
    return m ? m[1].trim() : null;
  };
  return { presente: true, politica: campo("p"), rua: campo("rua"), crudo };
}

/**
 * La clave pública DKIM publicada, normalizada a base64 pelado.
 * `null` = no medido · `""` = pregunté y no hay registro con `p=`.
 */
export function dkimPublicadaDe(txts) {
  if (txts === null || txts === undefined) return null;
  const crudo = txts.find((t) => /(^|;)\s*p\s*=/.test(t) && /v=dkim1/i.test(t));
  if (!crudo) return "";
  const m = /(^|;)\s*p\s*=\s*([^;]*)/.exec(crudo);
  return m ? normalizarClave(m[2]) : "";
}

/** Base64 sin espacios, saltos ni cabeceras PEM — las dos fuentes llegan con formatos distintos. */
export function normalizarClave(s) {
  if (s === null || s === undefined) return null;
  return String(s)
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * EL pilar que se rompe mudo: ¿la clave publicada es la que firma?
 * `null` si falta cualquiera de las dos — no poder comparar NO es «coinciden».
 */
export function mismaClave(publicada, queFirma) {
  const a = normalizarClave(publicada);
  const b = normalizarClave(queFirma);
  if (!a || !b) return null;
  return a === b;
}

/**
 * El veredicto de los tres pilares.
 * `ok: true` sólo si los tres CONFIRMAN; `false` si alguno es un defecto medido;
 * `null` si algo quedó sin medir — un pilar que no se pudo mirar nunca suma a verde.
 */
export function veredicto({ spf, dmarc, dkimPublicada, dkimQueFirma }, ip = IP_VPS) {
  const pilares = [];
  const defectos = [];
  const sinMedir = [];

  const autoriza = spfAutorizaIp(spf, ip);
  if (autoriza === true) pilares.push(`SPF autoriza ${ip} por ip4 literal (${calificadorFinal(spf)})`);
  else if (autoriza === false) defectos.push("no hay registro SPF: Gmail no puede validar el remitente");
  else sinMedir.push(spf === null || spf === undefined ? "SPF: no pude consultar el TXT" : `SPF: sin ip4:${ip} literal — puede venir por un include, que este instrumento no sigue`);

  const coincide = mismaClave(dkimPublicada, dkimQueFirma);
  if (dkimPublicada === "") defectos.push(`DKIM: no hay clave publicada en ${SELECTOR}._domainkey.${DOMINIO}`);
  else if (coincide === true) pilares.push("DKIM: la clave publicada ES la que firma");
  else if (coincide === false) defectos.push("DKIM: la clave publicada NO es la que firma — todo correo del alta falla DKIM");
  else sinMedir.push("DKIM: no pude leer la clave que firma, así que la publicada no prueba nada");

  if (dmarc === null || dmarc === undefined) sinMedir.push("DMARC: no pude consultar el TXT");
  else if (!dmarc.presente) defectos.push("DMARC: el dominio no le dice a Gmail qué hacer si SPF/DKIM fallan");
  else pilares.push(`DMARC presente (p=${dmarc.politica}${dmarc.rua ? `, informes a ${dmarc.rua}` : ""})`);

  const ok = defectos.length ? false : sinMedir.length ? null : true;
  return { ok, pilares, defectos, sinMedir };
}

// ---------------------------------------------------------------------------
// Medición viva
// ---------------------------------------------------------------------------

/** TXT de un nombre. `null` = no pude preguntar · `[]` = pregunté y no hay. */
export async function txtDe(nombre, resolver = dns.resolveTxt) {
  try {
    const filas = await resolver(nombre);
    return filas.map((f) => (Array.isArray(f) ? f.join("") : String(f)));
  } catch (e) {
    // ENOTFOUND/ENODATA son respuestas del DNS: «pregunté y no hay».
    if (e && (e.code === "ENOTFOUND" || e.code === "ENODATA")) return [];
    return null; // Todo lo demás (timeout, sin red) es NO MEDIDO.
  }
}

/**
 * La clave pública derivada de la privada QUE FIRMA, leída del contenedor de correo.
 * `null` si no se puede llegar — jamás cadena vacía, que se leería como «no hay clave».
 */
export function claveQueFirma(ejecutar = spawnSync) {
  const dentro = `openssl rsa -in /etc/opendkim/keys/${DOMINIO}.private -pubout 2>/dev/null`;
  const r = ejecutar("docker", ["exec", CONTENEDOR_CORREO, "sh", "-lc", dentro], {
    encoding: "utf8",
    timeout: 60000,
  });
  if (!r || r.status !== 0) return null;
  const pem = String(r.stdout || "").trim();
  if (!pem.includes("PUBLIC KEY")) return null;
  return normalizarClave(pem) || null;
}

async function main() {
  const [txtDominio, txtDmarc, txtDkim] = await Promise.all([
    txtDe(DOMINIO),
    txtDe(`_dmarc.${DOMINIO}`),
    txtDe(`${SELECTOR}._domainkey.${DOMINIO}`),
  ]);

  const v = veredicto({
    spf: spfDe(txtDominio),
    dmarc: dmarcDe(txtDmarc),
    dkimPublicada: dkimPublicadaDe(txtDkim),
    dkimQueFirma: claveQueFirma(),
  });

  for (const p of v.pilares) console.log(`ok       ${p}`);
  for (const d of v.defectos) console.log(`DEFECTO  ${d}`);
  for (const s of v.sinMedir) console.log(`no medí  ${s}`);
  console.log(
    v.ok === true
      ? "\nLos tres pilares dan verde: el correo del alta tiene CON QUÉ llegar a Recibidos."
      : v.ok === false
        ? "\nHay un defecto medido: el correo del alta sale con la autenticación rota."
        : "\nNO MEDIDO: falta un pilar. Verde a medias no es verde.",
  );
  console.log("(esto descarta el fallo de autenticación; que aterrice en Recibidos y no en Spam sólo se sabe abriendo la bandeja)");
  process.exit(v.ok === true ? 0 : v.ok === false ? 1 : 2);
}

function selfCheck() {
  const SPF_REAL = "v=spf1 ip4:187.77.16.63 include:_spf.mx.cloudflare.net ~all";
  const K1 = "MIIBIjANBgkqAAA";
  const K2 = "MIIBIjANBgkqZZZ";
  const dmarcOk = { presente: true, politica: "none", rua: "mailto:business@onia.com.bo" };

  const casos = [
    // El fallo que motiva el instrumento: clave publicada ≠ clave que firma.
    [
      "publicada distinta de la que firma es DEFECTO",
      veredicto({ spf: SPF_REAL, dmarc: dmarcOk, dkimPublicada: K1, dkimQueFirma: K2 }).ok === false,
    ],
    [
      "...y lo dice por el motivo correcto",
      veredicto({ spf: SPF_REAL, dmarc: dmarcOk, dkimPublicada: K1, dkimQueFirma: K2 })
        .defectos.some((d) => d.includes("NO es la que firma")),
    ],
    // Que exista una clave publicada NO alcanza: sin la que firma, el pilar no se midió.
    [
      "clave publicada sin poder leer la que firma es NO MEDIDO, nunca verde",
      veredicto({ spf: SPF_REAL, dmarc: dmarcOk, dkimPublicada: K1, dkimQueFirma: null }).ok === null,
    ],
    [
      "los tres pilares confirmados dan verde",
      veredicto({ spf: SPF_REAL, dmarc: dmarcOk, dkimPublicada: K1, dkimQueFirma: K1 }).ok === true,
    ],
    // Tri-estado: no poder preguntar ≠ que me digan que no.
    [
      "DNS caído es NO MEDIDO, no defecto",
      veredicto({ spf: null, dmarc: null, dkimPublicada: null, dkimQueFirma: null }).ok === null,
    ],
    [
      "sin registro SPF es DEFECTO",
      veredicto({ spf: "", dmarc: dmarcOk, dkimPublicada: K1, dkimQueFirma: K1 }).ok === false,
    ],
    [
      "sin DKIM publicado es DEFECTO",
      veredicto({ spf: SPF_REAL, dmarc: dmarcOk, dkimPublicada: "", dkimQueFirma: K1 }).ok === false,
    ],
    [
      "sin DMARC es DEFECTO",
      veredicto({ spf: SPF_REAL, dmarc: { presente: false }, dkimPublicada: K1, dkimQueFirma: K1 }).ok === false,
    ],
    // El SPF sin ip4 literal puede estar autorizado por un include: no se declara roto.
    [
      "SPF sin ip4 literal es NO MEDIDO (un include puede autorizar), no defecto",
      spfAutorizaIp("v=spf1 include:_spf.mx.cloudflare.net ~all") === null,
    ],
    ["SPF con el ip4 literal autoriza", spfAutorizaIp(SPF_REAL) === true],
    ["ip4 con /32 también autoriza", spfAutorizaIp("v=spf1 ip4:187.77.16.63/32 -all") === true],
    ["otra IP no cuenta como autorizada", spfAutorizaIp("v=spf1 ip4:10.0.0.1 ~all") === null],
    ["el calificador final se lee", calificadorFinal(SPF_REAL) === "~all"],
    // Parseo de las tres fuentes, con los formatos reales que devuelven.
    ["spfDe ignora los TXT de verificación de Google/Facebook", spfDe(["google-site-verification=x", SPF_REAL]) === SPF_REAL],
    ["spfDe con null es null (no medido)", spfDe(null) === null],
    ["spfDe sin SPF devuelve cadena vacía (ausente)", spfDe(["otra-cosa=1"]) === ""],
    [
      "dmarcDe lee política y rua",
      (() => {
        const d = dmarcDe(["v=DMARC1; p=none; rua=mailto:business@onia.com.bo; fo=1"]);
        return d.presente === true && d.politica === "none" && d.rua === "mailto:business@onia.com.bo";
      })(),
    ],
    ["dmarcDe con null es null", dmarcDe(null) === null],
    ["dmarcDe sin registro dice presente:false", dmarcDe([]).presente === false],
    [
      "dkimPublicadaDe saca el p= del registro",
      dkimPublicadaDe([`v=DKIM1;h=sha256;k=rsa;p=${K1}`]) === K1,
    ],
    ["dkimPublicadaDe con null es null", dkimPublicadaDe(null) === null],
    ["dkimPublicadaDe sin registro es cadena vacía", dkimPublicadaDe(["v=spf1 ~all"]) === ""],
    [
      "normalizarClave saca cabeceras PEM y saltos",
      normalizarClave(`-----BEGIN PUBLIC KEY-----\n${K1}\n-----END PUBLIC KEY-----`) === K1,
    ],
    ["mismaClave compara ignorando formato", mismaClave(K1, `-----BEGIN PUBLIC KEY-----\n${K1}\n-----END PUBLIC KEY-----`) === true],
    ["mismaClave sin una de las dos es null", mismaClave(K1, null) === null],
    // El lector del contenedor: fallar no puede devolver cadena vacía.
    ["claveQueFirma con docker roto devuelve null", claveQueFirma(() => ({ status: 1, stdout: "" })) === null],
    ["claveQueFirma sin PEM en la salida devuelve null", claveQueFirma(() => ({ status: 0, stdout: "nada" })) === null],
    [
      "claveQueFirma normaliza el PEM que sale de openssl",
      claveQueFirma(() => ({ status: 0, stdout: `-----BEGIN PUBLIC KEY-----\n${K1}\n-----END PUBLIC KEY-----\n` })) === K1,
    ],
  ];

  let malos = 0;
  for (const [nombre, ok] of casos) {
    if (!ok) malos++;
    console.log(`${ok ? "ok  " : "FAIL"} ${nombre}`);
  }
  console.log(`${casos.length - malos}/${casos.length}`);
  process.exit(malos === 0 ? 0 : 1);
}

// Guarda de importación: sin esto, importar una función pura dispara la medición viva.
const invocadoDirecto = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invocadoDirecto) {
  if (process.argv.includes("--self-check")) selfCheck();
  else await main();
}
