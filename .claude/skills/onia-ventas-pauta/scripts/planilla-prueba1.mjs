#!/usr/bin/env node
// Planilla de la prueba 1 (ADQ §5.7 y §5.11): una fila por anuncio y por día, y los cortes del día 3, 7 y 14 como fórmulas.
//   node .claude/skills/onia-ventas-pauta/scripts/planilla-prueba1.mjs            → escribe PLANILLA-PRUEBA-1.xlsx
//   node .../planilla-prueba1.mjs --salida ruta.xlsx
//
// ORIGEN (2026-10-11, MADRE MARKETING, tarea 3 de 3): «que el primer día de la campaña no se pierda armando la hoja». Los
// números (US$ 56, 14 días, Bs 750, Bs 1.400, CTR 0,8 %, Bs 40, Bs 390, los tipos de cambio) NO se copian acá: se leen de
// `CAMPANA-1-LISTA-PARA-CREAR.json`, que es la spec que `campana-lista.test.mjs` cruza con el doc de la pauta. Una planilla
// con un 40 escrito a mano se desactualiza en silencio, igual que el JSON de la campaña antes de ese test.
//
// Sin dependencias: un .xlsx es un zip de XML. Se escribe a mano (zip con deflate) porque no hay openpyxl
// instalado y instalar herramientas pide aprobación (CLAUDE.md, «Acceso local…»). Se abre en Excel, LibreOffice y Google Sheets.
import { readFileSync, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../../../../", import.meta.url));
export const SPEC_RUTA = "hermes-content/carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json";
export const SALIDA_POR_DEFECTO = "hermes-content/carousels/briefs/ads/prueba1-v2/PLANILLA-PRUEBA-1.xlsx";

// ───────────────────────── zip ─────────────────────────
const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function zip(archivos) {
  const locales = [];
  const centrales = [];
  let desplazamiento = 0;
  for (const [nombre, contenido] of archivos) {
    const nom = Buffer.from(nombre, "utf8");
    const original = Buffer.from(contenido, "utf8");
    const crc = crc32(original);
    const datos = deflateRawSync(original, { level: 9 });
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // versión necesaria
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(8, 8); // método: deflate
    local.writeUInt16LE(0, 10); // hora 00:00
    local.writeUInt16LE(0x21, 12); // fecha 1980-01-01 (fija: el archivo es reproducible)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(datos.length, 18);
    local.writeUInt32LE(original.length, 22);
    local.writeUInt16LE(nom.length, 26);
    locales.push(local, nom, datos);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(datos.length, 20);
    central.writeUInt32LE(original.length, 24);
    central.writeUInt16LE(nom.length, 28);
    central.writeUInt32LE(desplazamiento, 42);
    centrales.push(central, nom);
    desplazamiento += 30 + nom.length + datos.length;
  }
  const tamCentral = centrales.reduce((a, b) => a + b.length, 0);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(archivos.length, 8);
  fin.writeUInt16LE(archivos.length, 10);
  fin.writeUInt32LE(tamCentral, 12);
  fin.writeUInt32LE(desplazamiento, 16);
  return Buffer.concat([...locales, ...centrales, fin]);
}

// ───────────────────────── estilos ─────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const FORMATOS = { general: 0, entero: 1, decimal: 4, pct: 10, fecha: 164, usd: 165, bs: 166 };
const FUENTES = {
  normal: '<font><sz val="11"/><name val="Calibri"/></font>',
  negrita: '<font><b/><sz val="11"/><name val="Calibri"/></font>',
  encabezado: '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>',
  nota: '<font><i/><sz val="10"/><color rgb="FF595959"/><name val="Calibri"/></font>',
  titulo: '<font><b/><sz val="14"/><name val="Calibri"/></font>',
};
const RELLENOS = { ninguno: null, entrada: "FFFFF2CC", calculo: "FFEDEDED", encabezado: "FF2F5D50", opcional: "FFF3E5F5" };

class Estilos {
  constructor() {
    this.lista = [];
    this.fuentes = Object.keys(FUENTES);
    this.rellenos = Object.keys(RELLENOS);
    this.registrar({}); // índice 0 = estilo por defecto
  }
  registrar({ fuente = "normal", relleno = "ninguno", borde = false, formato = "general", alinea = null, envuelve = false } = {}) {
    const clave = JSON.stringify([fuente, relleno, borde, formato, alinea, envuelve]);
    let i = this.lista.findIndex((e) => e.clave === clave);
    if (i < 0) {
      this.lista.push({ clave, fuente, relleno, borde, formato, alinea, envuelve });
      i = this.lista.length - 1;
    }
    return i;
  }
  xml() {
    const fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
    for (const nombre of this.rellenos.slice(1)) fills.push(`<fill><patternFill patternType="solid"><fgColor rgb="${RELLENOS[nombre]}"/><bgColor indexed="64"/></patternFill></fill>`);
    const idRelleno = (n) => (n === "ninguno" ? 0 : this.rellenos.indexOf(n) + 1);
    const xfs = this.lista.map((e) => {
      const alinea = e.alinea || e.envuelve ? `<alignment${e.alinea ? ` horizontal="${e.alinea}"` : ""} vertical="center"${e.envuelve ? ' wrapText="1"' : ""}/>` : "";
      return `<xf numFmtId="${FORMATOS[e.formato]}" fontId="${this.fuentes.indexOf(e.fuente)}" fillId="${idRelleno(e.relleno)}" borderId="${e.borde ? 1 : 0}" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"${alinea ? ' applyAlignment="1">' + alinea + "</xf>" : "/>"}`;
    });
    const lado = (l) => `<${l} style="thin"><color rgb="FFBFBFBF"/></${l}>`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/><numFmt numFmtId="165" formatCode="&quot;US$&quot;\\ #,##0.00"/><numFmt numFmtId="166" formatCode="&quot;Bs&quot;\\ #,##0.00"/></numFmts>
<fonts count="${this.fuentes.length}">${this.fuentes.map((n) => FUENTES[n]).join("")}</fonts>
<fills count="${fills.length}">${fills.join("")}</fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border>${lado("left")}${lado("right")}${lado("top")}${lado("bottom")}<diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${xfs.length}">${xfs.join("")}</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
<dxfs count="3">
<dxf><font><b/><color rgb="FF9C0006"/></font><fill><patternFill><bgColor rgb="FFFFC7CE"/></patternFill></fill></dxf>
<dxf><font><b/><color rgb="FF006100"/></font><fill><patternFill><bgColor rgb="FFC6EFCE"/></patternFill></fill></dxf>
<dxf><font><b/><color rgb="FF7F6000"/></font><fill><patternFill><bgColor rgb="FFFFEB9C"/></patternFill></fill></dxf>
</dxfs>
</styleSheet>`;
  }
}

// ───────────────────────── hojas ─────────────────────────
const letra = (n) => {
  let s = "";
  for (let k = n; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(65 + ((k - 1) % 26)) + s;
  return s;
};
const dir = (col, fila) => `${letra(col)}${fila}`;

class Hoja {
  constructor(nombre) {
    this.nombre = nombre;
    this.celdas = new Map(); // "fila:col" → {tipo, valor, estilo}
    this.anchos = [];
    this.altos = new Map();
    this.mezclas = [];
    this.validaciones = [];
    this.formatosCondicionales = [];
    this.congelar = null;
  }
  poner(col, fila, valor, estilo = 0) {
    this.celdas.set(`${fila}:${col}`, { valor, estilo });
  }
  formula(col, fila, f, estilo = 0) {
    this.celdas.set(`${fila}:${col}`, { formula: f, estilo });
  }
  xml() {
    const filas = new Map();
    for (const [k, c] of this.celdas) {
      const [f, col] = k.split(":").map(Number);
      if (!filas.has(f)) filas.set(f, []);
      filas.get(f).push([col, c]);
    }
    const cuerpo = [...filas.keys()]
      .sort((a, b) => a - b)
      .map((f) => {
        const celdas = filas
          .get(f)
          .sort((a, b) => a[0] - b[0])
          .map(([col, c]) => {
            const r = dir(col, f);
            if (c.formula !== undefined) return `<c r="${r}" s="${c.estilo}"><f>${esc(c.formula)}</f></c>`;
            if (c.valor === null || c.valor === undefined || c.valor === "") return `<c r="${r}" s="${c.estilo}"/>`;
            if (typeof c.valor === "number") return `<c r="${r}" s="${c.estilo}"><v>${c.valor}</v></c>`;
            return `<c r="${r}" s="${c.estilo}" t="inlineStr"><is><t xml:space="preserve">${esc(c.valor)}</t></is></c>`;
          })
          .join("");
        const alto = this.altos.get(f);
        return `<row r="${f}"${alto ? ` ht="${alto}" customHeight="1"` : ""}>${celdas}</row>`;
      })
      .join("");
    const cols = this.anchos.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("");
    const panel = this.congelar
      ? `<pane xSplit="${this.congelar.col}" ySplit="${this.congelar.fila}" topLeftCell="${dir(this.congelar.col + 1, this.congelar.fila + 1)}" activePane="bottomRight" state="frozen"/>`
      : "";
    const mezclas = this.mezclas.length ? `<mergeCells count="${this.mezclas.length}">${this.mezclas.map((m) => `<mergeCell ref="${m}"/>`).join("")}</mergeCells>` : "";
    let prioridad = 1;
    const condicionales = this.formatosCondicionales
      .map(({ rango, reglas }) => `<conditionalFormatting sqref="${rango}">${reglas.map((r) => `<cfRule type="expression" dxfId="${r.dxf}" priority="${prioridad++}"><formula>${esc(r.formula)}</formula></cfRule>`).join("")}</conditionalFormatting>`)
      .join("");
    const validaciones = this.validaciones.length
      ? `<dataValidations count="${this.validaciones.length}">${this.validaciones.map((v) => `<dataValidation type="${v.tipo}" operator="${v.operador}" allowBlank="1" showErrorMessage="1" errorTitle="${esc(v.titulo)}" error="${esc(v.mensaje)}" sqref="${v.rango}"><formula1>${v.minimo}</formula1></dataValidation>`).join("")}</dataValidations>`
      : "";
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"${this.nombre === "Parámetros" ? ' tabSelected="1"' : ""}>${panel}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${cols}</cols><sheetData>${cuerpo}</sheetData>${mezclas}${condicionales}${validaciones}<pageMargins left="0.5" right="0.5" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`;
  }
}

// ───────────────────────── contenido ─────────────────────────
const aNumero = (x) => Number(String(x).replace(",", "."));

/**
 * @param {{datos?: Array<{dia:number, codigo:string, gasto?:number, impresiones?:number, clics?:number, frecuencia?:number,
 *   conversaciones?:number, duenos?:number, demos?:number, rep3s?:number, thruplay?:number}>, parametros?: {inicio?:number, tc?:number, otros?:number}}} [opciones]
 *   `datos` y `parametros` existen para PROBAR las fórmulas con números inventados; la planilla que se entrega va vacía.
 */
export function construirPlanilla(opciones = {}) {
  const spec = JSON.parse(readFileSync(new URL(SPEC_RUTA, `file://${raiz}`), "utf8"));
  const { plata, reglas_de_corte: cortes } = spec;
  const dias = plata.dias;
  const bsConv = aNumero(cortes.dia_7.cortar_si[0].match(/Bs (\d+)/)[1]);
  const bsDemo = aNumero(cortes.dia_14.cortar_si[1].match(/Bs (\d+)/)[1]);
  const ctrMin = aNumero(cortes.dia_3.cortar_si[1].match(/< ([\d,]+) %/)[1]) / 100;
  const anuncios = [
    ...spec.anuncios.entran.map((a) => ({ id: a.id, codigo: a.codigo, pieza: a.pieza, formato: a.formato, opcional: false })),
    ...spec.anuncios.esperan.filter((a) => a.id === "G1-2").map((a) => ({ id: a.id, codigo: a.codigo, pieza: a.pieza, formato: a.formato, opcional: true })),
  ];
  const esVideo = (a) => /video|selfie|presentador/i.test(a.formato);

  const est = new Estilos();
  const S = {
    titulo: est.registrar({ fuente: "titulo" }),
    nota: est.registrar({ fuente: "nota", envuelve: true }),
    notaSuelta: est.registrar({ fuente: "nota" }),
    etiqueta: est.registrar({ fuente: "negrita" }),
    enc: est.registrar({ fuente: "encabezado", relleno: "encabezado", borde: true, alinea: "center", envuelve: true }),
    fijoTxt: est.registrar({ borde: true, envuelve: true }),
    fijoNum: est.registrar({ borde: true, formato: "entero", alinea: "center" }),
    fijoBs: est.registrar({ borde: true, formato: "bs" }),
    fijoUsd: est.registrar({ borde: true, formato: "usd" }),
    fijoPct: est.registrar({ borde: true, formato: "pct" }),
    optTxt: est.registrar({ borde: true, relleno: "opcional", envuelve: true }),
    optNum: est.registrar({ borde: true, relleno: "opcional", formato: "entero", alinea: "center" }),
    entTxt: est.registrar({ borde: true, relleno: "entrada", envuelve: true }),
    entEnt: est.registrar({ borde: true, relleno: "entrada", formato: "entero" }),
    entDec: est.registrar({ borde: true, relleno: "entrada", formato: "decimal" }),
    entUsd: est.registrar({ borde: true, relleno: "entrada", formato: "usd" }),
    entBs: est.registrar({ borde: true, relleno: "entrada", formato: "bs" }),
    entFecha: est.registrar({ borde: true, relleno: "entrada", formato: "fecha" }),
    calcFecha: est.registrar({ borde: true, relleno: "calculo", formato: "fecha" }),
    calcEnt: est.registrar({ borde: true, relleno: "calculo", formato: "entero" }),
    calcUsd: est.registrar({ borde: true, relleno: "calculo", formato: "usd" }),
    calcBs: est.registrar({ borde: true, relleno: "calculo", formato: "bs" }),
    calcPct: est.registrar({ borde: true, relleno: "calculo", formato: "pct" }),
    calcDec: est.registrar({ borde: true, relleno: "calculo", formato: "decimal" }),
    calcTxt: est.registrar({ borde: true, relleno: "calculo", fuente: "negrita", envuelve: true }),
    veredicto: est.registrar({ borde: true, fuente: "negrita", alinea: "center", envuelve: true }),
  };
  const nombres = {
    TC: null, INICIO: null, OTROS_BS: null, CTR_MIN: null, BS_CONV_MAX: null, BS_DEMO_MAX: null, BS_TOPE_META: null, BS_TECHO: null, USD_TOTAL: null,
    DIAS_CON_DATOS: null,
  };

  // ── Parámetros ──
  const P = new Hoja("Parámetros");
  P.anchos = [3, 44, 18, 70];
  P.poner(2, 1, "Planilla de la prueba 1 · ONIA · Dental SCZ · WhatsApp", S.titulo);
  P.poner(2, 2, "Una fila por anuncio y por día (hoja Diario); los cortes del día 3, 7 y 14 se calculan solos (hoja Cortes). Celdas amarillas = las llenás vos; grises = fórmulas, no se tocan. HOY NO HAY NINGUNA CAMPAÑA: esta hoja está vacía a propósito.", S.nota);
  P.mezclas.push("B2:D2");
  P.altos.set(2, 48);

  P.poner(2, 4, "Lo que se llena", S.enc);
  P.poner(3, 4, "Valor", S.enc);
  P.poner(4, 4, "De dónde sale", S.enc);
  P.poner(2, 5, "Fecha de inicio de la campaña", S.fijoTxt);
  P.poner(3, 5, opciones.parametros?.inicio ?? null, S.entFecha);
  P.poner(4, 5, `${spec.fechas.inicio}. Se llena cuando exista el OK escrito de Sergio Urcullo y la campaña se encienda.`, S.fijoTxt);
  P.poner(2, 6, "Tipo de cambio (Bs por US$)", S.fijoTxt);
  P.poner(3, 6, opciones.parametros?.tc ?? 13.4, S.entDec);
  P.poner(4, 6, `Se usa el real del extracto del banco; si no se conoce, el más duro: 13,4. Referencias de la spec: ${Object.keys(plata.equivalencia_en_bs).map((k) => k.replace("a_", "").replace("_", ",")).join(" · ")}.`, S.fijoTxt);
  P.poner(2, 7, "Otros gastos del techo de Bs 1.400 (Bs)", S.fijoTxt);
  P.poner(3, 7, opciones.parametros?.otros ?? 0, S.entBs);
  P.poner(4, 7, "Auditorías, comunidad y eventos: lo que se gastó fuera de Meta. El techo de Bs 1.400 es Meta + esto (spec, ADQ §5.7).", S.fijoTxt);
  P.poner(2, 8, "Tipo de clic que cuenta como «CTR»", S.fijoTxt);
  P.poner(3, 8, null, S.entTxt);
  P.poner(4, 8, "ABIERTO: la regla dice «CTR < 0,8 %» y no aclara si es el CTR de todos los clics o el de los clics en el enlace. Anotar acá cuál muestra la columna CTR de Ads Manager y usar siempre el mismo.", S.fijoTxt);

  P.poner(2, 10, "Lo que NO se toca (viene de la spec)", S.enc);
  P.poner(3, 10, "Valor", S.enc);
  P.poner(4, 10, "Regla", S.enc);
  const fijos = [
    ["Presupuesto total de la campaña (US$)", plata.total_usd, S.fijoUsd, `${plata.dias} días · US$ ${plata.diario_usd}/día de promedio, no tope diario. Fuente: ${plata.fuente}.`],
    ["Tope de Meta (Bs)", plata.tope_en_bs, S.fijoBs, "Nada apaga solo en Bs 750: se apaga a mano cuando el cobro acumulado llega. Sale en la hoja Cortes."],
    ["Techo total (Bs)", plata.techo_total_en_bs, S.fijoBs, "Meta + auditorías, comunidad y eventos. Al llegar se apaga todo."],
    ["Día 3 · CTR mínimo", ctrMin, S.fijoPct, "Con CTR menor, o con 0 conversaciones, se pausa la copia que no trae (ADQ §5.7). Antes: descartar un problema de entrega."],
    ["Día 7 · costo máximo por conversación (Bs)", bsConv, S.fijoBs, "Costo por conversación > este tope, o 0 conversaciones de dueños: se corta. Es un supuesto (10 % de conversación a demo), no un dato."],
    ["Día 14 · costo máximo por demo (Bs)", bsDemo, S.fijoBs, "0 demos, o costo por demo > este tope: se corta. Es un supuesto (Bs 1.570 × 25 % de cierre)."],
  ];
  fijos.forEach(([etiqueta, valor, estilo, regla], i) => {
    P.poner(2, 11 + i, etiqueta, S.fijoTxt);
    P.poner(3, 11 + i, valor, estilo);
    P.poner(4, 11 + i, regla, S.fijoTxt);
  });
  nombres.INICIO = "$C$5";
  nombres.TC = "$C$6";
  nombres.OTROS_BS = "$C$7";
  nombres.USD_TOTAL = "$C$11";
  nombres.BS_TOPE_META = "$C$12";
  nombres.BS_TECHO = "$C$13";
  nombres.CTR_MIN = "$C$14";
  nombres.BS_CONV_MAX = "$C$15";
  nombres.BS_DEMO_MAX = "$C$16";

  P.poner(2, 18, "Equivalencias (lo que valen los topes según el tipo de cambio)", S.enc);
  P.poner(3, 18, "US$ 56 en Bs", S.enc);
  P.poner(4, 18, "Bs 750 en US$ · Bs 40 en US$ · Bs 390 en US$", S.enc);
  Object.keys(plata.equivalencia_en_bs).forEach((clave, i) => {
    const tc = aNumero(clave.replace("a_", "").replace("_", "."));
    const f = 19 + i;
    P.poner(2, f, tc, est.registrar({ borde: true, formato: "decimal", alinea: "left" }));
    P.formula(3, f, `ROUND(USD_TOTAL*B${f},0)`, S.calcBs);
    P.formula(4, f, `ROUND(BS_TOPE_META/B${f},2)&" · "&ROUND(BS_CONV_MAX/B${f},2)&" · "&ROUND(BS_DEMO_MAX/B${f},2)`, S.calcTxt);
  });

  P.poner(2, 24, "Cómo se llena (de dónde sale cada columna)", S.etiqueta);
  const comoSeLlena = [
    ["Gasto, impresiones, clics, frecuencia, conversaciones y reproducciones", `Ads Manager o el conector: ${spec.medicion.de_donde["conversaciones y gasto"]}.`],
    ["De dueños o administradores de clínica", spec.medicion.de_donde["dueños de clínica"]],
    ["Demos agendadas", spec.medicion.de_donde.demos],
    ["Una vez por día, siempre a la misma hora", "Gasto del día, no acumulado. Los acumulados los calcula la hoja Cortes."],
    ["Durante la prueba", "No se toca la segmentación ni el creativo y no se agregan anuncios: son ediciones significativas (reinician el aprendizaje y abren otra revisión). El corte se hace PAUSANDO; que pausar no reinicie el aprendizaje es una inferencia, no un dato de Meta. El «20 %» de presupuesto es prudencia propia: Meta no da umbral."],
  ];
  comoSeLlena.forEach(([a, b], i) => {
    const r = 25 + i;
    P.poner(2, r, a, S.fijoTxt);
    P.poner(3, r, b, S.fijoTxt);
    P.poner(4, r, null, S.fijoTxt);
    P.mezclas.push(`C${r}:D${r}`);
    P.altos.set(r, i === 4 ? 78 : 48);
  });

  // ── Diario ──
  const PRIMERA = 6;
  const D = new Hoja("Diario");
  D.anchos = [6, 12, 9, 46, 13, 13, 9, 11, 14, 14, 12, 13, 12, 14, 9, 13, 13, 30];
  D.poner(1, 1, "Diario · una fila por anuncio y por día", S.titulo);
  D.poner(1, 2, "Se llenan las celdas amarillas, una vez por día. Gasto del DÍA en US$ (no acumulado). La fila violeta es G1-2 (D8): solo entra si la fila G-05 pasa a ✅ ANTES de crear la campaña; si no entra, se deja vacía.", S.nota);
  D.mezclas.push("A2:R2");
  D.altos.set(2, 34);
  const encabezados = [
    "Día", "Fecha", "Código", "Pieza", "Gasto del día (US$)", "Impresiones", "Clics", "Frecuencia", "Conversaciones",
    "De dueños o administradores", "Demos agendadas", "Reprod. 3 s (video)", "ThruPlay (video)", "Costo por conversación (US$)",
    "CTR", "3 s ÷ impresiones", "ThruPlay ÷ 3 s", "Nota",
  ];
  encabezados.forEach((t, i) => D.poner(i + 1, 5, t, S.enc));
  D.altos.set(5, 48);
  const datosPorClave = new Map((opciones.datos ?? []).map((d) => [`${d.codigo}:${d.dia}`, d]));
  let fila = PRIMERA;
  for (const a of anuncios) {
    for (let dia = 1; dia <= dias; dia += 1, fila += 1) {
      const d = datosPorClave.get(`${a.codigo}:${dia}`) ?? {};
      const txt = a.opcional ? S.optTxt : S.fijoTxt;
      D.poner(1, fila, dia, a.opcional ? S.optNum : S.fijoNum);
      D.formula(2, fila, `IF(INICIO="","",INICIO+A${fila}-1)`, S.calcFecha);
      D.poner(3, fila, a.codigo, txt);
      D.poner(4, fila, `${a.id} · ${a.formato}`, txt);
      D.poner(5, fila, d.gasto ?? null, S.entUsd);
      D.poner(6, fila, d.impresiones ?? null, S.entEnt);
      D.poner(7, fila, d.clics ?? null, S.entEnt);
      D.poner(8, fila, d.frecuencia ?? null, S.entDec);
      D.poner(9, fila, d.conversaciones ?? null, S.entEnt);
      D.poner(10, fila, d.duenos ?? null, S.entEnt);
      D.poner(11, fila, d.demos ?? null, S.entEnt);
      D.poner(12, fila, d.rep3s ?? null, esVideo(a) ? S.entEnt : S.calcEnt);
      D.poner(13, fila, d.thruplay ?? null, esVideo(a) ? S.entEnt : S.calcEnt);
      D.formula(14, fila, `IF(N(I${fila})>0,N(E${fila})/I${fila},"")`, S.calcUsd);
      D.formula(15, fila, `IF(N(F${fila})>0,N(G${fila})/F${fila},"")`, S.calcPct);
      D.formula(16, fila, `IF(AND(N(F${fila})>0,N(L${fila})>0),L${fila}/F${fila},"")`, S.calcPct);
      D.formula(17, fila, `IF(N(L${fila})>0,N(M${fila})/L${fila},"")`, S.calcPct);
      D.poner(18, fila, null, S.entTxt);
    }
  }
  const ULTIMA = fila - 1;
  D.congelar = { col: 4, fila: 5 };
  D.validaciones.push(
    { tipo: "whole", operador: "greaterThanOrEqual", rango: `F${PRIMERA}:G${ULTIMA} I${PRIMERA}:M${ULTIMA}`, minimo: 0, titulo: "Número entero", mensaje: "Va un número entero, 0 o más." },
    { tipo: "decimal", operador: "greaterThanOrEqual", rango: `E${PRIMERA}:E${ULTIMA} H${PRIMERA}:H${ULTIMA}`, minimo: 0, titulo: "Número", mensaje: "Va un número, 0 o más. El gasto en US$ y con punto o coma decimal según el idioma de la hoja." },
  );
  const rg = (col) => `Diario!$${col}$${PRIMERA}:$${col}$${ULTIMA}`;

  // ── Cortes ──
  const C = new Hoja("Cortes");
  C.anchos = [10, 40, 14, 14, 14, 14, 16, 16, 40];
  C.poner(1, 1, "Cortes y frenos · todo se calcula desde la hoja Diario", S.titulo);
  C.poner(1, 2, "Un corte vale solo cuando están los días completos: antes dice ESPERAR. CORTAR* = antes de pausar se descarta una falla de entrega (anuncio aprobado y con impresiones, el chat abre con el código y el bot contesta). Se pausa, no se borra ni se cambia la pieza: cambiar creativo o segmentación, o agregar un anuncio, reinicia el aprendizaje.", S.nota);
  C.mezclas.push("A2:I2");
  C.altos.set(2, 48);
  C.poner(1, 3, "Días con datos", S.etiqueta);
  C.formula(2, 3, `SUMPRODUCT(MAX((${rg("E")}>0)*${rg("A")}))`, S.calcEnt);
  nombres.DIAS_CON_DATOS = "$B$3";

  const acumulado = (colRango, codigoCelda, hasta) =>
    codigoCelda
      ? `SUMIFS(${rg(colRango)},${rg("C")},${codigoCelda},${rg("A")},"<="&${hasta})`
      : `SUMIFS(${rg(colRango)},${rg("A")},"<="&${hasta})`;
  const seccion = (inicio, titulo, diaCorte, columnas) => {
    C.poner(1, inicio, titulo, S.etiqueta);
    C.poner(2, inicio, "Hasta el día:", S.etiqueta);
    C.poner(3, inicio, diaCorte, S.fijoNum);
    const enc = inicio + 1;
    columnas.forEach((c, i) => C.poner(i + 1, enc, c.titulo, S.enc));
    C.altos.set(enc, 34);
    const filas = [...anuncios.map((a) => ({ a })), { total: true }];
    filas.forEach((f, i) => {
      const r = enc + 1 + i;
      columnas.forEach((c, j) => {
        const col = j + 1;
        if (c.fijo) return C.poner(col, r, f.total ? (j === 0 ? "Campaña" : j === 1 ? "Todos los anuncios" : null) : c.fijo(f.a), f.total ? S.fijoTxt : f.a.opcional ? S.optTxt : S.fijoTxt);
        if (c.veredicto) return C.formula(col, r, c.veredicto(r, f.total), S.veredicto);
        return C.formula(col, r, c.formula(r, f.total ? null : `$A${r}`, `$C$${inicio}`), c.estilo);
      });
    });
    return { primera: enc + 1, ultima: enc + filas.length, total: enc + filas.length };
  };

  // Día 3 — por anuncio
  const d3 = seccion(
    5,
    "DÍA 3",
    3,
    [
      { titulo: "Código", fijo: (a) => a.codigo },
      { titulo: "Pieza", fijo: (a) => `${a.id} · ${a.formato}` },
      { titulo: "Gasto (US$)", formula: (r, cod, h) => acumulado("E", cod, h), estilo: S.calcUsd },
      { titulo: "Gasto (Bs)", formula: (r) => `C${r}*TC`, estilo: S.calcBs },
      { titulo: "Impresiones", formula: (r, cod, h) => acumulado("F", cod, h), estilo: S.calcEnt },
      { titulo: "Clics", formula: (r, cod, h) => acumulado("G", cod, h), estilo: S.calcEnt },
      { titulo: "CTR", formula: (r) => `IF(E${r}>0,F${r}/E${r},"")`, estilo: S.calcPct },
      { titulo: "Conversaciones", formula: (r, cod, h) => acumulado("I", cod, h), estilo: S.calcEnt },
      { titulo: "Veredicto del día 3 (por anuncio)", veredicto: (r, total) => (total ? `""` : `IF(N(E${r})=0,"SIN DATOS",IF(DIAS_CON_DATOS<$C$5,"ESPERAR: faltan días",IF(H${r}=0,"CORTAR*: 0 conversaciones",IF(G${r}<CTR_MIN,"CORTAR*: CTR bajo","SEGUIR"))))`) },
    ],
  );
  // Día 7 — la decisión es de la campaña
  const i7 = d3.ultima + 2;
  const d7 = seccion(
    i7,
    "DÍA 7",
    7,
    [
      { titulo: "Código", fijo: (a) => a.codigo },
      { titulo: "Pieza", fijo: (a) => `${a.id} · ${a.formato}` },
      { titulo: "Gasto (US$)", formula: (r, cod, h) => acumulado("E", cod, h), estilo: S.calcUsd },
      { titulo: "Gasto (Bs)", formula: (r) => `C${r}*TC`, estilo: S.calcBs },
      { titulo: "Conversaciones", formula: (r, cod, h) => acumulado("I", cod, h), estilo: S.calcEnt },
      { titulo: "De dueños o administradores", formula: (r, cod, h) => acumulado("J", cod, h), estilo: S.calcEnt },
      { titulo: "Costo por conversación (Bs)", formula: (r) => `IF(E${r}>0,D${r}/E${r},"")`, estilo: S.calcBs },
      { titulo: "", fijo: () => null },
      { titulo: "Veredicto del día 7 (decide la campaña)", veredicto: (r, total) => (total ? `IF(N(C${r})=0,"SIN DATOS",IF(DIAS_CON_DATOS<$C$${i7},"ESPERAR: faltan días",IF(F${r}=0,"CORTAR*: 0 conversaciones de dueños",IF(G${r}>BS_CONV_MAX,"CORTAR*: costo por conversación sobre el tope","SEGUIR"))))` : `""`) },
    ],
  );
  // Día 14
  const i14 = d7.ultima + 2;
  const d14 = seccion(
    i14,
    "DÍA 14",
    dias,
    [
      { titulo: "Código", fijo: (a) => a.codigo },
      { titulo: "Pieza", fijo: (a) => `${a.id} · ${a.formato}` },
      { titulo: "Gasto (US$)", formula: (r, cod, h) => acumulado("E", cod, h), estilo: S.calcUsd },
      { titulo: "Gasto (Bs)", formula: (r) => `C${r}*TC`, estilo: S.calcBs },
      { titulo: "De dueños o administradores", formula: (r, cod, h) => acumulado("J", cod, h), estilo: S.calcEnt },
      { titulo: "Demos agendadas", formula: (r, cod, h) => acumulado("K", cod, h), estilo: S.calcEnt },
      { titulo: "Costo por demo (Bs)", formula: (r) => `IF(F${r}>0,D${r}/F${r},"")`, estilo: S.calcBs },
      { titulo: "", fijo: () => null },
      { titulo: "Veredicto del día 14 (decide la campaña)", veredicto: (r, total) => (total ? `IF(N(C${r})=0,"SIN DATOS",IF(DIAS_CON_DATOS<$C$${i14},"ESPERAR: faltan días",IF(F${r}=0,"CORTAR*: 0 demos",IF(G${r}>BS_DEMO_MAX,"CORTAR*: costo por demo sobre el tope","SEGUIR"))))` : `""`) },
    ],
  );
  const iF = d14.ultima + 2;
  C.poner(1, iF, "FRENOS DE PLATA", S.etiqueta);
  const frenos = [
    ["Gasto de Meta acumulado (US$)", `SUM(${rg("E")})`, S.calcUsd],
    ["Gasto de Meta acumulado (Bs)", `C${iF + 1}*TC`, S.calcBs],
    ["Gastado del presupuesto de la campaña", `C${iF + 1}/USD_TOTAL`, S.calcPct],
    ["Estado frente al tope de Meta (Bs 750)", `IF(C${iF + 2}>=BS_TOPE_META,"APAGAR A MANO: llegó al tope",IF(C${iF + 2}>=0.9*BS_TOPE_META,"ACERCÁNDOSE (≥ 90 %)","OK"))`, S.veredicto],
    ["Meta + otros gastos del techo (Bs)", `C${iF + 2}+OTROS_BS`, S.calcBs],
    ["Estado frente al techo total (Bs 1.400)", `IF(C${iF + 5}>=BS_TECHO,"APAGAR TODO: llegó al techo",IF(C${iF + 5}>=0.9*BS_TECHO,"ACERCÁNDOSE (≥ 90 %)","OK"))`, S.veredicto],
  ];
  frenos.forEach(([etiqueta, f, estilo], i) => {
    C.poner(2, iF + 1 + i, etiqueta, S.fijoTxt);
    C.formula(3, iF + 1 + i, f, estilo);
  });
  const reglasDeEstado = (celda, aviso) => [
    { dxf: 0, formula: `LEFT(${celda},6)="${aviso}"` },
    { dxf: 2, formula: `LEFT(${celda},5)="ACERC"` },
    { dxf: 1, formula: `${celda}="OK"` },
  ];
  C.formatosCondicionales.push(
    ...[d3, d7, d14].map((sec) => ({
      rango: `I${sec.primera}:I${sec.ultima}`,
      reglas: [
        { dxf: 0, formula: `LEFT(I${sec.primera},6)="CORTAR"` },
        { dxf: 1, formula: `I${sec.primera}="SEGUIR"` },
        { dxf: 2, formula: `OR(LEFT(I${sec.primera},6)="ESPERAR",I${sec.primera}="SIN DATOS")` },
      ],
    })),
    { rango: `C${iF + 4}`, reglas: reglasDeEstado(`C${iF + 4}`, "APAGAR") },
    { rango: `C${iF + 6}`, reglas: reglasDeEstado(`C${iF + 6}`, "APAGAR") },
  );

  // ── libro ──
  const hojas = [P, D, C];
  const definidos = Object.entries(nombres)
    .map(([n, ref]) => {
      if (ref === null) return null;
      const hoja = n === "DIAS_CON_DATOS" ? "Cortes" : "Parámetros";
      return `<definedName name="${n}">'${hoja}'!${ref}</definedName>`;
    })
    .filter(Boolean)
    .join("");
  const archivos = [
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${hojas.map((h, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ["xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${hojas.map((h, i) => `<sheet name="${esc(h.nombre)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets><definedNames>${definidos}</definedNames><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`],
    ["xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${hojas.map((h, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${hojas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ["xl/styles.xml", est.xml()],
    ...hojas.map((h, i) => [`xl/worksheets/sheet${i + 1}.xml`, h.xml()]),
  ];
  return { buffer: zip(archivos), resumen: { anuncios, dias, filasDiario: [PRIMERA, ULTIMA], cortes: { d3, d7, d14 }, frenos: iF, parametros: { bsConv, bsDemo, ctrMin } } };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf("--salida");
  const salida = i > 0 ? process.argv[i + 1] : `${raiz}${SALIDA_POR_DEFECTO}`;
  const { buffer, resumen } = construirPlanilla();
  writeFileSync(salida, buffer);
  console.log(`${salida} · ${buffer.length} bytes · ${resumen.anuncios.length} anuncios × ${resumen.dias} días`);
}
