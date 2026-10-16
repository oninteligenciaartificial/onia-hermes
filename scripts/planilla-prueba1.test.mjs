// La planilla de la prueba 1 (PLANILLA-PRUEBA-1.xlsx) no puede contradecir a la spec, y sus fórmulas deben cortar donde ADQ §5.7 dice.
//   node --test scripts/planilla-prueba1.test.mjs
//
// ORIGEN (2026-10-11, tarea 3 de la MADRE MARKETING). Una planilla decide cuándo se PAUSA un anuncio con plata de Sergio
// Urcullo; una fórmula que corta en el día 7 con un 40 mal escrito, o que dice «SEGUIR» con 0 dueños, cuesta dinero.
//
// CÓMO SE VERIFICA, y qué NO se verificó: en este entorno no hay Calc (solo `libreoffice-core`; instalarlo pide aprobación,
// CLAUDE.md «Acceso local…»), así que el .xlsx NO se abrió en Excel ni en Calc. Este test lee el .xlsx REAL (zip → XML →
// fórmulas) y las evalúa con un intérprete mínimo (IF, N, SUM, SUMIFS, SUMPRODUCT, MAX, ROUND, AND, OR, LEFT) que sigue las
// reglas de Excel que la planilla usa (texto > número al comparar; vacío = 0). Si una fórmula usa otra función, el intérprete
// falla y el test se pone rojo: eso evita que una función ajena pase sin que nadie la pruebe. Lo que queda sin probar es
// cómo la abre Excel (avisos de formato) y su aspecto: primer uso = abrirla y comprobar que Cortes dice «SIN DATOS».
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { inflateRawSync } from "node:zlib";

import { construirPlanilla, SALIDA_POR_DEFECTO, SPEC_RUTA } from "../.claude/skills/onia-ventas-pauta/scripts/planilla-prueba1.mjs";

const leer = (ruta) => readFileSync(new URL(`../${ruta}`, import.meta.url));
const spec = JSON.parse(leer(SPEC_RUTA).toString("utf8"));

// ───────── unzip mínimo (directorio central + inflate) ─────────
function descomprimir(buf) {
  const fin = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.ok(fin >= 0, "no es un zip");
  const n = buf.readUInt16LE(fin + 10);
  let p = buf.readUInt32LE(fin + 16);
  const archivos = new Map();
  for (let i = 0; i < n; i += 1) {
    assert.equal(buf.readUInt32LE(p), 0x02014b50, "directorio central roto");
    const metodo = buf.readUInt16LE(p + 10);
    const tam = buf.readUInt32LE(p + 20);
    const nom = buf.readUInt16LE(p + 28);
    const extra = buf.readUInt16LE(p + 30);
    const coment = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nombre = buf.subarray(p + 46, p + 46 + nom).toString("utf8");
    const inicio = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const datos = buf.subarray(inicio, inicio + tam);
    archivos.set(nombre, (metodo === 8 ? inflateRawSync(datos) : datos).toString("utf8"));
    p += 46 + nom + extra + coment;
  }
  return archivos;
}
// Bien formado: cada etiqueta se abre y se cierra en orden (suficiente para cazar un XML roto a mano).
function xmlBienFormado(xml) {
  const pila = [];
  for (const m of xml.replace(/<\?[\s\S]*?\?>/g, "").matchAll(/<(\/?)([A-Za-z_][\w:.-]*)((?:\s+[\w:.-]+="[^"]*")*)\s*(\/?)>/g)) {
    if (m[4]) continue;
    if (m[1]) assert.equal(pila.pop(), m[2], `etiqueta </${m[2]}> sin su apertura`);
    else pila.push(m[2]);
  }
  assert.equal(pila.length, 0, `etiquetas sin cerrar: ${pila.join(",")}`);
  assert.ok(!/<[^>]*<|&(?!(amp|lt|gt|quot|apos);)/.test(xml.replace(/<\?[\s\S]*?\?>/g, "")), "símbolo suelto sin escapar");
}
const desescapar = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

function cargarLibro(buffer) {
  const arch = descomprimir(buffer);
  for (const [nombre, xml] of arch) if (/\.(xml|rels)$/.test(nombre)) xmlBienFormado(xml);
  const hojasXml = [...arch.get("xl/workbook.xml").matchAll(/<sheet name="([^"]+)" sheetId="(\d+)"/g)].map((m) => ({ nombre: desescapar(m[1]), n: Number(m[2]) }));
  const nombres = new Map([...arch.get("xl/workbook.xml").matchAll(/<definedName name="(\w+)">([^<]+)<\/definedName>/g)].map((m) => [m[1], desescapar(m[2])]));
  const hojas = new Map();
  for (const h of hojasXml) {
    const xml = arch.get(`xl/worksheets/sheet${h.n}.xml`);
    const celdas = new Map();
    for (const m of xml.matchAll(/<c r="([A-Z]+\d+)"(?: s="\d+")?(?: t="(\w+)")?(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const cuerpo = m[3] ?? "";
      const f = cuerpo.match(/<f>([\s\S]*?)<\/f>/);
      const v = cuerpo.match(/<v>([\s\S]*?)<\/v>/);
      const t = cuerpo.match(/<t[^>]*>([\s\S]*?)<\/t>/);
      celdas.set(m[1], f ? { f: desescapar(f[1]) } : v ? { v: Number(v[1]) } : t ? { v: desescapar(t[1]) } : { v: null });
    }
    hojas.set(h.nombre, celdas);
  }
  return { hojas, nombres, arch };
}

// ───────── intérprete mínimo de fórmulas ─────────
const colANum = (c) => [...c].reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0);
const numACol = (n) => {
  let s = "";
  for (let k = n; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(65 + ((k - 1) % 26)) + s;
  return s;
};

function evaluador(libro) {
  const memo = new Map();
  const celda = (hoja, dir) => {
    const clave = `${hoja}!${dir}`;
    if (memo.has(clave)) return memo.get(clave);
    const c = libro.hojas.get(hoja)?.get(dir);
    let v = null;
    if (c?.f !== undefined) v = evaluar(c.f, hoja);
    else if (c) v = c.v;
    memo.set(clave, v);
    return v;
  };
  const rango = (hoja, a, b) => {
    const [, ca, ra] = a.match(/([A-Z]+)(\d+)/);
    const [, cb, rb] = b.match(/([A-Z]+)(\d+)/);
    const out = [];
    for (let r = Number(ra); r <= Number(rb); r += 1) for (let c = colANum(ca); c <= colANum(cb); c += 1) out.push(celda(hoja, `${numACol(c)}${r}`));
    return out;
  };
  const num = (x) => (x === null || x === "" ? 0 : typeof x === "boolean" ? Number(x) : typeof x === "number" ? x : Number.NaN);
  const comparar = (a, b, op) => {
    const rango_ = (x) => (typeof x === "string" ? 2 : typeof x === "boolean" ? 3 : 1);
    if (a === null) a = typeof b === "string" ? "" : 0;
    if (b === null) b = typeof a === "string" ? "" : 0;
    let c;
    if (rango_(a) !== rango_(b)) c = rango_(a) - rango_(b);
    else if (typeof a === "string") c = a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
    else c = a - b;
    return { "=": c === 0, "<>": c !== 0, "<": c < 0, ">": c > 0, "<=": c <= 0, ">=": c >= 0 }[op];
  };
  const lift = (a, b, fn) => (Array.isArray(a) || Array.isArray(b) ? (Array.isArray(a) ? a : b.map(() => a)).map((x, i) => fn(x, Array.isArray(b) ? b[i] : b)) : fn(a, b));

  function evaluar(formula, hojaActual) {
    const tokens = [];
    const re = /\s*(?:(\d+(?:\.\d+)?)|"((?:[^"]|"")*)"|((?:'[^']+'|[A-Za-z_]\w*)!\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)|(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)(?![\w(])|([A-Za-z_][\w.]*)(\()?|(<=|>=|<>|[-+*/&=<>(),]))/gy;
    let m;
    while (re.lastIndex < formula.length && (m = re.exec(formula))) {
      if (m[1] !== undefined) tokens.push({ t: "num", v: Number(m[1]) });
      else if (m[2] !== undefined) tokens.push({ t: "str", v: m[2].replace(/""/g, '"') });
      else if (m[3] !== undefined) tokens.push({ t: "ref", v: m[3] });
      else if (m[4] !== undefined) tokens.push({ t: "ref", v: m[4] });
      else if (m[5] !== undefined) tokens.push(m[6] ? { t: "fn", v: m[5].toUpperCase() } : { t: "nom", v: m[5] });
      else tokens.push({ t: "op", v: m[7] });
    }
    assert.equal(re.lastIndex >= formula.length || tokens.length > 0, true, `no se pudo leer la fórmula: ${formula}`);
    let i = 0;
    const sig = () => tokens[i];
    const come = (v) => {
      assert.ok(sig() && sig().v === v, `se esperaba «${v}» en ${formula}`);
      i += 1;
    };
    const resolverRef = (txt, hoja) => {
      let h = hoja;
      let r = txt;
      if (txt.includes("!")) {
        const [hh, rr] = txt.split("!");
        h = hh.replace(/^'|'$/g, "");
        r = rr;
      }
      r = r.replace(/\$/g, "");
      const [a, b] = r.split(":");
      return b ? rango(h, a, b) : celda(h, a);
    };
    const nombre = (n) => {
      assert.ok(libro.nombres.has(n), `nombre no definido: ${n} en ${formula}`);
      return resolverRef(libro.nombres.get(n), hojaActual);
    };
    // gramática: comparación < & < suma < producto < unario < primario
    const comp = () => {
      let a = concat();
      while (sig()?.t === "op" && ["=", "<>", "<", ">", "<=", ">="].includes(sig().v)) {
        const op = sig().v;
        i += 1;
        const b = concat();
        a = lift(a, b, (x, y) => comparar(x, y, op));
      }
      return a;
    };
    const concat = () => {
      let a = suma();
      while (sig()?.v === "&" && sig().t === "op") {
        i += 1;
        const b = suma();
        a = `${a ?? ""}${b ?? ""}`;
      }
      return a;
    };
    const suma = () => {
      let a = prod();
      while (sig()?.t === "op" && (sig().v === "+" || sig().v === "-")) {
        const op = sig().v;
        i += 1;
        const b = prod();
        a = lift(a, b, (x, y) => (op === "+" ? num(x) + num(y) : num(x) - num(y)));
      }
      return a;
    };
    const prod = () => {
      let a = unario();
      while (sig()?.t === "op" && (sig().v === "*" || sig().v === "/")) {
        const op = sig().v;
        i += 1;
        const b = unario();
        a = lift(a, b, (x, y) => (op === "*" ? num(x) * num(y) : num(x) / num(y)));
      }
      return a;
    };
    const unario = () => {
      if (sig()?.t === "op" && sig().v === "-") {
        i += 1;
        const a = unario();
        return Array.isArray(a) ? a.map((x) => -num(x)) : -num(a);
      }
      return primario();
    };
    const planos = (args) => args.flatMap((a) => (Array.isArray(a) ? a : [a]));
    const FN = {
      N: ([x]) => (typeof x === "number" ? x : typeof x === "boolean" ? Number(x) : 0),
      ISNUMBER: ([x]) => (Array.isArray(x) ? x.map((v) => typeof v === "number") : typeof x === "number"),
      SUM: (args) => planos(args).reduce((a, x) => a + (typeof x === "number" ? x : 0), 0),
      MAX: (args) => Math.max(...planos(args).filter((x) => typeof x === "number" || typeof x === "boolean").map(Number), 0),
      SUMPRODUCT: ([a]) => (Array.isArray(a) ? a.reduce((s, x) => s + num(x), 0) : num(a)),
      ROUND: ([x, d]) => Math.round(num(x) * 10 ** num(d)) / 10 ** num(d),
      AND: (args) => planos(args).every(Boolean),
      OR: (args) => planos(args).some(Boolean),
      LEFT: ([s, n]) => String(s ?? "").slice(0, num(n)),
      SUMIFS: ([suma_, ...pares]) => {
        let ok = suma_.map(() => true);
        for (let k = 0; k < pares.length; k += 2) {
          const rng = pares[k];
          const crit = pares[k + 1];
          const t = typeof crit === "string" ? crit.match(/^(<=|>=|<>|<|>|=)?(.*)$/s) : [null, "=", String(crit)];
          const op = t[1] || "=";
          const objetivo = t[2] !== "" && !Number.isNaN(Number(t[2])) ? Number(t[2]) : t[2];
          ok = ok.map((v, j) => v && (rng[j] !== null && comparar(rng[j], objetivo, op)));
        }
        return suma_.reduce((s, x, j) => s + (ok[j] && typeof x === "number" ? x : 0), 0);
      },
    };
    const primario = () => {
      const t = sig();
      assert.ok(t, `fórmula incompleta: ${formula}`);
      i += 1;
      if (t.t === "num" || t.t === "str") return t.v;
      if (t.t === "ref") return resolverRef(t.v, hojaActual);
      if (t.t === "nom") return nombre(t.v);
      if (t.t === "op" && t.v === "(") {
        const v = comp();
        come(")");
        return v;
      }
      if (t.t === "fn") {
        // el token de función ya trae su «(» (lo lee el tokenizador junto al nombre)
        if (t.v === "IF") {
          const c = comp();
          come(",");
          // IF evalúa solo la rama que toca: se salta la otra leyéndola sin efecto.
          const posA = i;
          const a = comp();
          let b = false;
          if (sig()?.v === ",") {
            i += 1;
            b = comp();
          }
          come(")");
          void posA;
          return c ? a : b;
        }
        assert.ok(FN[t.v], `función sin soporte en el intérprete: ${t.v} (si es válida, agregarla con su prueba)`);
        const args = [];
        if (sig()?.v !== ")") {
          args.push(comp());
          while (sig()?.v === ",") {
            i += 1;
            args.push(comp());
          }
        }
        come(")");
        return FN[t.v](args);
      }
      assert.fail(`token inesperado «${t.v}» en ${formula}`);
      return null;
    };
    const resultado = comp();
    assert.equal(i, tokens.length, `sobró texto en la fórmula: ${formula}`);
    return resultado;
  }
  return { celda };
}

// ───────── datos de prueba ─────────
const planilla = (opciones) => cargarLibro(construirPlanilla(opciones).buffer);
const vacio = construirPlanilla();
const { anuncios, cortes } = vacio.resumen;
const COD = Object.fromEntries(anuncios.map((a) => [a.id, a.codigo]));

// Diario: filas 6..75, 14 por anuncio en el orden de la spec. Los 4 que entran: D10, D9, D11, D7; G1-2 (D8), opcional.
const datos = (porAnuncio, hasta) =>
  anuncios.flatMap((a) => {
    const f = porAnuncio[a.codigo];
    if (!f) return [];
    return Array.from({ length: hasta }, (_, k) => ({ codigo: a.codigo, dia: k + 1, ...f(k + 1) }));
  });
const veredictos = (libro, sec) => {
  const ev = evaluador(libro);
  return Object.fromEntries(
    anuncios.map((a, i) => [a.codigo, ev.celda("Cortes", `I${sec.primera + i}`)]).concat([["campaña", ev.celda("Cortes", `I${sec.total}`)]]),
  );
};

// ───────── pruebas ─────────
test("el .xlsx está bien formado: zip, XML y las tres hojas", () => {
  const libro = planilla();
  assert.deepEqual([...libro.hojas.keys()], ["Parámetros", "Diario", "Cortes"]);
  for (const f of ["[Content_Types].xml", "_rels/.rels", "xl/workbook.xml", "xl/_rels/workbook.xml.rels", "xl/styles.xml", "xl/worksheets/sheet1.xml", "xl/worksheets/sheet2.xml", "xl/worksheets/sheet3.xml"]) {
    assert.ok(libro.arch.has(f), `falta ${f}`);
  }
});

test("el archivo versionado es el que sale del generador (si cambia la spec, hay que regenerarlo)", () => {
  const versionado = descomprimir(leer(SALIDA_POR_DEFECTO));
  const nuevo = descomprimir(vacio.buffer);
  assert.deepEqual([...versionado.keys()], [...nuevo.keys()]);
  for (const [nombre, xml] of nuevo) assert.equal(versionado.get(nombre), xml, `${nombre} está desactualizado: node .claude/skills/onia-ventas-pauta/scripts/planilla-prueba1.mjs`);
});

test("los números de la planilla son los de la spec (US$ 56, 14 días, Bs 750, Bs 1.400, CTR 0,8 %, Bs 40, Bs 390)", () => {
  const ev = evaluador(planilla());
  assert.equal(ev.celda("Parámetros", "C11"), spec.plata.total_usd);
  assert.equal(ev.celda("Parámetros", "C12"), spec.plata.tope_en_bs);
  assert.equal(ev.celda("Parámetros", "C13"), spec.plata.techo_total_en_bs);
  assert.equal(ev.celda("Parámetros", "C14"), 0.008);
  assert.equal(ev.celda("Parámetros", "C15"), 40);
  assert.equal(ev.celda("Parámetros", "C16"), 390);
  assert.equal(vacio.resumen.dias, spec.plata.dias);
  // El tipo de cambio real viene VACÍO; si no se carga, la planilla usa el más alto de las referencias (15), no el 13,4.
  assert.equal(ev.celda("Parámetros", "C6"), null);
  assert.equal(ev.celda("Parámetros", "C9"), 15);
  assert.match(ev.celda("Parámetros", "D9"), /^ASUMIDO/);
  assert.equal(Math.max(...Object.keys(spec.plata.equivalencia_en_bs).map((k) => Number(k.replace("a_", "").replace("_", ".")))), 15);
  assert.match(spec.reglas_de_corte.tipo_de_cambio_para_convertir, /el más alto/);
});

test("las equivalencias de Parámetros coinciden con la spec (US$ 56 en Bs, y Bs 40 y Bs 390 en US$)", () => {
  const ev = evaluador(planilla());
  const filas = [19, 20, 21, 22].map((f) => ({ tc: ev.celda("Parámetros", `B${f}`), bs: ev.celda("Parámetros", `C${f}`), usd: ev.celda("Parámetros", `D${f}`) }));
  const porClave = { 11.37: "a_11_37", 11.89: "a_11_89", 13.4: "a_13_4", 15: "a_15" };
  for (const f of filas) assert.equal(f.bs, spec.plata.equivalencia_en_bs[porClave[f.tc]], `US$ 56 a ${f.tc}`);
  const a1337 = filas.find((f) => f.tc === 13.4).usd.split(" · ").map(Number);
  assert.deepEqual(a1337, [55.97, spec.reglas_de_corte.dia_7.bs_40_en_usd.a_13_4, spec.reglas_de_corte.dia_14.bs_390_en_usd.a_13_4]);
  const a1137 = filas.find((f) => f.tc === 11.37).usd.split(" · ").map(Number);
  assert.deepEqual(a1137.slice(1), [spec.reglas_de_corte.dia_7.bs_40_en_usd.a_11_37, spec.reglas_de_corte.dia_14.bs_390_en_usd.a_11_37]);
});

test("quién está en la hoja: los 4 que entran más G1-2 (D8) marcado como opcional, con 14 filas cada uno", () => {
  assert.deepEqual(anuncios.map((a) => a.codigo), ["D10", "D9", "D11", "D7", "D8"]);
  assert.deepEqual(anuncios.map((a) => a.opcional), [false, false, false, false, true]);
  assert.deepEqual(vacio.resumen.filasDiario, [6, 75]);
  const ev = evaluador(planilla());
  const codigos = Array.from({ length: 70 }, (_, k) => ev.celda("Diario", `C${6 + k}`));
  assert.deepEqual([...new Set(codigos)], ["D10", "D9", "D11", "D7", "D8"]);
  assert.equal(ev.celda("Diario", "A6"), 1);
  assert.equal(ev.celda("Diario", "A19"), 14);
  assert.equal(ev.celda("Diario", "A20"), 1, "el segundo anuncio vuelve al día 1");
  for (const e of Object.values(spec.anuncios.entran)) assert.ok(anuncios.some((a) => a.codigo === e.codigo));
});

test("vacía, como se entrega: todo dice «SIN DATOS» y los frenos dicen OK, sin errores de fórmula", () => {
  const libro = planilla();
  const ev = evaluador(libro);
  // Día 3 decide por anuncio; día 7 y 14 deciden por la campaña (las filas por anuncio solo informan y quedan vacías).
  for (const [cod, v] of Object.entries(veredictos(libro, cortes.d3))) assert.equal(v, cod === "campaña" ? "" : "SIN DATOS", `día 3, ${cod}`);
  for (const sec of [cortes.d7, cortes.d14]) {
    for (const [cod, v] of Object.entries(veredictos(libro, sec))) assert.equal(v, cod === "campaña" ? "SIN DATOS" : "", `${cod} en la fila de ${sec.primera}`);
  }
  assert.equal(ev.celda("Cortes", "B3"), 0, "días con datos");
  const f = vacio.resumen.frenos;
  assert.equal(ev.celda("Cortes", `C${f + 1}`), 0);
  assert.equal(ev.celda("Cortes", `C${f + 4}`), "OK");
  assert.equal(ev.celda("Cortes", `C${f + 6}`), "OK");
  assert.equal(ev.celda("Diario", "B6"), "", "sin fecha de inicio no inventa fechas");
});

test("con fecha de inicio, el Diario pone las fechas día por día", () => {
  const inicio = 46316; // serial de Excel (cualquier fecha)
  const ev = evaluador(planilla({ parametros: { inicio } }));
  assert.equal(ev.celda("Diario", "B6"), inicio);
  assert.equal(ev.celda("Diario", "B19"), inicio + 13);
});

test("día 3: corta al que trae 0 conversaciones o CTR < 0,8 %, sigue el resto, y D8 (sin datos) no cuenta", () => {
  const base = { gasto: 3, impresiones: 1000 };
  const libro = planilla({
    datos: datos(
      {
        D10: () => ({ ...base, clics: 20, conversaciones: 0 }), // 2 % de CTR pero 0 conversaciones
        D9: () => ({ ...base, clics: 5, conversaciones: 2 }), // 0,5 % de CTR
        D11: () => ({ ...base, clics: 20, conversaciones: 1 }),
        D7: () => ({ ...base, clics: 8, conversaciones: 1 }), // 0,8 % justo: no corta (la regla es CTR < 0,8 %)
      },
      3,
    ),
  });
  const v = veredictos(libro, cortes.d3);
  assert.equal(v.D10, "CORTAR*: 0 conversaciones");
  assert.equal(v.D9, "CORTAR*: CTR bajo");
  assert.equal(v.D11, "SEGUIR");
  assert.equal(v.D7, "SEGUIR");
  assert.equal(v.D8, "SIN DATOS");
});

test("día 3 con solo 2 días cargados dice ESPERAR, no corta", () => {
  const libro = planilla({ datos: datos({ D10: () => ({ gasto: 3, impresiones: 1000, clics: 1, conversaciones: 0 }) }, 2) });
  assert.equal(veredictos(libro, cortes.d3).D10, "ESPERAR: faltan días");
});

test("día 7: decide la campaña — costo por conversación ≤ Bs 40 con ≥ 1 de dueños sigue; > Bs 40 o 0 de dueños corta", () => {
  // Gasto acumulado a 7 días: 4 anuncios × 7 × US$ 1 = US$ 28 = Bs 375,2 a 13,4.
  const arma = (conv, duenos) =>
    planilla({
      parametros: { tc: 13.4 },
      datos: datos(
        {
          D10: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: conv, duenos }),
          D9: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: conv, duenos: 0 }),
          D11: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: conv, duenos: 0 }),
          D7: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: conv, duenos: 0 }),
        },
        7,
      ),
    });
  // 28 conversaciones en 7 días → Bs 13,4 cada una: sigue (hay dueños).
  assert.equal(veredictos(arma(1, 1), cortes.d7).campaña, "SEGUIR");
  // Mismas conversaciones, 0 de dueños: corta aunque sea barato.
  assert.equal(veredictos(arma(1, 0), cortes.d7).campaña, "CORTAR*: 0 conversaciones de dueños");
  // 0 conversaciones: no hay dueños, corta por eso.
  assert.equal(veredictos(arma(0, 0), cortes.d7).campaña, "CORTAR*: 0 conversaciones de dueños");
});

test("día 7: el tope es Bs 40 por conversación — Bs 375,2 ÷ 9 = Bs 41,69 corta; ÷ 10 = Bs 37,52 sigue", () => {
  const arma = (convTotales) => {
    // Las conversaciones totales se reparten en D10 (el resto, 0): importa el total de la campaña.
    const libro = planilla({
      parametros: { tc: 13.4 },
      datos: datos(
        {
          D10: (d) => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: d === 1 ? convTotales : 0, duenos: d === 1 ? 1 : 0 }),
          D9: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0 }),
          D11: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0 }),
          D7: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0 }),
        },
        7,
      ),
    });
    const ev = evaluador(libro);
    return { v: veredictos(libro, cortes.d7).campaña, costo: ev.celda("Cortes", `G${cortes.d7.total}`) };
  };
  const nueve = arma(9);
  assert.ok(Math.abs(nueve.costo - 41.688888) < 0.001, `costo ${nueve.costo}`);
  assert.equal(nueve.v, "CORTAR*: costo por conversación sobre el tope");
  const diez = arma(10);
  assert.ok(Math.abs(diez.costo - 37.52) < 0.001);
  assert.equal(diez.v, "SEGUIR");
});

test("día 14: costo por demo ≤ Bs 390 sigue; > Bs 390 o 0 demos corta", () => {
  // 4 anuncios × 14 días × US$ 1 = US$ 56 = Bs 750,4 a 13,4.
  const arma = (demosEnD10) =>
    planilla({
      parametros: { tc: 13.4 },
      datos: datos(
        {
          D10: (d) => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 1, duenos: 1, demos: d === 14 ? demosEnD10 : 0 }),
          D9: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0, demos: 0 }),
          D11: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0, demos: 0 }),
          D7: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 0, duenos: 0, demos: 0 }),
        },
        14,
      ),
    });
  assert.equal(veredictos(arma(2), cortes.d14).campaña, "SEGUIR"); // Bs 375,2 por demo
  assert.equal(veredictos(arma(1), cortes.d14).campaña, "CORTAR*: costo por demo sobre el tope"); // Bs 750,4
  assert.equal(veredictos(arma(0), cortes.d14).campaña, "CORTAR*: 0 demos");
});

test("frenos: a tipo de cambio 15, US$ 50 son Bs 750 y piden apagar a mano; a 13,4 los US$ 56 pasan de Bs 750 el día 14", () => {
  const f = vacio.resumen.frenos;
  const con = (gastoPorDia, tc, otros = 0) => {
    const libro = planilla({
      parametros: { tc, otros },
      datos: datos({ D10: () => ({ gasto: gastoPorDia, impresiones: 500 }), D9: () => ({ gasto: gastoPorDia }), D11: () => ({ gasto: gastoPorDia }), D7: () => ({ gasto: gastoPorDia }) }, 1),
    });
    const ev = evaluador(libro);
    return { usd: ev.celda("Cortes", `C${f + 1}`), bs: ev.celda("Cortes", `C${f + 2}`), tope: ev.celda("Cortes", `C${f + 4}`), techo: ev.celda("Cortes", `C${f + 6}`) };
  };
  const a15 = con(12.5, 15); // 4 × 12,5 = US$ 50 = Bs 750 justo
  assert.equal(a15.usd, 50);
  assert.equal(a15.bs, 750);
  assert.equal(a15.tope, "APAGAR A MANO: llegó al tope");
  assert.equal(con(11.5, 15).tope, "ACERCÁNDOSE (≥ 90 %)"); // US$ 46 × 15 = Bs 690 (92 %)
  assert.equal(con(11, 15).tope, "OK"); // US$ 44 × 15 = Bs 660 (88 %)
  // a 13,4 los US$ 56 son Bs 750,4: pasan el tope por 40 centavos (la regla de la spec)
  assert.equal(con(14, 13.4).tope, "APAGAR A MANO: llegó al tope");
});

test("frenos: techo de Bs 1.400 suma Meta y los otros gastos", () => {
  const f = vacio.resumen.frenos;
  const con = (otros) => {
    const libro = planilla({ parametros: { tc: 13.4, otros }, datos: datos({ D10: () => ({ gasto: 10, impresiones: 500 }) }, 1) });
    const ev = evaluador(libro);
    return { meta: ev.celda("Cortes", `C${f + 2}`), total: ev.celda("Cortes", `C${f + 5}`), techo: ev.celda("Cortes", `C${f + 6}`) };
  };
  assert.equal(con(0).techo, "OK"); // Bs 134
  assert.equal(con(1100).techo, "OK"); // 134 + 1.100 = 1.234 (88 %)
  assert.equal(con(1200).techo, "ACERCÁNDOSE (≥ 90 %)"); // 1.334 (95 %)
  assert.equal(con(1300).techo, "APAGAR TODO: llegó al techo"); // 1.434
});

test("las fórmulas solo usan funciones y nombres que el intérprete conoce (si no, la prueba falla)", () => {
  const libro = planilla();
  const ev = evaluador(libro);
  let formulas = 0;
  for (const [hoja, celdas] of libro.hojas) {
    for (const [dir, c] of celdas) {
      if (c.f === undefined) continue;
      formulas += 1;
      assert.doesNotThrow(() => ev.celda(hoja, dir), `${hoja}!${dir}: ${c.f}`);
    }
  }
  assert.ok(formulas > 300, `se esperaban > 300 fórmulas, hay ${formulas}`);
});

test("los formatos condicionales miran la cantidad de letras que tiene su palabra (LEFT(x,6) nunca iguala a «ESPERAR»)", () => {
  const libro = planilla();
  let reglas = 0;
  for (const n of [1, 2, 3]) {
    const xml = libro.arch.get(`xl/worksheets/sheet${n}.xml`);
    for (const m of xml.matchAll(/LEFT\([A-Z]+\d+,(\d+)\)=&quot;([A-ZÁÉÍÓÚ]+)&quot;/g)) {
      reglas += 1;
      assert.equal(Number(m[1]), m[2].length, `LEFT(...,${m[1]}) contra «${m[2]}» (${m[2].length} letras) no puede ser verdadero`);
    }
  }
  assert.ok(reglas >= 4, `se esperaban ≥ 4 reglas con LEFT, hay ${reglas}`);
});

test("si la campaña se apaga por el tope antes del día 14, el corte del día 14 NO espera para siempre", () => {
  // 4 anuncios × US$ 1 por día × 13 días = US$ 52. A 15 son Bs 780 (≥ Bs 750): se apagó el día 13.
  const trece = (tc) =>
    planilla({
      parametros: { tc },
      datos: datos(
        { D10: () => ({ gasto: 1, impresiones: 500, clics: 5, conversaciones: 1, duenos: 1, demos: 0 }), D9: () => ({ gasto: 1 }), D11: () => ({ gasto: 1 }), D7: () => ({ gasto: 1 }) },
        13,
      ),
    });
  const apagada = trece(15);
  assert.equal(evaluador(apagada).celda("Cortes", "B3"), 14, "apagada por el tope: el día final");
  assert.equal(veredictos(apagada, cortes.d14).campaña, "CORTAR*: 0 demos");
  // A 13,4 los mismos US$ 52 son Bs 696,8: la campaña todavía puede estar corriendo, el corte espera.
  const viva = trece(13.4);
  assert.equal(evaluador(viva).celda("Cortes", "B3"), 13);
  assert.equal(veredictos(viva, cortes.d14).campaña, "ESPERAR: faltan días");
});

test("un día cargado en 0 (sin gasto) cuenta como día cargado", () => {
  const libro = planilla({ parametros: { tc: 13.4 }, datos: datos({ D10: (d) => ({ gasto: d === 14 ? 0 : 1, impresiones: 100, conversaciones: 1, duenos: 1, demos: 1 }) }, 14) });
  assert.equal(evaluador(libro).celda("Cortes", "B3"), 14);
});

test("si no carga el tipo de cambio real, el freno de Bs 750 se adelanta (usa 15) en vez de dejar pasar el tope", () => {
  const f = vacio.resumen.frenos;
  // US$ 52 gastados: a 15 son Bs 780 (el cobro real si el banco cobra 15). Sin cargar el real, la hoja usa 15 y pide apagar.
  const sinReal = evaluador(planilla({ datos: datos({ D10: () => ({ gasto: 13, impresiones: 100 }), D9: () => ({ gasto: 13 }), D11: () => ({ gasto: 13 }), D7: () => ({ gasto: 13 }) }, 1) }));
  assert.equal(sinReal.celda("Cortes", `C${f + 2}`), 780);
  assert.equal(sinReal.celda("Cortes", `C${f + 4}`), "APAGAR A MANO: llegó al tope");
  // Con el real cargado (13,4) los mismos US$ 52 son Bs 696,8: no pide apagar.
  const conReal = evaluador(planilla({ parametros: { tc: 13.4 }, datos: datos({ D10: () => ({ gasto: 13, impresiones: 100 }), D9: () => ({ gasto: 13 }), D11: () => ({ gasto: 13 }), D7: () => ({ gasto: 13 }) }, 1) }));
  assert.ok(Math.abs(conReal.celda("Cortes", `C${f + 2}`) - 696.8) < 0.001);
  assert.equal(conReal.celda("Cortes", `C${f + 4}`), "ACERCÁNDOSE (≥ 90 %)");
});
