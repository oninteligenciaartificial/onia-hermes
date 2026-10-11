// Prueba negativa sin tocar fuentes ni contenido: ejecuta build con lecturas interceptadas.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath,pathToFileURL} from 'node:url';
import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const src=fs.readFileSync(path.join(P,'scripts/build.mjs'),'utf8').replace(/^import .*;\r?$/gm,'').replaceAll('import.meta.url',JSON.stringify(pathToFileURL(path.join(P,'scripts/build.mjs')).href));
const cases=[
 ['parecido',p=>p.clips[0].parecido[1]=.75,null,/m1 parecido/],
 ['créditos',p=>p.clips[1].creditos=7,null,/m4 créditos/],
 ['brillo',p=>p.clips[1].brillo[2]=-32,null,/m4 brillo/],
 ['cara 139',p=>p.clips[1].cara_px[0]=138,null,/m4 cara px/],
 ['cara 347',p=>p.clips[1].cara_px[1]=348,null,/m4 cara px/],
 ['todas las caras <200',p=>p.textos.limite_cara='Todas las caras miden menos de 200 px.',null,/textos\/cifras/],
 ['cifra pantalla',p=>p.textos.m1=p.textos.m1.replace('0,72','0,73'),null,/textos\/cifras/],
 ['cifra pie',()=>{},['pie.txt',s=>s.replace('0,72','0,73')],/pie y cifras/],
 ['declaración IA pie',()=>{},['pie.txt',s=>s.replace('Personaje hecho con IA','Personaje digital')],/Pie debe abrir/],
 ['cifra voz',()=>{},['guion-voz.txt',s=>s.replace('0,72','0,73')],/voz y cifras/]
];
let lines=[];for(const [name,mutate,rewrite,pattern] of cases){const p=structuredClone(plan);mutate(p);const fake=Object.create(fs);fake.readFileSync=(file,...args)=>{if(path.resolve(file)===path.join(P,'plan.json'))return JSON.stringify(p);const value=fs.readFileSync(file,...args);return rewrite&&path.resolve(file)===path.join(P,rewrite[0])?rewrite[1](value):value};
 let message='';try{vm.runInNewContext(src,{fs:fake,path,fileURLToPath,cronograma,process:{argv:[]},console},{timeout:2000})}catch(e){message=e.message}check(pattern.test(message),`${name}: no rechazado por el motivo esperado: ${message}`);lines.push(`${name}: RECHAZADO correctamente`);}
save('validar-mutaciones.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
