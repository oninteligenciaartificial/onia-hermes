// Genera los HTML de los apoyos con la tipografía de marca EMBEBIDA (data URI).
// make-mockup.mjs bloquea la red, así que la fuente tiene que ir inline o el
// navegador cae a una del sistema y se rompe la consistencia con los subtítulos.
//
// FORMATO: TIRA COMPACTA (~1000x200 css). Medido 2026-08-02 sobre este video:
// la cara de Arthur llega hasta y≈1290 y el rail del karaoke arranca en y≈1525,
// así que la franja libre son ~200 px. Un panel alto no entra sin taparle la cara.
// Si en el futuro grabás con más aire arriba (cabeza más chica en cuadro), se puede
// volver a paneles altos — el límite es el ENCUADRE, no el diseño.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
// assets → run → runs → arthur-reels-crudos → references → hermes-content
const FUENTE = join(AQUI, "../../../../../brand/fonts/BricolageGrotesque-var-latin.woff2");
const B64 = readFileSync(FUENTE).toString("base64");

const INK = "#0A0F0D";
const SURF = "#F4F5F2";
const VERDE = "#00D26A";
const ROJO = "#FF5A4D";
const GRIS = "#8A8F8C";

const BASE = `
@font-face {
  font-family: 'Bricolage Grotesque';
  src: url(data:font/woff2;base64,${B64}) format('woff2');
  font-weight: 500 700;
  font-style: normal;
  font-display: block;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; }
#stage { display: inline-block; padding: 22px; background: transparent; }
.tira {
  width: 1000px; background: ${INK}; border-radius: 22px; padding: 24px 28px;
  box-shadow: 0 24px 56px rgba(0,0,0,.5);
}
.fila1 {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.titulo { display: flex; align-items: center; gap: 12px; }
.pip { width: 8px; height: 28px; border-radius: 3px; }
.titulo span {
  font-size: 30px; letter-spacing: 3px; color: ${SURF}; text-transform: uppercase;
}
.remate { font-size: 25px; letter-spacing: 2px; text-transform: uppercase; }
.fila2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.chip {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  border-radius: 14px; padding: 14px 10px; font-size: 24px; white-space: nowrap;
}
.quien { color: ${GRIS}; letter-spacing: 1px; }
.punto { width: 9px; height: 9px; border-radius: 50%; flex: none; }
`;

// ---------- A: el desorden ----------
const malos = [
  ["V1", "3 sin ver"],
  ["V2", "5 sin ver"],
  ["V3", "2 sin ver"],
  ["V4", "4 sin ver"],
];

const A = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
.chip.malo { background: rgba(255,90,77,.15); color: ${ROJO}; }
</style></head><body><div id="stage"><div class="tira">
  <div class="fila1">
    <div class="titulo"><div class="pip" style="background:${ROJO}"></div><span>4 listas separadas</span></div>
    <div class="remate" style="color:${ROJO}">Registro central&nbsp;&nbsp;0</div>
  </div>
  <div class="fila2">
    ${malos.map(([v, t]) => `<div class="chip malo">
      <span class="punto" style="background:${ROJO}"></span><span class="quien">${v}</span>${t}
    </div>`).join("")}
  </div>
</div></div></body></html>`;

// ---------- B: el orden ----------
const buenos = [
  ["C1", "Cotizado"],
  ["C2", "Agendado"],
  ["C3", "Esperando"],
  ["C4", "Cerrado"],
];

const B = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
.chip.bueno { background: rgba(0,210,106,.15); color: ${VERDE}; }
</style></head><body><div id="stage"><div class="tira">
  <div class="fila1">
    <div class="titulo"><div class="pip" style="background:${VERDE}"></div><span>una sola lista</span></div>
    <div class="remate" style="color:${VERDE}">Todo en un lugar</div>
  </div>
  <div class="fila2">
    ${buenos.map(([c, t]) => `<div class="chip bueno">
      <span class="punto" style="background:${VERDE}"></span><span class="quien">${c}</span>${t}
    </div>`).join("")}
  </div>
</div></div></body></html>`;

writeFileSync(join(AQUI, "desorden.html"), A);
writeFileSync(join(AQUI, "orden.html"), B);
console.log("html generados: desorden.html · orden.html  (tira compacta, fuente embebida)");
