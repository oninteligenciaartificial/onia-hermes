// Capturas del DOM (Chromium local) a tiempos dados, sin render: node scripts/captura.mjs <carpeta> t1 t2 ...   (para mirar el diseño antes del borrador de 360p)
import fs from 'node:fs';import path from 'node:path';import {open} from './qa-dom.mjs';
const [dir,...ts]=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
const {browser,page}=await open();
try{for(const t of ts){await page.evaluate(t=>{window.__timelines.main.time(+t,false);},t);await page.waitForTimeout(150);await page.screenshot({path:path.join(dir,`t${String(t).replace('.','_')}.png`)});}}finally{await browser.close()}
