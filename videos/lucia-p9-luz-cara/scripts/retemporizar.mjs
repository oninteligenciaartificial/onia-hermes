// P9 es muda: cronograma estimado, sin pistas ni generación. Mantiene clips a 1×.
import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const text=fs.readFileSync(path.join(P,'guion-voz.txt'),'utf8');const c=cronograma(text,plan.voz.ultimo_tramo_cuadros);
check(c.chars<=305,'Cupo de voz');check(c.cuadros===480,'Cronograma debe ser 480 cuadros; ajustar texto/cola CTA en plan.json sin acelerar clips');
save('tramos-voz.json',c);console.log(`Cronograma estimado ${c.chars} caracteres, ${c.cuadros} cuadros; medios preservados, sin voz real.`);
