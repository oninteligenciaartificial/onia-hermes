// La pieza es muda: cronograma estimado a 17 caracteres/segundo, sin pistas ni generación. Comprueba que las ocho líneas quepan en 360 cuadros, que L3 empiece con el empuje a la foto de entrada,
// que cada entrada del plan caiga con su línea (−0,05 a +0,5 s) y que el CTA tenga ≥ 2,4 s. Deja la tabla línea ↔ pantalla en qa/alineacion-voz.txt.
// Con voz real: medir cada pista, escribir duraciones.json (voz.mjs las usa), correr este script y corregir plan.json → eventos (campo voz).
import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';import {cronograma,leerDuraciones} from './voz.mjs';
const text=fs.readFileSync(path.join(P,'guion-voz.txt'),'utf8');const c=cronograma(text,plan.voz.ultimo_tramo_cuadros,{duraciones:leerDuraciones(P)});
check(c.chars<=plan.voz.max_caracteres,`Cupo de voz: ${c.chars} > ${plan.voz.max_caracteres}`);check(c.cuadros===plan.lienzo.cuadros,`Cronograma debe ser ${plan.lienzo.cuadros} cuadros (da ${c.cuadros}); ajustar plan.voz.ultimo_tramo_cuadros`);
check(!/\d/.test(text),'La voz no habla cifras ni decimales (están en pantalla)');
const L=n=>c.tramos[n-1],T1=plan.costuras[0].t;
check(Math.abs(L(3).a-T1)<=0.25,`L3 empieza a ${L(3).a.toFixed(3)} s y el empuje a la foto de entrada termina a ${T1} s`);
const cta=plan.lienzo.duracion-L(c.tramos.length).a;check(cta>=2.4,`CTA ${cta.toFixed(3)} s < 2,4 s`);
const lines=[`Cronograma de voz ESTIMADO (17 car/s; no hay voz): ${c.chars} caracteres con saltos (cupo ${plan.voz.max_caracteres}; ≈ 255 caben en 15 s), ${c.tramos.length} líneas, ${c.cuadros} cuadros = ${(c.cuadros/24).toFixed(3)} s`,
 `CTA (L${c.tramos.length}) empieza a ${L(c.tramos.length).a.toFixed(3)} s: ${cta.toFixed(3)} s de exposición (mínimo 2,4); cola sin voz ${(plan.lienzo.duracion-(L(c.tramos.length).a+L(c.tramos.length).voz_s)).toFixed(3)} s (el único hueco ≥ 0,3 s)`,
 'línea  caract   voz_ini   voz_fin  tramo_fin  hueco  pantalla que coincide'];
for(const t of c.tramos){const ev=plan.eventos.find(e=>e.voz===t.n);
 lines.push(`  L${t.n}  ${String(t.chars).padStart(6)}  ${t.a.toFixed(3).padStart(8)}  ${(t.a+t.voz_s).toFixed(3).padStart(8)}  ${t.b.toFixed(3).padStart(9)}  ${t.hueco.toFixed(2)}  ${ev?`${ev.selector} entra a ${ev.t} s (+${(ev.t-t.a).toFixed(2)} s sobre el inicio de la línea)`:'—'}`);
 if(ev)check(ev.t-t.a>=-0.05&&ev.t-t.a<=0.5,`${ev.selector} no coincide con L${t.n}`);
 if(!t.ultimo)check(t.hueco>=0&&t.hueco<=0.3,`pausa de ${t.hueco.toFixed(3)} s tras L${t.n}`);}
lines.push('Las entradas de L3 a L8 se re-miden cuando haya voz real (duraciones.json) y se corrigen en plan.json → eventos.');
save('tramos-voz.json',c);save('alineacion-voz.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
