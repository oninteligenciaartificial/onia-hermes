// Regresión pura del reporte completo; NO ejecuta medir-dom ni abre Chromium.
import {auditarDom} from './auditar-dom.mjs';import {plan,check,save} from './qa-dom.mjs';
const box=(id,x,y,w,h,size)=>({id,x,y,w,h,size,opacity:1,clip:'s3'});
const rows=[{f:0,t:0,boxes:[box('rotulo',80,300,920,72,48),box('titulo',80,760,920,90,66)]},
 {f:440,t:440/24,boxes:[box('cta',80,1360,920,150.71875,66),box('otra-nota',20,280,920,80,48)]},
 {f:441,t:441/24,boxes:[box('cta',80,1360,920,150.71875,66)]}];
const reads=[{id:'dato',a:1.583333,duration:4},{id:'cta',a:17.583333,duration:2.416667}];
const result=auditarDom(rows,reads,{},plan);
check(result.fallos.length===5,'Debe conservar cinco fallos independientes (CTA inferior ×2, nota superior y lateral, dos ideas a la vez)');
check(result.fallos.some(f=>f.regla==='más de una idea a la vez'&&f.cuadro===440),'Debe marcar dos ideas a la vez (CTA + otra nota en el mismo cuadro)');
// una letra de 40 px en un texto grande (≥ 48) y otra de 36 px (< 40 absoluto) deben fallar
{const r2=auditarDom([{f:0,t:0,boxes:[box('rotulo',80,300,920,72,48),box('titulo',80,760,920,90,66)]},{f:100,t:100/24,boxes:[{...box('beat-a',80,1200,920,200,56),minSize:40},{...box('beat-z',80,320,100,60,36)}]}],reads,{},plan);
 check(r2.fallos.some(f=>f.id==='beat-a'&&f.regla==='letra pequeña (texto grande)'),'Un nodo de texto de 40 px en un beat debe fallar (mínimo 48 px)');
 check(r2.fallos.some(f=>f.id==='beat-z'&&f.regla==='letra bajo el mínimo absoluto'),'Una letra de 36 px debe fallar (mínimo absoluto 48 px)');
 // v2 pasada 2: TODO texto visible ≥ 48 px, sin excepción: una letra de 47 px también falla (también el rótulo de IA)
 const r3=auditarDom([{f:0,t:0,boxes:[box('rotulo',80,300,920,72,47),box('titulo',80,760,920,90,66)]}],reads,{},plan);
 check(r3.fallos.some(f=>f.id==='rotulo'&&f.regla.startsWith('letra')),'El rótulo de IA a 47 px debe fallar (mínimo 48 px sin excepción)');}
check(result.fallos.filter(f=>f.id==='cta'&&f.regla==='corte inferior').length===2,'Debe seguir después del primer corte CTA');
check(result.fallos.some(f=>f.id==='otra-nota'&&f.regla==='borde superior')&&result.fallos.some(f=>f.id==='otra-nota'&&f.regla==='corte lateral'),'Debe acumular otros límites');
check(result.fallos.every(f=>Number.isInteger(f.cuadro)&&Number.isFinite(f.tiempo)&&f.valor!==undefined),'Reporte debe incluir cuadro/tiempo/valor');
save('verificar-auditor.txt',`Regresión pura: cinco fallos conservados (CTA inferior en f440/f441; nota superior/lateral y dos ideas a la vez en f440) y letras de 40 px en un beat / 36 px rechazadas. No es una medición DOM real.\nEXIT 0\n`);
console.log('Reporte acumulativo: cinco fallos independientes conservados; letras pequeñas rechazadas; EXIT 0');
