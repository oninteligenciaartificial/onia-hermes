import fs from 'node:fs';import path from 'node:path';import {P,plan,save,check} from './qa-dom.mjs';
const voz=fs.readFileSync(path.join(P,'guion-voz.txt'),'utf8'),pie=fs.readFileSync(path.join(P,'pie.txt'),'utf8');
const html=fs.readFileSync(path.join(P,'index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ');
const text=[html,pie,voz].join('\n');
const prohibited=[/la luz cambia cuando la cara se sostiene/ig,/la foto sola pierde la cara/ig,/(?:las|todas las|ambas) caras.{0,65}(?:menos de|<|bajo)\s*200/ig,/el mejor/ig,/garantiz\w+/ig,/Sergio Urcullo/ig,/agend[aáe]|demo de Onia/ig,
 /efecto estimado|ventaja|dentro del ruido|≈\s*0,03/ig,/era copia,? no identidad/ig,/muy pronto|pr[oó]ximamente|en construcci[oó]n|\bbeta\b/ig,/soy odont[oó]loga|mis pacientes|testimonio/ig,/Kling (?:siempre|nunca) (?:copia|pierde)|todos los motores/ig];
const hits=prohibited.flatMap(r=>[...text.matchAll(r)].map(m=>m[0]));
// v2: el promedio de las 4, el piso 0,70, la banda de las fotos oficiales y todo lo del gráfico viven SOLO en el pie; en pantalla (el HTML) no pueden aparecer
hits.push(...[...html.matchAll(/promedio|\bpiso\b|oficiales|leyenda|gr[aá]fico|barra|banda/ig)].map(m=>`pantalla: ${m[0]}`));
// y las frases de gráfico no vuelven al pie
hits.push(...[...pie.matchAll(/en el gr[aá]fico|el gr[aá]fico|banda gris|leyenda/ig)].map(m=>`pie: ${m[0]}`));save('grep-prohibidas.txt',`Coincidencias prohibidas: ${hits.length}\n${hits.join('\n')}\nEXIT ${hits.length?1:0}\n`);check(!hits.length,'Prohibidas: '+hits.join(', '));
check(pie.startsWith('Personaje hecho con IA: Lucía Antelo, de @oniahq.'),'Declaración IA pie');check(!/https?:\/\//.test(html),'URL externa pantalla');
check(plan.textos.rotulo==='Lucía Antelo · personaje IA de Onia'&&html.includes(plan.textos.rotulo),'Rótulo IA en pantalla');
check(pie.includes('Nombro lo que uso; no es una recomendación pagada.'),'Falta la aclaración D-N1 en el pie');
for(const s of ['Kling O1 Image','Higgsfield','ArcFace'])check(text.includes(s),'Nombre permitido ausente '+s);
console.log('0 coincidencias; pantalla/pie/voz (sin gráfico en pantalla ni en el pie); nombres autorizados D-N1 y ArcFace.');
