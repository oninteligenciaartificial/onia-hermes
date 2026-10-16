#!/usr/bin/env node
// Escribe la hoja de cada pieza de la prueba 1 v2: `G1-n-hoja.md`, «referencia | nuestra», desde su brief.
//
//   node .claude/skills/onia-ventas-pauta/scripts/replica-hojas.mjs
//
// Lee `carousels/briefs/ads/prueba1-v2/G1-*.json` y escribe `G1-n-hoja.md` al lado. Las imágenes las saca
// `replica-render.mjs`. Todo lo que dice la hoja sale del brief: se edita el brief y se vuelve a correr (la hoja no se toca a mano).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const DIR = path.join(REPO, 'hermes-content/carousels/briefs/ads/prueba1-v2');
const sin = (s) => String(s ?? '').replace(/\*/g, '');
const cel = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function hoja(b) {
  const r = b.referencia;
  const vid = !b.estatico;
  const L = [];
  L.push(`# ${b.id} · ${b.pieza}`);
  L.push('');
  L.push(`> **Prueba 1 v2 · 11-oct-2026 · Ventas y pauta.** Nada se creó en Meta, cero gasto, nadie contactado. Generado por \`replica-hojas.mjs\` desde \`${b.id}.json\`: se edita el brief, no esta hoja.`);
  L.push('');
  L.push(`![hoja ${b.id}](../../../out/ads/prueba1-v2/hojas/${b.id}-hoja.png)`);
  L.push('');
  L.push(`**Referencia:** ${r.anunciante} \`${r.id}\` · **${r.dias} días al aire** al 11-oct (antigüedad, no rendimiento) · ${r.formato}. Ficha zona por zona: \`research/competencia/anuncios/replicas/REFERENCIAS-GRUPO-1.md\` §${b.ficha}.${b.apoyo ? ` Apoyo: ${b.apoyo}` : ''}`);
  L.push(`**Nuestra pieza:** ${b.formato.relacion}${b.formato.duracion_s ? ` · ${b.formato.duracion_s} s` : ''} · código del chat \`${b.precargado.match(/\(([A-Z]\d+)\)/)[1]}\` · imágenes en \`carousels/out/ads/prueba1-v2/${b.id}/\`.`);
  L.push('');
  L.push('## Zona por zona');
  L.push('');
  L.push('| Zona | Referencia (lo que se ve en su captura) | Nuestra |');
  L.push('|---|---|---|');
  for (const [z, a, n] of b.zonas) L.push(`| **${cel(z)}** | ${cel(a)} | ${cel(n)} |`);
  L.push('');
  L.push('## Gancho (checklist de §9.3)');
  L.push('');
  const g = b.gancho;
  const lineas = (b.estatico?.titular ?? g.texto).map(sin);
  L.push(`- **Texto en pantalla:** «${lineas.join(' / ')}» (${lineas.length} líneas de ${lineas.map((l) => l.length).join(' y ')} caracteres, sin punto final, un énfasis).`);
  L.push(`- **Se ve (cuadro 0):** ${g.imagen}`);
  if (g.voz) L.push(`- **Se dice:** «${g.voz}»`);
  L.push(`- **Alinean sin repetirse:** ${g.alineacion}`);
  if (g.alternativa) L.push(`- **Alternativa:** «${g.alternativa.map(sin).join(' / ')}»`);
  L.push('');
  if (b.guion?.length) {
    L.push('## Guion');
    L.push('');
    L.push('| Tramo | Toma | Se dice | En pantalla |');
    L.push('|---|---|---|---|');
    for (const p of b.guion) L.push(`| ${cel(p.tramo)} | ${cel(p.toma)} | ${cel(p.voz)} | ${cel(p.en_pantalla)} |`);
    L.push('');
  }
  L.push('## El anuncio en Meta');
  L.push('');
  L.push('Texto principal (la primera línea es el filtro):');
  L.push('');
  L.push('```');
  L.push(b.texto_principal);
  L.push('```');
  L.push('');
  L.push(`- **Titular:** \`${b.titular}\` · **Botón:** «${b.boton}» (un solo llamado, un solo destino) · **Texto precargado:** \`${b.precargado}\``);
  L.push('');
  L.push('## Modelar, no clonar');
  L.push('');
  L.push(`- **Se queda:** ${b.modelado.se_queda}`);
  L.push(`- **Cambia:** ${b.modelado.cambia}`);
  L.push('');
  L.push('## Promesas: cada frase atada a su fila');
  L.push('');
  L.push('| Frase | Fuente y estado | Filas que tienen que estar en ✅ |');
  L.push('|---|---|---|');
  for (const p of b.promesas) L.push(`| ${cel(p.frase)} | ${cel(p.fuente)} | ${p.filas?.length ? p.filas.join(', ') : '—'} |`);
  L.push('');
  L.push('## No dice');
  L.push('');
  for (const x of b.no_dice) L.push(`- ${x}`);
  L.push('');
  L.push('## Lo que graba o fotografía Sergio Urcullo');
  L.push('');
  for (const x of b.para_sergio) L.push(`- ${x}`);
  L.push('');
  L.push('## Límites de esta maqueta');
  L.push('');
  L.push('- La persona es la foto de perfil de Sergio Urcullo recortada (`references/marca-personal-sergio`/`ui-patterns/apple-editorial/logos/sergio-rembg.png`), solo para ver el layout. La toma real la graba y la autoriza él; su cara y su voz en un anuncio pasan por su sí y el de Leslie Mercado Moreno (CLAUDE.md).');
  L.push('- La pantalla de Onia es la captura del candidato del 30-sep (`briefs/assets/onia-1.0-dental-ads/candidato-20260930/pendientes-confirmador.png`), recortada a dos filas con los mismos píxeles. Se recaptura con la cuenta demo antes de subir. Las filas de arriba siguen ⬜ hasta mirarlas con esa cuenta.');
  L.push('- No se muestra el mensaje al paciente (está en voseo) ni el botón «Enviar yo mismo por WhatsApp» (G-03 🟡).');
  L.push(`- Lo único que prueba la referencia es que lleva ${r.dias} días al aire; no cuánto rinde.`);
  L.push('');
  return L.join('\n');
}

// PARA-GRABAR.txt: solo lo que Sergio Urcullo dice (teleprompter, de usted, una frase por renglón, con su duración) y, para la foto, su lista.
function grabar(piezas) {
  const L = ['PARA GRABAR · prueba 1 v2 · 11-oct-2026', 'Todo de usted. Una frase por renglón. Entre corchetes, el tramo y los segundos que tiene. Sin música.', 'Nadie se contacta ni se sube nada con esto: es solo para que Sergio Urcullo grabe.', ''];
  for (const b of piezas) {
    L.push('='.repeat(64));
    L.push(`${b.id} · ${b.pieza} · ${b.formato.relacion}${b.formato.duracion_s ? ` · ${b.formato.duracion_s} s` : ''} · código ${b.precargado.match(/\(([A-Z]\d+)\)/)[1]}`);
    if (/^espera/.test(b.estado ?? '')) L.push(`(ESPERA: ${b.estado.replace(/^espera: /, '')}. Se graba igual para tenerla lista.)`);
    L.push('='.repeat(64));
    if (b.foto) {
      L.push('ES UNA FOTO, NO UN VIDEO. No hay nada que decir.');
      for (const [k, t] of [['plano', 'Plano'], ['expresion', 'Expresión'], ['en_la_mano', 'En la mano'], ['fondo', 'Fondo'], ['ropa', 'Ropa'], ['cantidad', 'Cuántas'], ['entrega', 'Entrega']]) L.push(`${t}: ${b.foto[k]}`);
    } else {
      for (const p of b.guion) {
        const frases = p.voz.split(/(?<=[.?!])\s+/).filter(Boolean);
        L.push(`[${p.tramo}]`);
        for (const f of frases) L.push(f);
        L.push('');
      }
    }
    L.push('');
  }
  return L.join('\n');
}

const piezas = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^G1-\d+\.json$/.test(x)).sort()) {
  const b = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  piezas.push(b);
  const out = path.join(DIR, `${b.id}-hoja.md`);
  fs.writeFileSync(out, hoja(b));
  console.log(path.relative(REPO, out));
}
fs.writeFileSync(path.join(DIR, 'PARA-GRABAR.txt'), grabar(piezas));
console.log(path.relative(REPO, path.join(DIR, 'PARA-GRABAR.txt')));
