#!/usr/bin/env node
/**
 * boton_conectar_whatsapp.mjs — mide el PUNTO (2) de la tarjeta "Tu WhatsApp":
 * "al hacer clic abre el flujo de Meta (o muestra por que no) — medido, no supuesto".
 *
 *   node scripts/boton_conectar_whatsapp.mjs                      # cuenta QA con add-on
 *   node scripts/boton_conectar_whatsapp.mjs --email X --salida /root/x.png
 *   node scripts/boton_conectar_whatsapp.mjs --self-check
 *
 * CODIGOS DE SALIDA
 *   0  el flujo de Meta abre, O la tarjeta dice por que no  → el punto (2) se cumple
 *   1  el boton queda muerto en "Conectando…" sin salida    → es EL bug, no un exito parcial
 *   2  no se pudo medir (no hay boton que apretar)          → no medir NO es estar bien
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE
 *
 * El punto (2) de `t_6bf938b7` llevaba CINCO dias sin poder medirse, y las dos veces que se
 * intento fue con una sonda ad-hoc que no quedo en el repo. Eso no es un detalle de prolijidad:
 * este boton es el del add-on que se COBRA, y su modo de falla es mudo — la pantalla se ve
 * perfecta, no hay error en consola y no hay request fallida. Una captura sola le da VERDE.
 *
 * ⚠️ LO QUE NINGUN INSTRUMENTO DEL PROYECTO MIRABA: `page.on("popup")`. El bug de 77d0867 era
 * que un `await` de red dentro del handler del clic gastaba el gesto del usuario, y sin gesto
 * el navegador BLOQUEA la ventana que Meta abre despues. El sintoma engana porque el SDK SI
 * carga (`window.FB` es object) y la request del SDK sale 200: todo lo que un gate mira
 * habitualmente esta sano, y lo unico que falta es la ventana. Se ve escuchando el evento
 * `popup`, y de ninguna otra forma.
 *
 * ⚠️ EL MENSAJE NO SE LEE POR CLASES CSS. Ese metodo ya fallo mudo en este proyecto contra una
 * app con logica en servidor (recorrido-cliente, 2026-09-04): `[role=alert]` y `.text-red-500`
 * no encuentran nada y el gate firma "sin mensaje visible" sobre una pantalla que dice el
 * motivo entero. Se guarda el texto visible ANTES de apretar y se toman las lineas que
 * aparecieron DESPUES: eso es, sin adivinar, lo que el producto contesto.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const ejecutar = promisify(execFile);
const CONTENEDOR_DB = "supabase-db";

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

/** Texto del boton que dispara el Embedded Signup (CanalWhatsappCard.tsx:220). */
export const BOTON = "Conectar mi WhatsApp";

/**
 * La decision, separada de la medicion para poder probarla sin red.
 *
 * El veredicto se apoya en hechos ESTRUCTURALES (hubo ventana / el boton quedo trabado / el
 * producto dijo algo), no en el texto del boton: el rotulo se puede cambiar sin que el defecto
 * cambie, y un gate atado al rotulo se apaga con el primer retoque de copy.
 */
export function veredicto({ botonPresente, popupAbierto, deshabilitadoFinal, mensajeNuevo, motivoAusencia }) {
  if (!botonPresente) {
    return {
      codigo: 2,
      resumen: `NO MEDIDO — no hay boton "${BOTON}" que apretar${motivoAusencia ? `: ${motivoAusencia}` : ""}.`,
    };
  }
  if (popupAbierto) {
    return { codigo: 0, resumen: "El flujo de Meta ABRE: el clic abrio la ventana del Embedded Signup." };
  }
  // Sin ventana, el punto (2) todavia se cumple si la tarjeta EXPLICA por que no. Lo que no
  // vale es quedarse trabado: eso es exactamente el bug que 77d0867 vino a cerrar.
  if (mensajeNuevo) {
    return { codigo: 0, resumen: `No abrio ventana, pero la tarjeta dice por que: "${mensajeNuevo}"` };
  }
  if (deshabilitadoFinal) {
    return {
      codigo: 1,
      resumen: 'EL BUG: el boton quedo DESHABILITADO en "Conectando…", sin ventana, sin mensaje y sin salida salvo recargar.',
    };
  }
  return {
    codigo: 1,
    resumen: "EL BUG: el clic no abrio ventana y la tarjeta no dijo nada — el dueno no tiene forma de saber que paso.",
  };
}

/** Lineas de texto que apareciron DESPUES del clic (sin adivinar clases CSS). */
export function lineasNuevas(antes, despues) {
  const previas = new Set(antes.split("\n").map((l) => l.trim()).filter(Boolean));
  return despues
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !previas.has(l));
}

// ── de quien se mide: se DERIVA del sistema, no se escribe ──────────────────────────────
//
// Esto nacio de un exit 2 permanente. El sujeto era el literal
// `oninteligenciaartificial+qacomercio@gmail.com`, una cuenta QA que ya no existe en
// produccion (`profiles` devuelve 0), asi que el instrumento salia 2 TODAS las vueltas —
// y un exit 2 que no cambia se lee como "el ambiental de siempre" y se saltea. El punto (2)
// de `t_6bf938b7` quedaba sin medir con el gate en pie, que es peor que no tenerlo: da la
// sensacion de estar vigilado.
//
// La org interna NO sirve de sujeto: su pack es de operacion, no de rubro, asi que no
// renderiza la tarjeta de un cliente (y ademas pide 2FA).
export const ORGS_QUE_NO_MIDEN = ["onia-interna"];

/** Filas crudas de psql (-tAF|) → objetos. Vacio si la consulta no devolvio nada. */
export function parsearFilas(stdout) {
  return String(stdout)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [slug, addon, status, validUntil, email, role] = l.split("|");
      return {
        slug,
        whatsappAddon: addon === "t",
        status: status && status !== "-" ? status : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        email: email || "",
        role: role || "",
      };
    });
}

/**
 * Elige el dueno sobre el que se mide la tarjeta.
 *
 * ⚠️ El add-on se pregunta con el criterio UNICO de `lib/plan-limits.ts`
 * (`isWhatsAppAddonActive`): la columna vieja `organizations."whatsappAddon"` **O** el
 * entitlement `addon.whatsapp` vigente. Leer solo la columna invierte el diagnostico — en
 * produccion miente para 3 de las 4 orgs que tienen el add-on, y el instrumento elegiria
 * una org sin boton y firmaria "NO MEDIDO" por el motivo equivocado.
 *
 * Devuelve `{ email, slug }`, o `{ email: null, motivo }` — nunca un sujeto inventado: no
 * poder elegir es un resultado, y su motivo tiene que nombrar lo que falta en el sistema.
 */
export function elegirSujeto(filas, ahora = new Date()) {
  const conAddon = filas.filter(
    (f) => f.whatsappAddon || (f.status === "active" && (f.validUntil === null || f.validUntil > ahora)),
  );
  if (conAddon.length === 0) {
    return { email: null, motivo: "ninguna org de produccion tiene el add-on de WhatsApp activo" };
  }
  const medibles = conAddon.filter((f) => !ORGS_QUE_NO_MIDEN.includes(f.slug));
  if (medibles.length === 0) {
    return {
      email: null,
      motivo: `las unicas orgs con el add-on son internas (${conAddon.map((f) => f.slug).join(", ")}): no renderizan la tarjeta de un cliente`,
    };
  }
  const duenos = medibles.filter((f) => f.role === "ADMIN" && f.email);
  if (duenos.length === 0) {
    return {
      email: null,
      motivo: `las orgs con el add-on (${medibles.map((f) => f.slug).join(", ")}) no tienen ningun perfil ADMIN con correo`,
    };
  }
  return { email: duenos[0].email, slug: duenos[0].slug };
}

/** Pregunta a la base de produccion quien puede ser el sujeto. */
async function sujetoDerivado() {
  const sql =
    'select o.slug, o."whatsappAddon", coalesce(e.status,\'-\'), coalesce(e."validUntil"::text,\'\'), ' +
    // `role` es un enum: sin ::text, coalesce falla con «invalid input value for enum "Role"»
    // y la consulta entera se cae. Medido el 2026-09-27.
    "coalesce(p.email,''), coalesce(p.role::text,'') from organizations o " +
    'left join organization_entitlements e on e."organizationId"=o.id ' +
    "and e.\"featureKey\"='addon.whatsapp' " +
    'join profiles p on p."organizationId"=o.id order by o.slug, p.role;';
  // No poder PREGUNTAR no es "el boton esta roto": si esto escapa como excepcion, el proceso
  // muere con 1, y en este instrumento 1 significa EL BUG. Se devuelve sin sujeto (→ 2).
  let stdout;
  try {
    ({ stdout } = await ejecutar(
      "docker",
      ["exec", CONTENEDOR_DB, "psql", "-U", "postgres", "-d", "postgres", "-tAF|", "-c", sql],
      { maxBuffer: 8 * 1024 * 1024 },
    ));
  } catch (e) {
    const detalle = String(e?.stderr || e?.message || e).split("\n")[0];
    return { email: null, motivo: `no se pudo preguntar a la base de produccion: ${detalle}` };
  }
  return elegirSujeto(parsearFilas(stdout));
}

// ── self-check ──────────────────────────────────────────────────────────────────────────
// Los casos van en las DOS direcciones. Uno que solo pruebe el rojo pasa igual con el gate
// roto: hace falta el caso que TIENE que dar verde (aca, la ventana que abre) para que una
// mutacion del tipo "devolver siempre 1" no salga impune.
export function casos() {
  return [
    {
      que: "la ventana de Meta abre → verde",
      obs: { botonPresente: true, popupAbierto: true, deshabilitadoFinal: true, mensajeNuevo: "" },
      espera: 0,
    },
    {
      que: "no abre pero la tarjeta explica por que → verde",
      obs: { botonPresente: true, popupAbierto: false, deshabilitadoFinal: false, mensajeNuevo: "Falta aprobar la app en Meta." },
      espera: 0,
    },
    {
      que: "trabado en Conectando… sin mensaje → EL BUG",
      obs: { botonPresente: true, popupAbierto: false, deshabilitadoFinal: true, mensajeNuevo: "" },
      espera: 1,
    },
    {
      que: "clic sin ventana y sin mensaje, boton suelto → EL BUG",
      obs: { botonPresente: true, popupAbierto: false, deshabilitadoFinal: false, mensajeNuevo: "" },
      espera: 1,
    },
    {
      que: "sin boton (org sin add-on) → NO MEDIDO, nunca verde",
      obs: { botonPresente: false, popupAbierto: false, deshabilitadoFinal: false, mensajeNuevo: "", motivoAusencia: "la tarjeta ofrece 'Contratar el chatbot'" },
      espera: 2,
    },
    // ── la eleccion del sujeto ───────────────────────────────────────────────────────────
    // El caso que importa es el PRIMERO: con el criterio a medias (solo la columna vieja)
    // esta org queda afuera, el instrumento elige otra sin boton y firma "NO MEDIDO" por el
    // motivo equivocado. Es el mismo error que ya invirtio diagnosticos en produccion.
    {
      que: "org con el add-on SOLO por entitlement (columna en false) → es sujeto valido",
      fn: () =>
        elegirSujeto([
          { slug: "tienda-x", whatsappAddon: false, status: "active", validUntil: null, email: "d@x.bo", role: "ADMIN" },
        ]).email,
      esperaFn: "d@x.bo",
    },
    {
      que: "org con el add-on SOLO por la columna vieja (sin entitlement) → tambien es valido",
      fn: () =>
        elegirSujeto([
          { slug: "tienda-y", whatsappAddon: true, status: null, validUntil: null, email: "d@y.bo", role: "ADMIN" },
        ]).email,
      esperaFn: "d@y.bo",
    },
    {
      que: "entitlement VENCIDO no alcanza: no es sujeto",
      fn: () =>
        elegirSujeto(
          [{ slug: "tienda-z", whatsappAddon: false, status: "active", validUntil: new Date("2026-01-01"), email: "d@z.bo", role: "ADMIN" }],
          new Date("2026-09-27"),
        ).email,
      esperaFn: null,
    },
    {
      que: "la org interna no mide aunque tenga el add-on → sin sujeto, con su motivo",
      fn: () =>
        elegirSujeto([
          { slug: "onia-interna", whatsappAddon: true, status: "active", validUntil: null, email: "superadmin@onia.com.bo", role: "SUPERADMIN" },
        ]).email,
      esperaFn: null,
    },
    {
      que: "org con add-on pero sin perfil ADMIN → sin sujeto, nunca uno inventado",
      fn: () =>
        elegirSujeto([
          { slug: "tienda-w", whatsappAddon: true, status: null, validUntil: null, email: "", role: "STAFF" },
        ]).email,
      esperaFn: null,
    },
    {
      que: "base vacia → sin sujeto (no puede salir verde por no encontrar nada)",
      fn: () => elegirSujeto([]).email,
      esperaFn: null,
    },
    {
      que: "parsearFilas lee la fila de psql tal como sale (-tAF|)",
      fn: () => {
        const f = parsearFilas("clinica-sergio-p2ljs|t|active||sergio@onia.com.bo|ADMIN\n")[0];
        return `${f.slug}/${f.whatsappAddon}/${f.status}/${f.email}/${f.role}`;
      },
      esperaFn: "clinica-sergio-p2ljs/true/active/sergio@onia.com.bo/ADMIN",
    },
    {
      que: "lineasNuevas no repite lo que ya estaba",
      fn: () => lineasNuevas("Tu WhatsApp\nConectar mi WhatsApp", "Tu WhatsApp\nConectar mi WhatsApp\nAlgo falló").join("|"),
      esperaFn: "Algo falló",
    },
  ];
}

function selfCheck() {
  let fallos = 0;
  for (const c of casos()) {
    const obtenido = c.fn ? c.fn() : veredicto(c.obs).codigo;
    const esperado = c.fn ? c.esperaFn : c.espera;
    if (obtenido !== esperado) {
      console.error(`FAIL ${c.que} — esperaba ${JSON.stringify(esperado)}, dio ${JSON.stringify(obtenido)}`);
      fallos++;
    } else {
      console.log(`ok   ${c.que}`);
    }
  }
  console.log(fallos ? `\n${fallos} caso(s) en rojo` : `\n${casos().length} casos verdes`);
  return fallos ? 1 : 0;
}

// ── medicion viva ───────────────────────────────────────────────────────────────────────
async function medir() {
  // El sujeto se DERIVA salvo que lo fuercen: un literal aca se muere solo el dia que la
  // cuenta se borra, y el instrumento sigue en pie diciendo "NO MEDIDO" para siempre.
  let EMAIL = arg("email", "");
  if (!EMAIL) {
    const s = await sujetoDerivado();
    if (!s.email) {
      console.error(`NO MEDIDO — no hay sobre quien medir: ${s.motivo}.`);
      process.exit(2);
    }
    EMAIL = s.email;
    console.log(`sujeto derivado de produccion: ${EMAIL} (org ${s.slug}, add-on activo)`);
  }
  const SALIDA = arg("salida", "/root/capturas-tarjeta/whatsapp-clic.png");
  const ESPERA = Number(arg("espera", "35000"));

  const { navegador, pagina, host, fallos } = await navegadorConSesion(EMAIL);
  await pagina.goto(`https://${host}/settings/chatbot`, { waitUntil: "networkidle", timeout: 90000 });
  await pagina.addStyleTag({ content: "*{scroll-behavior:auto !important}" });
  await pagina.waitForTimeout(2500);

  const urlFinal = pagina.url();
  console.log("URL final:", urlFinal);
  if (new URL(urlFinal).pathname !== "/settings/chatbot") {
    console.error(`La sesión NO entró: terminó en ${new URL(urlFinal).pathname}.`);
    await navegador.close();
    process.exit(2);
  }

  // La ventana se escucha ANTES del clic: si se engancha despues, la carrera la gana Meta.
  let popupAbierto = false;
  let urlPopup = "";
  pagina.on("popup", (p) => { popupAbierto = true; urlPopup = p.url(); });

  const boton = pagina.locator(`button:has-text("${BOTON}")`).first();
  const botonPresente = await boton.count().then((n) => n > 0);
  let motivoAusencia = "";
  if (!botonPresente) {
    const cuerpo = await pagina.locator("body").innerText();
    motivoAusencia = /Contratar el chatbot/.test(cuerpo)
      ? "la tarjeta ofrece 'Contratar el chatbot' (esta org no tiene el add-on activo)"
      : "la tarjeta no muestra el boton y tampoco la oferta de contratar";
  }

  let deshabilitadoFinal = false;
  let mensajeNuevo = "";
  let textoFinal = "";
  if (botonPresente) {
    const antes = await pagina.locator("body").innerText();
    await boton.scrollIntoViewIfNeeded();
    await boton.click();
    // Se muestrea a lo largo de la espera: el bug no aparece al instante, aparece cuando el
    // callback que devolveria el control NUNCA dispara.
    for (const t of [3000, 10000, 20000, ESPERA]) {
      await pagina.waitForTimeout(t === 3000 ? 3000 : 7000);
      deshabilitadoFinal = await boton.isDisabled().catch(() => false);
      textoFinal = (await boton.innerText().catch(() => "")).trim();
      console.log(`  t≈${t / 1000}s · popup=${popupAbierto} · deshabilitado=${deshabilitadoFinal} · texto="${textoFinal}"`);
      if (popupAbierto) break;
    }
    const despues = await pagina.locator("body").innerText();
    mensajeNuevo = lineasNuevas(antes, despues).filter((l) => l !== textoFinal).join(" · ");
  }

  await pagina.screenshot({ path: SALIDA, fullPage: true });
  console.log("respuestas >=400:", fallos.length ? `\n  ${fallos.slice(0, 8).join("\n  ")}` : "ninguna");
  console.log("captura:", SALIDA);
  if (urlPopup) console.log("ventana de Meta:", urlPopup);
  await navegador.close();

  const v = veredicto({ botonPresente, popupAbierto, deshabilitadoFinal, mensajeNuevo, motivoAusencia });
  console.log(`\nVEREDICTO: ${v.resumen}`);
  return v.codigo;
}

// Sin esta guarda, importar el modulo para probar su funcion pura dispara la medicion viva
// contra PRODUCCION y mata al proceso importador con su process.exit().
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : await medir());
}
