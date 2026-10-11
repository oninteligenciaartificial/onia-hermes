// Pruebas NEGATIVAS del DOM (v2): se estropea a propósito una copia de index.html (en el mismo sitio, con restauración garantizada) y el gate correspondiente TIENE que salir con exit ≠ 0.
// Vale más que una mutación del plan: mira lo que Chromium dibujó. Escribe qa/negativas-dom.txt. Uso: node scripts/negativas-dom.mjs   (después de node scripts/build.mjs)
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {P,check,save} from './qa-dom.mjs';
const idx=path.join(P,'index.html'),bueno=fs.readFileSync(idx,'utf8'),md5=s=>crypto.createHash('md5').update(s).digest('hex');
const casos=[
 ['una BARRA del gráfico en la pantalla (la marca del piso 0,70 dentro del beat B)','layout-dom',h=>h.replace('<b class="num">0,56–0,73</b>','<b class="num">0,56–0,73</b><i class="piso" style="left:70%"></i>')],
 ['«Promedio de las 4» como texto de un beat','grep-prohibidas',h=>h.replace('Con esa foto:','Promedio de las 4:')],
 ['la banda gris de las fotos oficiales en el DOM','layout-dom',h=>h.replace('<span class="lb">Con las otras 7:</span>','<span class="lb">Con las otras 7:</span><i class="banda"></i>')],
 ['la etiqueta del beat A a 40 px (< 48)','medir-dom',h=>h.replace('</style>','#beat-a .lb{font-size:40px!important}</style>')],
 ['un texto de la escena 2 a 36 px (< 40 absoluto)','layout-dom',h=>h.replace('</style>','#tile2{font-size:36px!important}</style>')],
 ['DOS IDEAS a la vez (el beat C siempre visible sobre el B)','medir-dom',h=>h.replace('</style>','#beat-c{opacity:1!important}</style>')],
 ['sin la cara de la escena 3 (la foto oculta: fondo negro de 8 a 15 s)','layout-dom',h=>h.replace('</style>','#foto-s3{display:none!important}</style>')],
 ['sin la cara de la escena 1 (la foto oculta)','layout-dom',h=>h.replace('</style>','#foto-s1{display:none!important}</style>')]];
const lines=['Pruebas negativas del DOM (v2): cada alteración de index.html tiene que hacer fallar su gate (exit ≠ 0); después se restaura el index.html y se comprueba el md5.',`md5 del index.html bueno: ${md5(bueno)}`];
try{for(const [nombre,gate,f] of casos){const malo=f(bueno);check(malo!==bueno,`la alteración «${nombre}» no cambió el HTML`);fs.writeFileSync(idx,malo);
  const r=spawnSync('node',[path.join(P,'scripts',gate+'.mjs')],{cwd:P,encoding:'utf8',env:process.env});const msg=((r.stderr||'').match(/Error: .*/)||[(r.stdout||'').split('\n').filter(l=>/FALLA|fallo|regla|Hay |no /i.test(l)).slice(0,1).join('')])[0]||'';
  lines.push(`${r.status!==0?'RECHAZADA':'NO RECHAZADA'} · ${gate} exit ${r.status} · ${nombre} · ${String(msg).slice(0,140)}`);check(r.status!==0,`La alteración «${nombre}» NO fue rechazada por ${gate}`)}}
finally{fs.writeFileSync(idx,bueno);}
check(md5(fs.readFileSync(idx,'utf8'))===md5(bueno),'index.html no se restauró');
// Los gates escriben sus .txt solo cuando pasan; se vuelve a correr cada uno para dejar la evidencia de la versión buena
for(const g of ['layout-dom','medir-dom','grep-prohibidas']){const r=spawnSync('node',[path.join(P,'scripts',g+'.mjs')],{cwd:P,encoding:'utf8',env:process.env});check(r.status===0,`${g} no vuelve a pasar tras restaurar el HTML`)}
lines.push(`index.html restaurado (md5 ${md5(bueno)}) y layout-dom, medir-dom y grep-prohibidas vuelven a salir con exit 0.`,`${casos.length} alteraciones rechazadas`);
save('negativas-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
