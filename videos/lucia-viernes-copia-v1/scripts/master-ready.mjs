import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {P,plan,check} from './qa-dom.mjs';
const status=JSON.parse(fs.readFileSync(path.join(P,'qa/build-status.json'),'utf8'));
check(status.apto_master&&!status.borrador,'NO APTO PARA MASTER: reconstruir con scripts/build.mjs (sin --borrador).');
for(const [k,f] of Object.entries(plan.fotos)){const file=path.join(P,f.archivo);check(fs.existsSync(file),`Fuente ${k} ausente: ${f.archivo}`);check(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===f.sha256,`Fuente ${k}: SHA-256 distinto del plan`);}
check(!/proxy|\.mp4/.test(fs.readFileSync(path.join(P,'index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'')),'El HTML apunta a un proxy o a un video: esta pieza usa solo las dos fotos originales (PNG)');
console.log('Fuentes completas (K4 y R3 con su SHA-256); apto para comenzar QA/render, pendiente aprobación visual.');
