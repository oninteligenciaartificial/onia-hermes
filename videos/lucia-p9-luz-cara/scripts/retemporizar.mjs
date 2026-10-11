// P9 es muda: cronograma estimado a 17 caracteres/segundo, sin pistas ni generación. Mantiene clips a 1×.
// v2 (H4): además de caber en 480 cuadros, comprueba que L1-L3 terminen antes del corte a Seedance, que L4 empiece después y deja la tabla línea ↔ pantalla.
import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const text=fs.readFileSync(path.join(P,'guion-voz.txt'),'utf8');const c=cronograma(text,plan.voz.ultimo_tramo_cuadros);
check(c.chars<=plan.voz.max_caracteres,`Cupo de voz: ${c.chars} > ${plan.voz.max_caracteres}`);check(c.cuadros===480,'Cronograma debe ser 480 cuadros; ajustar texto/cola CTA en plan.json sin acelerar clips');
check(!/\d/.test(text),'La voz no habla cifras ni decimales (están en pantalla)');
const L=n=>c.tramos[n-1],cz=plan.voz.cortes,fin=n=>L(n).a+L(n).voz_s,n3=cz.lineas_clip_1.at(-1);
check(fin(n3)<=cz.termina_antes_de,`L${n3} termina a ${fin(n3).toFixed(3)} s, después del corte (${cz.termina_antes_de} s)`);
check(L(cz.linea_clip_2).a>=cz.empieza_desde-1e-6,`L${cz.linea_clip_2} empieza a ${L(cz.linea_clip_2).a.toFixed(3)} s, antes de ${cz.empieza_desde} s`);
const lines=[`Cronograma de voz ESTIMADO (17 car/s; no hay voz): ${c.chars} caracteres con saltos (cupo ${plan.voz.max_caracteres}), ${c.tramos.length} líneas, ${c.cuadros} cuadros = ${(c.cuadros/24).toFixed(3)} s`,
 `L1-L3 terminan a ${fin(n3).toFixed(3)} s (corte a Seedance 5,75-6,0 s; tope ${cz.termina_antes_de}); L${cz.linea_clip_2} empieza a ${L(cz.linea_clip_2).a.toFixed(3)} s (desde ${cz.empieza_desde})`,
 'línea  caract   voz_ini   voz_fin  tramo_fin  hueco  pantalla que coincide'];
for(const t of c.tramos){const ev=plan.eventos.find(e=>e.voz===t.n);
 lines.push(`  L${t.n}  ${String(t.chars).padStart(6)}  ${t.a.toFixed(3).padStart(8)}  ${(t.a+t.voz_s).toFixed(3).padStart(8)}  ${t.b.toFixed(3).padStart(9)}  ${t.hueco.toFixed(2)}  ${ev?`${ev.selector} entra a ${ev.t} s (+${(ev.t-t.a).toFixed(2)} s sobre el inicio de la línea)`:'—'}`);
 if(ev)check(ev.t-t.a>=-0.05&&ev.t-t.a<=0.5,`${ev.selector} no coincide con L${t.n}`);}
lines.push('Las entradas de L5, L6 y L7 se re-miden cuando haya voz real (duraciones.json) y se corrigen en plan.json → eventos.');
save('tramos-voz.json',c);save('alineacion-voz.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
