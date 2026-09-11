#!/usr/bin/env node
/**
 * Lo que el sitio promete que un rol NO PUEDE VER, cruzado contra lo que el
 * producto REALMENTE le cierra.
 *
 * LA CLASE, y por que ningun gate del carril podia expresarla. Toda la familia
 * de gates de venta persigue lo que la pagina AFIRMA: que no sobre obra
 * (`obra.test.ts`), que no sobre una capacidad que no tenemos
 * (`promesa-humana.test.ts`), que no falte un rubro (`capacidad-acotada`), que
 * no sobre una condicion (`datos-que-se-llevan`), que el monto salga de la
 * fuente (`precios-fuente`). Los cinco juzgan una promesa POSITIVA: "esto lo
 * hacemos". Una promesa NEGATIVA —"esta persona NO ve esto"— es una garantia
 * de privacidad, y es la unica cuyo cumplimiento no se puede leer en el texto
 * de ninguna pantalla: vive en el guard de OTRO repo. Ninguna palabra sobra ni
 * falta, el precio sale bien, el enlace responde 200 y el rubro deriva — y la
 * frase puede ser falsa igual.
 *
 * QUE SE ENCONTRO EL DIA QUE SE ESCRIBIO (2026-09-10, contra `origin/master`).
 * `/v1/modulos/dental` publica, con 200 en produccion:
 *
 *   "Cada rol ve lo suyo: la recepcion agenda y cobra pero no ve historia
 *    clinica ni odontograma."
 *
 * El producto tiene el guard y funciona: `patients/[id]/page.tsx` pide
 * `hasPermissionForProfile(profile, "clinical.read")`, y `STAFF` (la recepcion)
 * no lo tiene —`roles.ts` le da `["recepcion", "caja"]`—. Pero el arreglo NO
 * VIAJO A LAS HERMANAS: de las cinco superficies que leen un dato clinico por
 * Prisma, dos no lo piden —`patients/[id]/odontogram/page.tsx` (la palabra
 * exacta que usa la venta) y `print/prescription/[id]/page.tsx`—, y las dos
 * cortan por sesion, por organizacion y por RUBRO, nunca por rol. Nada mas
 * arriba las ataja: el layout de `(dashboard)` corta con `resolveRouteAccess`,
 * que no mira el rol (`grep -c role` sobre `route-access.ts` da 0), y `/print`
 * ni siquiera cuelga de ese layout. Las APIs hermanas SI piden el permiso, pero
 * las dos pantallas leen con `prisma` directo y no pasan por ellas. Reportado
 * al dueno del producto en `t_03ddb1d7` — este repo no toca ese.
 *
 * POR QUE EL SUJETO SE DERIVA DEL DISCO DEL PRODUCTO Y NO DE UNA LISTA. Una
 * lista de pantallas escrita a mano cubre las que YA fallaron: el dia que
 * alguien agregue una sexta superficie clinica, nace fuera del gate y nada se
 * pone rojo. El universo es "todo `page.tsx` / `route.ts` que LEE el dato", y
 * la unica lista que hay es la de exentos, que se re-mide en cada corrida.
 *
 * POR QUE NO ES UN TEST DE LA CADENA. El producto es otro repositorio y no esta
 * en este worktree: exigirlo pondria rojo por AMBIENTE en toda maquina que no
 * lo tenga, y eso traba el merge de los quince carriles. Va como los otros
 * cruces del carril (`precios-fuente`, `rubros-vivos`, `deploy-vivo`): el
 * `--self-check` PURO —fixtures en memoria, sin repo hermano— si entra en la
 * cadena, y la medicion viva se corre cada vuelta.
 *
 * COMO NO FALLA EN VERDE. Es la trampa de esta familia: si no se puede leer el
 * producto, "ninguna superficie sin guard" se leeria como sitio sano. Por eso
 * el verde EXIGE haber encontrado superficies: cero sujetos sale ROJO DE
 * INSTRUMENTO (codigo 2), nunca verde.
 *
 * Uso:
 *   node scripts/privacidad-viva.mjs
 *   node scripts/privacidad-viva.mjs --self-check
 *   ONIA_PLATFORM_REPO=/otra/ruta node scripts/privacidad-viva.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  COINCIDEN,
  DESALINEADO,
  NO_PUDE_MEDIR,
  REPO_PRODUCTO,
  VPS_SSH,
  sinComentarios,
} from "./precios-fuente.mjs";

export { COINCIDEN, DESALINEADO, NO_PUDE_MEDIR };
/**
 * Re-exportado con nombre propio para el gate puro: el barrido del sitio tiene
 * que leer el codigo SIN comentarios, o la bitacora que explica una de estas
 * promesas dispara el gate y obedecerlo obliga a borrar el registro.
 */
export { sinComentarios as sinComentariosDeAca };

/**
 * Las promesas NEGATIVAS que el sitio publica hoy.
 *
 * `marca` es el fragmento literal por el que el gate puro
 * (`src/app/(sitio)/promesa-de-privacidad.test.ts`) reconoce la frase en el
 * disco: si alguien publica una promesa de este tipo sin declararla aca, ese
 * gate se pone rojo y la nombra. Al reves tambien: una declaracion cuya frase
 * ya no esta publicada sobra, y tambien pone rojo — asi la lista no se pudre.
 */
export const PROMESAS = [
  {
    id: "clinico-no-lo-ve-la-recepcion",
    marca: "no ve historia clínica ni odontograma",
    donde: "src/app/v1/modulos/dental/page.tsx",
    permiso: "clinical.read",
    /**
     * Que cuenta como LEER un dato clinico en el producto. Es el acceso al
     * dato, no la palabra: `/help`, `/privacy` y `/settings` NOMBRAN el
     * odontograma —lo explican o lo venden— y no lo muestran; incluirlas por el
     * sustantivo mandaria a ponerle un guard clinico a la pagina de ayuda.
     */
    lee: /prisma\.(prescription|teethRecord|medicalAlert|patientRecord|clinicalNote)\b|\b(teethRecords|medicalAlerts|prescriptions?)\s*:\s*true/,
  },
];

/** Sin `BatchMode` un SSH sin llave se cuelga pidiendo contrasena y el cron muere por timeout. */
const SSH_ARGS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=8", "-o", "StrictHostKeyChecking=accept-new"];

/**
 * El guard, pedido como LLAMADA y no como presencia del simbolo.
 *
 * Preguntar si el archivo "menciona" `clinical.read` deja pasar el esquive mas
 * barato que existe —el comentario que lo explica— y ademas absuelve al archivo
 * que lo nombra por otro motivo. Se lee sobre el codigo sin comentarios y se
 * exige el permiso DENTRO de los parentesis de la llamada.
 *
 * ⚠️ EL NOMBRE DE LA LLAMADA NO SE ENUMERA. La primera version pedia
 * `hasPermission*` —la forma que usan las PANTALLAS, que necesitan un booleano
 * para decidir que pintar— y el producto tiene una segunda para las APIs,
 * `requirePermission(profile, "clinical.read", req)`, que tira 403. Con esa
 * lista de dos nombres de la que yo conocia uno, la primera corrida acuso a
 * `api/prescriptions/route.ts` y a su hermana `[id]`, las dos perfectamente
 * cerradas: el falso positivo va en la direccion cara, la que manda a "arreglar"
 * codigo sano. Lo delato que el veredicto contradecia una medicion hecha a mano
 * cinco minutos antes. Por eso la condicion es la FAMILIA —cualquier llamada
 * cuyo nombre hable de permiso— y no una lista de nombres: una forma nueva
 * (`assertPermission`, `ensurePermission`) nace reconocida en vez de nacer
 * acusada. Un array `PERMISSIONS = ["clinical.read"]` no matchea, porque lo que
 * se exige es el parentesis de una llamada.
 */
const LLAMADA_AL_GUARD = (permiso) =>
  new RegExp(`\\w*[Pp]ermission\\w*\\s*\\([^)]*["'\`]${permiso.replace(".", "\\.")}["'\`]`);

/** Las dos formas de un permiso: quien puede ESCRIBIR el dato tambien puede verlo. */
const PERMISOS_QUE_ALCANZAN = (permiso) =>
  permiso === "clinical.read" ? ["clinical.read", "clinical.write"] : [permiso];

/** Sujeto: lo que el usuario abre o llama. Un `*Client.tsx` no es puerta — su guard vive en el `page.tsx`. */
export const esSuperficie = (ruta) =>
  /(^|\/)(page\.tsx|route\.ts)$/.test(ruta) && !/\.test\.[cm]?tsx?$/.test(ruta);

/** Recorre `app/` del producto en el disco local. `null` si no esta ahi. */
export function listarLocal(repo = REPO_PRODUCTO) {
  const raiz = join(repo, "app");
  const salida = new Map();
  const bajar = (dir) => {
    for (const entrada of readdirSync(dir)) {
      if (entrada === "node_modules" || entrada === ".next") continue;
      const completa = join(dir, entrada);
      if (statSync(completa).isDirectory()) bajar(completa);
      else if (esSuperficie(entrada)) salida.set(relative(repo, completa), readFileSync(completa, "utf8"));
    }
  };
  try {
    bajar(raiz);
  } catch {
    return null;
  }
  return salida.size ? salida : null;
}

/**
 * El mismo recorrido por SSH al VPS: este carril dejo de correr solo alla el
 * 2026-09-04 y un gate que asume una ruta absoluta de esa maquina deja de medir
 * en silencio al mudarse. Devuelve `null` —no un Map vacio— cuando no pudo
 * preguntar: vacio se leeria como "no hay superficies clinicas", que es la
 * respuesta contraria a la verdad.
 */
export function listarPorSsh(repo = REPO_PRODUCTO, destino = VPS_SSH) {
  const lista = spawnSync(
    "ssh",
    [...SSH_ARGS, destino, "find", join(repo, "app"), "-name", "page.tsx", "-o", "-name", "route.ts"],
    { encoding: "utf8" },
  );
  if (lista.status !== 0 || !lista.stdout.trim()) return null;
  const rutas = lista.stdout.trim().split("\n").filter(Boolean);
  const salida = new Map();
  for (const absoluta of rutas) {
    const cat = spawnSync("ssh", [...SSH_ARGS, destino, "cat", absoluta], { encoding: "utf8" });
    if (cat.status === 0) salida.set(relative(repo, absoluta), cat.stdout);
  }
  return salida.size ? salida : null;
}

/**
 * El veredicto. `superficies` es un Map ruta -> contenido CRUDO (los
 * comentarios se quitan aca dentro, no antes: es el punto de lectura).
 */
export function medir(superficies, promesas = PROMESAS) {
  if (!superficies || superficies.size === 0) {
    return { estado: NO_PUDE_MEDIR, motivo: "no pude leer app/ del producto", hallazgos: [] };
  }
  const hallazgos = [];
  for (const promesa of promesas) {
    const sujetos = [];
    for (const [ruta, crudo] of superficies) {
      const codigo = sinComentarios(crudo);
      if (!promesa.lee.test(codigo)) continue;
      const cerrada = PERMISOS_QUE_ALCANZAN(promesa.permiso).some((p) => LLAMADA_AL_GUARD(p).test(codigo));
      sujetos.push({ ruta, cerrada });
    }
    if (sujetos.length === 0) {
      return {
        estado: NO_PUDE_MEDIR,
        motivo: `la promesa "${promesa.id}" no encontro UNA sola superficie que lea el dato: el patron dejo de matchear o el arbol esta incompleto`,
        hallazgos: [],
      };
    }
    hallazgos.push({ promesa, sujetos, abiertas: sujetos.filter((s) => !s.cerrada) });
  }
  const rotas = hallazgos.filter((h) => h.abiertas.length > 0);
  return { estado: rotas.length ? DESALINEADO : COINCIDEN, hallazgos, rotas };
}

export function leerProducto({ local = listarLocal, remoto = listarPorSsh } = {}) {
  return local() ?? remoto();
}

function informe(resultado) {
  if (resultado.estado === NO_PUDE_MEDIR) {
    console.log(`NO MEDIDO — ${resultado.motivo}.`);
    console.log(`El producto se busca en ${REPO_PRODUCTO} y, si no esta, por SSH a ${VPS_SSH}.`);
    return NO_PUDE_MEDIR;
  }
  for (const h of resultado.hallazgos) {
    const total = h.sujetos.length;
    console.log(`\n"${h.promesa.marca}"  (${h.promesa.donde})`);
    console.log(`  el producto tiene que cerrarlo con ${h.promesa.permiso} — ${total} superficie(s) leen ese dato:`);
    for (const s of h.sujetos) console.log(`    ${s.cerrada ? "cerrada " : "ABIERTA "} ${s.ruta}`);
  }
  if (resultado.estado === COINCIDEN) {
    console.log("\nOK — todas las superficies que leen el dato piden el permiso. La promesa del sitio es cierta.");
    return COINCIDEN;
  }
  console.log("\nLA VENTA PROMETE ALGO QUE EL PRODUCTO NO CIERRA:");
  for (const h of resultado.rotas) {
    for (const s of h.abiertas) {
      console.log(`  ${s.ruta} lee el dato y NO pide ${h.promesa.permiso}: se abre por URL directa con cualquier rol de la organizacion.`);
    }
  }
  console.log("\nSe arregla en el PRODUCTO (otro repo), no borrando la frase: la promesa es correcta y");
  console.log("lo que falta es el guard. Si se decide que no se cierra, entonces la frase sale del sitio.");
  return DESALINEADO;
}

/* ─────────────────────────────  self-check puro  ───────────────────────────── */

const P = [
  { id: "x", marca: "m", donde: "d", permiso: "clinical.read", lee: /prisma\.prescription\b/ },
];
const CON_GUARD = `const ok = await hasPermissionForProfile(profile, "clinical.read");\nconst p = await prisma.prescription.findFirst({});`;
/** La otra forma REAL, la de las APIs. Acusarla fue el primer rojo falso de este gate. */
const CON_GUARD_API = `await requirePermission(profile, "clinical.read", req);\nconst p = await prisma.prescription.findFirst({});`;
const SIN_GUARD = `const p = await prisma.prescription.findFirst({});`;
const SOLO_COMENTADO = `// el guard fino: hasPermissionForProfile(profile, "clinical.read")\nconst p = await prisma.prescription.findFirst({});`;
const SOLO_LA_PALABRA = `<p>El odontograma y la historia clinica vienen con el plan.</p>`;
/** Declarar el permiso en una lista no es pedirlo: sin el parentesis de la llamada, no cuenta. */
const SOLO_DECLARADO = `const PERMISSIONS = ["clinical.read", "finance.read"];\nconst p = await prisma.prescription.findFirst({});`;

function selfCheck() {
  const casos = [
    ["una superficie con el guard no es hallazgo", () => medir(new Map([["a/page.tsx", CON_GUARD]]), P).estado === COINCIDEN],
    // Las dos formas REALES del producto. La segunda es la que el gate acuso en
    // falso el dia que se escribio: sin este caso, el rojo vuelve solo.
    ["la forma de las APIs (requirePermission) tambien cierra", () => medir(new Map([["a/route.ts", CON_GUARD_API]]), P).estado === COINCIDEN],
    ["declarar el permiso en una lista NO es pedirlo", () => medir(new Map([["a/page.tsx", SOLO_DECLARADO]]), P).estado === DESALINEADO],
    ["una superficie sin el guard sale ROJO", () => medir(new Map([["a/page.tsx", SIN_GUARD]]), P).estado === DESALINEADO],
    ["y la NOMBRA", () => medir(new Map([["a/page.tsx", SIN_GUARD]]), P).rotas[0].abiertas[0].ruta === "a/page.tsx"],
    // El esquive mas barato de esta familia: el comentario que explica el guard
    // contiene el texto que un gate ingenuo busca, y lo absuelve.
    ["el guard SOLO en un comentario no cuenta", () => medir(new Map([["a/page.tsx", SOLO_COMENTADO]]), P).estado === DESALINEADO],
    // El caso que YA CUMPLE, el unico que caza un detector demasiado ancho: si
    // el sujeto fuera "nombra el dato", /help y /privacy entrarian y el gate
    // mandaria a ponerle un guard clinico a la pagina de ayuda.
    ["una pagina que solo NOMBRA el dato no es sujeto", () => medir(new Map([["ayuda/page.tsx", SOLO_LA_PALABRA], ["a/page.tsx", CON_GUARD]]), P).hallazgos[0].sujetos.length === 1],
    ["un *Client.tsx no es puerta", () => !esSuperficie("PrescriptionsClient.tsx")],
    ["un test tampoco", () => !esSuperficie("route.test.ts")],
    // Las dos formas de fallar ABIERTO, que es como muere esta familia.
    ["sin producto sale NO MEDIDO, nunca verde", () => medir(null, P).estado === NO_PUDE_MEDIR],
    ["cero sujetos sale NO MEDIDO, nunca verde", () => medir(new Map([["a/page.tsx", SOLO_LA_PALABRA]]), P).estado === NO_PUDE_MEDIR],
    ["clinical.write alcanza para ver", () => medir(new Map([["a/page.tsx", CON_GUARD.replace("clinical.read", "clinical.write")]]), P).estado === COINCIDEN],
    ["leerProducto no inventa: si ninguno contesta, null", () => leerProducto({ local: () => null, remoto: () => null }) === null],
  ];
  let malos = 0;
  for (const [nombre, fn] of casos) {
    let ok = false;
    try {
      ok = fn() === true;
    } catch (e) {
      ok = false;
      nombre_error(nombre, e);
    }
    if (!ok) malos += 1;
    console.log(`${ok ? "ok  " : "FAIL"} ${nombre}`);
  }
  console.log(malos === 0 ? `\n${casos.length} casos, todos verdes.` : `\n${malos} caso(s) en rojo.`);
  return malos === 0 ? COINCIDEN : DESALINEADO;
}

function nombre_error(nombre, e) {
  console.log(`     (${nombre}: ${e?.message ?? e})`);
}

const ESTE = fileURLToPath(import.meta.url);
if (process.argv[1] && pathToFileURL(process.argv[1]).href === pathToFileURL(ESTE).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : informe(medir(leerProducto())));
}
