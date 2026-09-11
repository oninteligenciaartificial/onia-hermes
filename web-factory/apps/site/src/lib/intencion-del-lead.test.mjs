/**
 * Gate: el intake no puede afirmar que un lead pidió una reunión.
 *
 * Dos mitades, porque ninguna ve lo de la otra:
 *   · COMPORTAMIENTO — lo que `intencionDelLead` DEVUELVE con cada entrada.
 *   · CABLEADO — que el route USE lo devuelto. Un módulo impecable que el
 *     llamador ignora es el hueco que `tsc` no ve: el esquive barato es
 *     llamarlo y tirar el resultado, así que se ancla la ASIGNACIÓN, nunca la
 *     mera presencia del símbolo en el archivo.
 *
 * El código se mide con los comentarios en blanco: si no, esta misma bitácora
 * —que cita "solicitada" para explicar el defecto— absuelve al gate.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { intencionDelLead } from "./intencion-del-lead.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RUTA_INTAKE = join(
  AQUI,
  "..",
  "app",
  "api",
  "onia-center",
  "leads",
  "intake",
  "route.ts",
);

/** Reemplaza comentarios por espacios, conservando los saltos de línea. */
function sinComentarios(fuente) {
  let salida = "";
  let i = 0;
  let cadena = null; // comilla abierta, o null
  while (i < fuente.length) {
    const c = fuente[i];
    const par = fuente.slice(i, i + 2);
    if (cadena) {
      if (c === "\\") {
        salida += fuente.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === cadena) cadena = null;
      salida += c;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      cadena = c;
      salida += c;
      i += 1;
      continue;
    }
    if (par === "//") {
      while (i < fuente.length && fuente[i] !== "\n") {
        salida += " ";
        i += 1;
      }
      continue;
    }
    if (par === "/*") {
      const fin = fuente.indexOf("*/", i + 2);
      const hasta = fin === -1 ? fuente.length : fin + 2;
      for (; i < hasta; i += 1) salida += fuente[i] === "\n" ? "\n" : " ";
      continue;
    }
    salida += c;
    i += 1;
  }
  return salida;
}

const CODIGO = sinComentarios(readFileSync(RUTA_INTAKE, "utf8"));

// ── COMPORTAMIENTO ──────────────────────────────────────────────────────────

test("sin declarar nada, el lead NO pidió reunión", () => {
  const { nextAction, meetingStatus } = intencionDelLead({ src: "guia-siat" });
  assert.equal(meetingStatus, "pendiente");
  assert.ok(
    !/demo/i.test(nextAction),
    `la acción no puede hablar de una demo que nadie pidió: ${nextAction}`,
  );
});

test("el imán de leads del SIN entra como primer contacto, no como demo", () => {
  // El único llamador vivo: /guia-facturacion manda correo, whatsapp y src.
  const intencion = intencionDelLead({ src: "guia-siat", rubro: "" });
  assert.deepEqual(intencion, {
    nextAction: "Primer contacto",
    meetingStatus: "pendiente",
  });
});

test("sólo `pidioDemo: true` declara una reunión pedida", () => {
  const pedida = intencionDelLead({ pidioDemo: true, rubro: "dental" });
  assert.deepEqual(pedida, {
    nextAction: "Confirmar demo (dental)",
    meetingStatus: "solicitada",
  });
  assert.equal(
    intencionDelLead({ pidioDemo: true }).nextAction,
    "Confirmar demo",
  );
});

test("un `pidioDemo` que no es el booleano true no alcanza", () => {
  // Llega de la red: una cadena "false", un 1 o un objeto no son un pedido.
  for (const valor of ["true", "false", 1, 0, {}, [], null, undefined, "si"]) {
    assert.equal(
      intencionDelLead({ pidioDemo: valor }).meetingStatus,
      "pendiente",
      `pidioDemo=${JSON.stringify(valor)} no puede valer por un pedido de reunión`,
    );
  }
});

test("el rubro viaja a la acción en las dos ramas, y no inventa paréntesis vacío", () => {
  assert.equal(
    intencionDelLead({ rubro: "comercio" }).nextAction,
    "Primer contacto (comercio)",
  );
  assert.equal(intencionDelLead({ rubro: "   " }).nextAction, "Primer contacto");
});

// ── CABLEADO ────────────────────────────────────────────────────────────────

test("el intake importa la decisión", () => {
  assert.match(
    CODIGO,
    /import\s*\{[^}]*\bintencionDelLead\b[^}]*\}\s*from\s*["'][^"']*intencion-del-lead\.mjs["']/,
    "el route dejó de importar intencionDelLead",
  );
});

test("el intake USA lo devuelto: la asignación, no la llamada suelta", () => {
  const asignada = CODIGO.match(
    /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*intencionDelLead\s*\(/,
  );
  assert.ok(
    asignada,
    "llamar a intencionDelLead y tirar el resultado no es usarlo: hay que asignarlo",
  );
  const v = asignada[1];
  assert.match(
    CODIGO,
    new RegExp(`nextAction:\\s*${v}\\.nextAction\\b`),
    `nextAction tiene que salir de ${v}, no escribirse a mano`,
  );
  assert.match(
    CODIGO,
    new RegExp(`meetingStatus:\\s*${v}\\.meetingStatus\\b`),
    `meetingStatus tiene que salir de ${v}, no escribirse a mano`,
  );
});

test("el intake no vuelve a afirmar una reunión por su cuenta", () => {
  for (const prohibido of ["solicitada", "confirmada", "Confirmar demo"]) {
    assert.ok(
      !CODIGO.includes(prohibido),
      `el route escribe "${prohibido}" a mano: eso es lo que decide intencion-del-lead.mjs`,
    );
  }
});
