import fs from 'node:fs';import path from 'node:path';import {P,plan,save,check} from './qa-dom.mjs';
const voz=fs.readFileSync(path.join(P,'guion-voz.txt'),'utf8'),pie=fs.readFileSync(path.join(P,'pie.txt'),'utf8');
const html=fs.readFileSync(path.join(P,'index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ');
const text=[html,pie,voz].join('\n');
const prohibited=[/la luz cambia cuando la cara se sostiene/ig,/la foto sola pierde la cara/ig,/(?:las|todas las|ambas) caras.{0,65}(?:menos de|<|bajo)\s*200/ig,/el mejor/ig,/garantiz\w+/ig,/Sergio Urcullo/ig,/agend[aáe]|demo de Onia/ig];
const hits=prohibited.flatMap(r=>[...text.matchAll(r)].map(m=>m[0]));save('grep-prohibidas.txt',`Coincidencias prohibidas: ${hits.length}\n${hits.join('\n')}\nEXIT ${hits.length?1:0}\n`);check(!hits.length,'Prohibidas: '+hits.join(', '));
check(pie.startsWith('Personaje hecho con IA'),'Declaración IA pie');check(!/https?:\/\//.test(html),'URL externa pantalla');
for(const s of ['Kling 3.0 std','Seedance 2.0 Mini','Higgsfield','ArcFace'])check(text.includes(s),'Nombre permitido ausente '+s);
console.log('0 coincidencias; pantalla/pie/voz; nombres autorizados D-N1 y ArcFace.');
