// Diferencia ArcFace master ↔ fuente (centroide contra las 8 oficiales) de los 12 pares de recortes-arcface.sh (v2: 3 de la escena 1, 6 de los paneles de la escena 2 y 3 de la escena 3); regla ≤ 0,02.
// Lee qa/arcface-pares.json (face-gate.sh) y escribe qa/arcface-final.txt. Exit 1 si algún par pasa de 0,02 o falta una cara.
import fs from 'node:fs';import path from 'node:path';import {P,check,save} from './qa-dom.mjs';
const d=JSON.parse(fs.readFileSync(path.join(P,'qa/arcface-pares.json'),'utf8'));
const c=k=>{const s=d.scores[k];check(s&&typeof s.centroid==='number',`sin cara en ${k}`);return s.centroid};
const pares=[];for(const f of [12,36,60])pares.push([`master-b1-f${f}.png`,'fuente-b1-k4.png']);
for(const f of [78,84,96])pares.push([`master-b2-k4-f${f}.png`,'fuente-b2-k4.png'],[`master-b2-r3-f${f}.png`,'fuente-b2-r3.png']);
for(const f of [210,246,330])pares.push([`master-b3-f${f}.png`,'fuente-b1-k4.png']);
let mx=0;const lines=pares.map(([m,s])=>{const dif=Math.abs(c(m)-c(s));mx=Math.max(mx,dif);return `${m}: master ${c(m).toFixed(3)} contra fuente ${c(s).toFixed(3)} dif ${dif.toFixed(3)}`});
lines.push(`${pares.length} pares; diferencia máxima ${mx.toFixed(3)} (regla <= 0,02): ${mx<=0.02?'OK':'FALLA'}`);
save('arcface-final.txt',lines.join('\n')+'\n');console.log(lines.join('\n'));check(mx<=0.02,`ArcFace master↔fuente: diferencia máxima ${mx.toFixed(3)} > 0,02`);
