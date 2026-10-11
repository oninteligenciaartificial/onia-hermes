#!/usr/bin/env node
// Hueco máximo entre EVENTOS VISUALES NUEVOS, medido desde plan.json (no a mano). Regla 15 (v2): un evento visual nuevo como máximo cada 2,0 s.
// Evento = entrada o acento de una tarjeta, el rótulo de IA que sale, cada miniatura, cada referencia, la escala y su marca, el dato / la pastilla / el sello
// y cada énfasis de las imágenes, cada fila de la lección, la nota 2, la franja, cada pulso, la foto B del café, su pie y el anillo, el pulso del CTA y cada
// COSTURA (empuje de 6 cuadros, que lleva consigo la tarjeta que entra). El empuje lento de las fotos NO cuenta como evento.
// Uso: node scripts/eventos.mjs   (sale con 1 si algún hueco pasa de 2,0 s)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));

export function listaEventos(p) {
  const FPS = p.lienzo.fps, END = p.lienzo.frames / FPS, PUSH = p.empuje.cuadros / FPS;
  const ev = new Map();
  const add = (t, que) => { if (t == null || t <= 0.05 || t >= END - 0.05) return; const k = +t.toFixed(3); ev.set(k, (ev.get(k) || []).concat(que)); };
  const viaja = new Set(p.costuras.filter((c) => c.tarjetas && c.tarjetas.entra).map((c) => c.tarjetas.entra));
  for (const c of p.tarjetas) { if (!viaja.has(c.id)) add(c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
  add(p.rotulo.b, 'rótulo IA sale');
  const g = p.gancho.miniaturas; g.ids.forEach((id, i) => add(g.a + i * g.escalon, 'miniatura ' + id.toUpperCase()));
  const rg = p.regla; for (let i = rg.refs.estaticas; i < p.refs.recortes.length; i++) add(rg.refs.a + (i - rg.refs.estaticas) * rg.refs.escalon, 'ref ' + (i + 1));
  add(rg.escala.a, 'escala'); add(rg.escala.ax_t, 'ejes'); add(rg.escala.uno_t, '«1» se enciende'); add(rg.escala.marca_t, 'marca 0,70');
  for (const m of p.imagenes.filter((x) => x.tarjeta)) {
    add(m.tag_t, m.letra + ' dato'); if (m.sello) add(m.sello.t, m.letra + ' sello'); if (m.pastilla) add(m.pastilla.t, m.letra + ' pastilla');
    for (const e of m.enfasis || []) add(e.t, `${m.letra} énfasis ${e.que}`);
  }
  const l1 = p.l1; add(l1.nota2.t, 'l1 nota 2'); add(l1.ruido.t, 'l1 franja de ruido');
  for (const f of l1.filas) { add(f.t, 'l1 fila ' + f.img); add(f.t + 0.1, 'l1 punto ' + f.img); add(f.t + 0.2, 'l1 valor ' + f.img); }
  for (const q of l1.pulsos) add(q.t, 'l1 pulso ' + q.img);
  const l2 = p.l2; for (const f of l2.fotos.lista) { add(f.t, 'l2 foto ' + f.letra); add(f.cap_t, 'l2 pie ' + f.letra); } add(l2.anillo_t, 'l2 anillo');
  add(p.cta.pulso_t, 'CTA pulso');
  for (const c of p.costuras) add(c.t - PUSH, 'costura');
  const ts = [0.1, ...[...ev.keys()].sort((a, b) => a - b), END];
  const gaps = [];
  for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
  return { ev, ts, gaps, END };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { ev, ts, gaps, END } = listaEventos(p);
  const sorted = [...gaps].sort((x, y) => y.d - x.d);
  const lim = p.aire.max_entre_eventos_s;
  console.log(`eventos visuales nuevos: ${ts.length - 2} en ${END.toFixed(2)} s (más el inicio 0,1 s y el final) = ${((ts.length - 2) / END * 10).toFixed(1)} por 10 s`);
  const por10 = []; for (let a = 0; a < END; a += 10) por10.push(`${a}-${Math.min(a + 10, END).toFixed(1)} s: ${[...ev.keys()].filter((t) => t >= a && t < a + 10).length}`);
  console.log('por 10 s: ' + por10.join(' · '));
  console.log('mayores huecos entre eventos:');
  for (const x of sorted.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['inicio']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
  const max = sorted[0].d;
  console.log(max <= lim + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ ${lim.toFixed(1)} s)` : `✖ hueco máximo ${max.toFixed(2)} s (> ${lim.toFixed(1)} s)`);
  if (max > lim + 1e-9) process.exit(1);
}
