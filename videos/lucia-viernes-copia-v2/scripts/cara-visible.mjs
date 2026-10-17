// Gate (v2): fracción de cuadros del MASTER con una cara de Lucía ≥ 200 px en el lienzo (muestreo cada 0,5 s, SCRFD del face-gate).
// Exige MÁS de la mitad del tiempo (plan.cara_visible.minimo) y el objetivo del 85 % (plan.cara_visible.objetivo). Escribe qa/cara-visible.json y qa/cara-visible.txt.
// Uso: FACE_GATE_HOME=…/lucia-face-gate node scripts/cara-visible.mjs [out/viernes-copia-final-1080x1920.mp4] [--negativa]
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';
const NEG=process.argv.includes('--negativa'),arg=process.argv.slice(2).filter(a=>!a.startsWith('--'))[0],pref=NEG?'cara-visible-negativa':'cara-visible'; // --negativa: prueba con un video estropeado; no pisa la evidencia del master
const file=path.resolve(P,arg||'out/viernes-copia-final-1080x1920.mp4');check(fs.existsSync(file),'Master ausente; PENDIENTE.');
const home=process.env.FACE_GATE_HOME;check(home&&fs.existsSync(path.join(home,'venv/bin/python')),'FACE_GATE_HOME sin venv del face-gate (no se instala nada aquí)');
const CV=plan.cara_visible;
const raw=execFileSync(path.join(home,'venv/bin/python'),['-I',path.join(P,'scripts/cara-visible.py'),file,String(CV.muestreo),String(CV.min_px)],{maxBuffer:50*1024*1024,env:{...process.env,FACE_GATE_HOME:home}}).toString();
const j=JSON.parse(raw);save(pref+'.json',j);
const lines=[`Cara de Lucía a la vista en el master (SCRFD det_10g, muestreo cada ${j.muestreo_s} s, cara ≥ ${j.min_px} px en el lienzo de 1080×1920):`,'t(s)  cuadro  cara más grande (px)  con cara'];
for(const m of j.muestras)lines.push(`${m.t.toFixed(1).padStart(4)}  ${String(m.cuadro).padStart(5)}  ${String(m.max_px).padStart(8)}  ${m.con_cara?'sí':'NO'}`);
lines.push(`Muestras con cara ≥ ${j.min_px} px: ${j.con_cara} de ${j.n_muestras} = ${(j.fraccion*100).toFixed(1)} % (mínimo exigido > ${CV.minimo*100} %, objetivo ≥ ${CV.objetivo*100} %)`);
const sin=j.muestras.filter(m=>!m.con_cara).map(m=>`${m.t.toFixed(1)} s`);lines.push(`Muestras sin cara: ${sin.length?sin.join(', '):'ninguna'}`);
save(pref+'.txt',lines.join('\n')+'\n');console.log(lines.join('\n'));
check(j.fraccion>CV.minimo,`Cara visible ${(j.fraccion*100).toFixed(1)} %: debe ser MÁS de la mitad del tiempo`);
check(j.fraccion>=CV.objetivo,`Cara visible ${(j.fraccion*100).toFixed(1)} %: el objetivo es ≥ ${CV.objetivo*100} %`);
save(pref+'.txt',lines.join('\n')+'\nEXIT 0\n');
