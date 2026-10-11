import fs from 'node:fs';import path from 'node:path';import {P,check} from './qa-dom.mjs';
const status=JSON.parse(fs.readFileSync(path.join(P,'qa/build-status.json'),'utf8'));
check(status.apto_master&&!status.borrador,'NO APTO PARA MASTER: reconstruir sin --borrador con m4 completo presente.');
check(fs.existsSync(status.m4),'Fuente m4 completa ausente');check(!fs.readFileSync(path.join(P,'index.html'),'utf8').includes('m4-proxy.mp4'),'HTML apunta al proxy');
console.log('Fuentes completas; apto para comenzar QA/render, pendiente aprobación visual.');
