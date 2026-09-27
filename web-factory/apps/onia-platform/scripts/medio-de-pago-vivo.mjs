#!/usr/bin/env node
/**
 * El medio de pago que el sitio PROMETE, cruzado contra el que producción PUEDE.
 *
 * POR QUE EXISTE. El 2026-09-11 `onia.com.bo` le prometia al lead pagar su plan
 * "por QR" en tres superficies vivas, y no existe ningun QR: el contenedor no
 * tiene una sola credencial del banco, asi que `isBcpQrConfigured()` es false y
 * el checkout, dos clics despues, manda a pedir los datos por WhatsApp. La web y
 * el producto se contradecian y la que miente llega PRIMERO.
 *
 * QUE NO ALCANZA, y por eso este cruce existe ademas del gate. El gate puro
 * (`src/content/medio-de-pago.test.ts`) verifica que ninguna superficie tipee el
 * medio a mano y que la fuente siga a la constante `QR_PARA_PAGARLE_A_ONIA`.
 * Eso vigila la COHERENCIA del sitio consigo mismo — y no puede saber si la
 * constante dice la verdad. Este script es lo unico que ata la constante a la
 * realidad.
 *
 * 2026-09-25 — TRES MEDIOS. Sin la API del BCP el sitio ahora ofrece el QR
 * ESTATICO de la cuenta de Onia mientras este vigente (`QR_ESTATICO_VENCE_EL`).
 * Ese QR es una imagen que sirve el producto en `app.onia.com.bo/pago/`; si el
 * sitio lo promete y la imagen no esta, el lead lee "pagas con nuestro QR" y el
 * checkout no le muestra ninguno. Por eso, cuando el sitio promete el estatico,
 * este cruce tambien pide la imagen y exige 200 con tipo `image/*`. Antes del
 * deploy de la plataforma que la sirve, ese chequeo da ROJO a proposito: el
 * deploy de la plataforma va primero.
 *
 * NO se cablea en `prebuild` ni en la cadena `npm test`: necesita salir a
 * produccion, igual que `rubros-vivos.mjs`, `enlaces-vivos.mjs` y
 * `precios-vivos.mjs`. Colgarlo del build ata el deploy a que el VPS conteste, y
 * meterlo en la cadena pone rojo por AMBIENTE, lo que traba el merge de los
 * quince carriles. Se corre cada vuelta: `npm run medio-de-pago:vivo`.
 *
 * COMO NO FALLA EN VERDE, que es como muere esta familia. Si no se puede
 * preguntar —sin docker, sin SSH, el contenedor caido— la respuesta NO es
 * "entonces no hay QR" (que coincide con la constante de hoy y daria verde por
 * casualidad, sobre una medicion que nunca ocurrio). Sale NO PUDE MEDIR con
 * exit 2. El unico verde posible es haber leido el entorno del proceso vivo.
 *
 * Uso:
 *   node scripts/medio-de-pago-vivo.mjs        # cruza contra produccion
 *   node scripts/medio-de-pago-vivo.mjs --self-check   # prueba su propia logica
 *
 * Salida: 0 = coinciden · 1 = el sitio promete lo que produccion no tiene (o no
 * sirve la imagen del QR estatico) · 2 = no pude medir
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { devNull } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const COINCIDEN = 0;
const DESALINEADO = 1;
const NO_PUDE_MEDIR = 2;

const AQUI = dirname(fileURLToPath(import.meta.url));
const FUENTE = join(AQUI, "..", "src", "content", "medio-de-pago.ts");
const CONTENEDOR = "onia-platform";
const IMAGEN_QR = "https://app.onia.com.bo/pago/qr-bcp-onia.png";

/**
 * Lo que el SITIO declara. Se lee del texto del modulo y no con un `import`
 * porque este script corre con node pelado, sin el resolvedor de `@/`.
 *
 * Devuelve `null` cuando no se puede leer o la constante cambio de forma: eso
 * es NO PUDE MEDIR, nunca `false`. Un parseo que falla y se aplana a "no hay QR"
 * coincide con el valor de hoy y firmaria verde sin haber leido nada.
 */
export function loQuePrometeElSitio(texto) {
  const m = /export const QR_PARA_PAGARLE_A_ONIA\s*=\s*(true|false)\s*;/.exec(texto);
  return m ? m[1] === "true" : null;
}

/**
 * Lo que PRODUCCION puede: ¿el contenedor tiene credenciales del banco?
 *
 * Se le pregunta al entorno del PROCESO vivo, no a un `.env` del disco: ya nos
 * mordio que una variable estuviera en el archivo y no llegara al contenedor
 * (el lanzador con lista blanca de `-e`). `docker` anda tambien desde el nodo de
 * casa, donde es un shim que delega por SSH en el VPS.
 */
export function loQuePuedeProduccion(ejecutar = spawnSync) {
  const r = ejecutar("docker", ["exec", CONTENEDOR, "env"], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (!r || r.status !== 0 || typeof r.stdout !== "string") return null;
  const lineas = r.stdout.split("\n");
  // Un `env` sano trae decenas de variables. Una salida vacia o de dos lineas
  // es el contenedor contestando mal, no un contenedor sin credenciales.
  if (lineas.filter((l) => l.includes("=")).length < 5) return null;
  return lineas.some((l) => /^BCP_QR_/.test(l));
}

/**
 * El dia que vence el QR estatico, leido del texto de la fuente ("AAAA-MM-DD").
 * `null` si no esta o cambio de forma: NO PUDE MEDIR, nunca "no hay estatico".
 */
export function venceElQrEstatico(texto) {
  const m = /export const QR_ESTATICO_VENCE_EL\s*=\s*"(\d{4}-\d{2}-\d{2})"\s*;/.exec(texto);
  return m ? m[1] : null;
}

/**
 * Cual de los tres medios le dice el sitio al lead. Misma regla que la fuente:
 * API del banco manda; si no, el estatico hasta la medianoche de La Paz del dia
 * que vence; si no, transferencia.
 */
export function medioQuePromete(qr, venceEl, hoy = new Date()) {
  if (qr) return "qr-dinamico";
  const corte = new Date(`${venceEl}T00:00:00-04:00`).getTime();
  return hoy.getTime() < corte ? "qr-estatico" : "transferencia";
}

/**
 * ¿Produccion sirve la imagen del QR estatico? Codigo y tipo, sin seguir
 * redirects: un 307 al login que termina en un 200 HTML no es la imagen.
 * `null` si curl no llego (DNS, TLS, timeout): NO PUDE MEDIR.
 */
export function laImagenDelQr(ejecutar = spawnSync) {
  const r = ejecutar(
    "curl",
    ["-s", "-o", devNull, "-w", "%{http_code}\t%{content_type}", "--max-time", "25", IMAGEN_QR],
    { encoding: "utf8", timeout: 30_000 },
  );
  if (!r || r.status !== 0 || typeof r.stdout !== "string") return null;
  const [codigo, tipo = ""] = r.stdout.trim().split("\t");
  if (!/^\d{3}$/.test(codigo) || codigo === "000") return null;
  return { codigo, tipo };
}

export const laImagenSirve = (img) => img.codigo === "200" && /^image\//i.test(img.tipo);

function selfCheck() {
  const fallos = [];
  const ok = (cond, que) => {
    if (!cond) fallos.push(que);
  };

  ok(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = false;") === false, "lee false");
  ok(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = true;") === true, "lee true");
  ok(loQuePrometeElSitio("export const OTRA_COSA = false;") === null, "constante ausente -> null");
  ok(
    loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = leerFlag();") === null,
    "la constante cambio de forma -> null, NO false",
  );

  const env = (salida, status = 0) => () => ({ status, stdout: salida });
  const muchas = Array.from({ length: 20 }, (_, i) => `VAR_${i}=x`).join("\n");
  ok(loQuePuedeProduccion(env(muchas)) === false, "env sin BCP_QR_ -> false");
  ok(loQuePuedeProduccion(env(`${muchas}\nBCP_QR_ID=abc`)) === true, "env con BCP_QR_ -> true");
  ok(loQuePuedeProduccion(env("", 1)) === null, "docker falla -> null");
  ok(
    loQuePuedeProduccion(env("HOME=/root\nPATH=/bin")) === null,
    "env sospechosamente corto -> null, NO false",
  );
  ok(loQuePuedeProduccion(() => null) === null, "sin docker -> null");

  ok(venceElQrEstatico('export const QR_ESTATICO_VENCE_EL = "2027-09-25";') === "2027-09-25", "lee el vencimiento");
  ok(venceElQrEstatico("export const QR_ESTATICO_VENCE_EL = hoy();") === null, "vencimiento cambio de forma -> null");
  const corte = new Date("2027-09-25T00:00:00-04:00");
  ok(medioQuePromete(true, "2027-09-25", corte) === "qr-dinamico", "API manda");
  ok(medioQuePromete(false, "2027-09-25", new Date(corte - 1)) === "qr-estatico", "estatico hasta el corte");
  ok(medioQuePromete(false, "2027-09-25", corte) === "transferencia", "vencido -> transferencia");

  const curl = (salida, status = 0) => () => ({ status, stdout: salida });
  ok(laImagenSirve(laImagenDelQr(curl("200\timage/jpeg"))), "200 image/jpeg sirve");
  ok(!laImagenSirve(laImagenDelQr(curl("404\ttext/html; charset=utf-8"))), "404 no sirve");
  ok(!laImagenSirve(laImagenDelQr(curl("200\ttext/html"))), "200 HTML no es la imagen");
  ok(!laImagenSirve(laImagenDelQr(curl("307\t"))), "redirect al login no sirve");
  ok(laImagenDelQr(curl("000\t", 6)) === null, "curl no llego -> null");

  if (fallos.length) {
    console.error(`SELF-CHECK ROJO:\n  - ${fallos.join("\n  - ")}`);
    process.exit(DESALINEADO);
  }
  console.log("SELF-CHECK VERDE: 19 casos.");
  process.exit(COINCIDEN);
}

function main() {
  if (process.argv.includes("--self-check")) return selfCheck();

  let texto;
  try {
    texto = readFileSync(FUENTE, "utf8");
  } catch {
    console.error(`NO PUDE MEDIR: no pude leer ${FUENTE}.`);
    process.exit(NO_PUDE_MEDIR);
  }

  const promete = loQuePrometeElSitio(texto);
  if (promete === null) {
    console.error(
      "NO PUDE MEDIR: QR_PARA_PAGARLE_A_ONIA no esta o cambio de forma en " +
        `${FUENTE}. El cruce quedo ciego; no se asume que no hay QR.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const venceEl = venceElQrEstatico(texto);
  if (venceEl === null) {
    console.error(
      `NO PUDE MEDIR: QR_ESTATICO_VENCE_EL no esta o cambio de forma en ${FUENTE}. ` +
        "Sin eso no se sabe si el sitio ofrece el QR estatico.",
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const puede = loQuePuedeProduccion();
  if (puede === null) {
    console.error(
      `NO PUDE MEDIR: no pude leer el entorno del contenedor "${CONTENEDOR}". ` +
        "Sin eso NO se concluye que no hay QR: verde exige haber preguntado.\n" +
        `  Se ve con: docker exec ${CONTENEDOR} env | grep -c '^BCP_QR_'`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  if (promete === puede) {
    const medio = medioQuePromete(promete, venceEl);
    if (medio === "qr-estatico") {
      const img = laImagenDelQr();
      if (img === null) {
        console.error(
          `NO PUDE MEDIR: no pude pedir ${IMAGEN_QR} (DNS, TLS o timeout). ` +
            "El sitio promete el QR estatico y sin la imagen no se concluye nada.",
        );
        process.exit(NO_PUDE_MEDIR);
      }
      if (!laImagenSirve(img)) {
        console.error(
          `ROJO: el sitio promete "pagas con nuestro QR" y ${IMAGEN_QR} contesta ` +
            `${img.codigo} ${img.tipo || "(sin tipo)"}, no 200 image/*.\n` +
            "  El lead llega al checkout y no ve ningun QR. Si la plataforma todavia no se deployo " +
            "con el QR estatico, esto es lo esperado: el deploy de la plataforma va PRIMERO y el del sitio despues.",
        );
        process.exit(DESALINEADO);
      }
    }
    console.log(
      `VERDE: el sitio y produccion dicen lo mismo — ${medio}` +
        `${medio === "qr-estatico" ? ` (imagen ${IMAGEN_QR} servida)` : ""}. ` +
        `El lead lee el medio de pago que se va a encontrar en el checkout.`,
    );
    process.exit(COINCIDEN);
  }

  if (promete && !puede) {
    console.error(
      "ROJO: el sitio promete pagar por QR y produccion NO tiene ninguno.\n" +
        `  El lead lee "pagas por QR desde tu app bancaria" y el checkout no tiene ese QR: ` +
        "la web y el producto se contradicen, y la que miente llega PRIMERO.\n" +
        `  Se cierra poniendo QR_PARA_PAGARLE_A_ONIA = false en ${FUENTE}.`,
    );
  } else {
    console.error(
      "ROJO: produccion YA puede cobrar por QR dinamico y el sitio sigue ofreciendo un medio que verificamos a mano.\n" +
        "  Es la direccion que ningun barrido de textos prohibidos ve: no sobra una palabra, FALTA — " +
        "le estamos dando al lead un camino mas lento que el que el producto ya tiene.\n" +
        `  Se cierra poniendo QR_PARA_PAGARLE_A_ONIA = true en ${FUENTE}.`,
    );
  }
  process.exit(DESALINEADO);
}

// La guarda no es ceremonia: este modulo EXPORTA sus lectores para que un
// test pueda probarlos, y sin ella un `import` dispararia el `docker exec` contra
// produccion y un `process.exit()` que mata al proceso importador antes de su
// primera linea. Ya paso en este repo (`demo_agendada_real.mjs`, 2026-09-03).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
