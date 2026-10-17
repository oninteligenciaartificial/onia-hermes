#!/usr/bin/env node
// 2da pasada (H8): hueco máximo entre EVENTOS VISUALES, medido desde plan.json (no a mano). Evento = entrada de tarjeta, acento, etiqueta (entra/sale), aro,
// recorte (entra/sale), marco de la cara, costura/morph, sello, cuadros de la placa y el destello «origen». (Los clips K4 y K1 se mueven solos y el contador cambia en cada cuadro: el hueco se mide igual, sin descontarlos.) Uso: node scripts/eventos.mjs   (sale con 1 si algún hueco pasa de 2,9 s)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const ev = new Map();
const add = (t, que) => { if (t > 0.2 && t < 58) ev.set(+t.toFixed(3), (ev.get(+t.toFixed(3)) || []).concat(que)); };
for (const c of p.tarjetas) { add(c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
add(p.rotulo.b, 'rótulo IA sale');
for (const e of p.etiquetas.filter((x) => x.activo !== false)) { add(e.a, e.id); add(e.b, e.id + ' sale'); }
add(p.letrero.aro.a, 'aro');
if (p.letrero.inset && p.letrero.inset.activo !== false) { add(p.letrero.inset.a, 'recorte letrero'); add(p.letrero.inset.b, 'recorte letrero sale'); }
add(p.marco_cara.a, 'marco cara');
for (const k of ['inset1', 'inset2']) if (p.agenda[k] && p.agenda[k].activo !== false) { add(p.agenda[k].a, k); add(p.agenda[k].b, k + ' sale'); }
for (const c of p.costuras) add(c.t, 'costura');
add(p.particion.morph_in.a, 'morph'); add(p.particion.morph_out.a, 'morph');
add(p.placa.sello_t, 'sello'); for (const t of p.placa.tiles) add(t.t, 'cuadro ' + t.n);
const ts = [0.1, ...[...ev.keys()].sort((a, b) => a - b), 58];
const gaps = [];
for (let i = 1; i < ts.length; i++) {
  const a = ts[i - 1], b = ts[i];
  gaps.push({ a, b, d: +(b - a).toFixed(3) });
}
gaps.sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} (más el inicio 0,1 s y el final 58 s)`);
console.log('mayores huecos entre eventos:');
for (const g of gaps.slice(0, 6)) console.log(`  ${g.a.toFixed(2)} → ${g.b.toFixed(2)} s: ${g.d.toFixed(2)} s   (${(ev.get(g.a) || ['inicio']).join(', ')} → ${(ev.get(g.b) || ['fin']).join(', ')})`);
const max = gaps[0].d;
console.log(max <= 2.9 + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ 2,9 s)` : `✖ hueco máximo ${max.toFixed(2)} s (> 2,9 s)`);
if (max > 2.9 + 1e-9) process.exit(1);
