// Regresión pura del reporte completo; NO ejecuta medir-dom ni abre Chromium.
import {auditarDom} from './auditar-dom.mjs';import {plan,check,save} from './qa-dom.mjs';
const box=(id,x,y,w,h,size)=>({id,x,y,w,h,size,opacity:1,clip:'placa'});
const rows=[{f:0,t:0,boxes:[box('rotulo',80,300,920,72,40),box('titulo',80,760,920,90,66)]},
 {f:440,t:440/24,boxes:[box('cta',80,1360,920,150.71875,66),box('otra-nota',20,280,920,80,44)]},
 {f:441,t:441/24,boxes:[box('cta',80,1360,920,150.71875,66)]}];
const reads=[{id:'dato',a:1.583333,duration:4},{id:'cta',a:17.583333,duration:2.416667}];
const result=auditarDom(rows,reads,{},plan);
check(result.fallos.length===4,'Debe conservar cuatro fallos independientes en ambos cuadros');
check(result.fallos.filter(f=>f.id==='cta'&&f.regla==='corte inferior').length===2,'Debe seguir después del primer corte CTA');
check(result.fallos.some(f=>f.id==='otra-nota'&&f.regla==='borde superior')&&result.fallos.some(f=>f.id==='otra-nota'&&f.regla==='corte lateral'),'Debe acumular otros límites');
check(result.fallos.every(f=>Number.isInteger(f.cuadro)&&Number.isFinite(f.tiempo)&&f.valor!==undefined),'Reporte debe incluir cuadro/tiempo/valor');
save('verificar-auditor.txt',`Regresión pura: cuatro fallos conservados (CTA inferior en f440/f441; nota superior/lateral f440). No es una medición DOM real.\nEXIT 0\n`);
console.log('Reporte acumulativo: cuatro fallos independientes conservados; EXIT 0');
