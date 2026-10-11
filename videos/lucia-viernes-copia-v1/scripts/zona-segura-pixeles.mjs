// Zona segura medida en PÍXELES del master (no en el DOM). Dos escenas tienen fondo liso (#11191b), así que el contenido se detecta como todo píxel que difiere del fondo en más de 10 niveles:
//   placa (cuadros 162-359, cada 4): caja de contenido dentro de y 292-1490 y x 80-1000 (como P9);
//   escena 2 (cuadros 84-150, cada 6): encima del panel (y < 370) todo es fondo, y debajo del panel el contenido (pie de las dos fotos y textos) termina antes de y 1490.
// La escena 1 es una foto a pantalla completa: su pila de texto (y 1190-1474) se mide en el DOM (medir-dom) y se mira en la hoja de contacto con la guía de y 1490.
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';
const file=path.resolve(P,process.argv[2]||'out/viernes-copia-final-1080x1920.mp4');check(fs.existsSync(file),'Master ausente');
const W=540,H=960,SZ=W*H*3,BG=[17,25,27],UMBRAL=10,PN=plan.paneles;
const sel=[];for(let n=84;n<=150;n+=6)sel.push(n);for(let n=162;n<=359;n+=4)sel.push(n);if(!sel.includes(359))sel.push(359);
const expr=sel.map(n=>`eq(n\\,${n})`).join('+');
const raw=execFileSync('ffmpeg',['-v','error','-i',file,'-vf',`select=${expr},scale=${W}:${H}:flags=area,format=rgb24`,'-vsync','0','-f','rawvideo','pipe:1'],{maxBuffer:600*1024*1024});
check(raw.length===sel.length*SZ,`Cuadros extraídos ${raw.length/SZ}, esperados ${sel.length}`);
const bbox=(buf,y0,y1)=>{let x1=1e9,y1b=1e9,x2=-1,y2=-1;for(let y=y0;y<y1;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3;if(Math.abs(buf[i]-BG[0])>UMBRAL||Math.abs(buf[i+1]-BG[1])>UMBRAL||Math.abs(buf[i+2]-BG[2])>UMBRAL){if(x<x1)x1=x;if(x>x2)x2=x;if(y<y1b)y1b=y;if(y>y2)y2=y}}return x2<0?null:[x1*2,y1b*2,x2*2+1,y2*2+1]};
const lines=['Zona segura en píxeles del master (fondo #11191b, umbral 10 niveles; medido a media resolución, ±2 px):'];let pl=0,mxB=0,mnT=1e9,mnX=1e9,mxX=0,e2=0,e2b=0,e2top=true;
sel.forEach((n,k)=>{const buf=raw.subarray(k*SZ,(k+1)*SZ);
 if(n>=162){const b=bbox(buf,0,H);check(b,`Placa vacía en f${n}`);pl++;mxB=Math.max(mxB,b[3]);mnT=Math.min(mnT,b[1]);mnX=Math.min(mnX,b[0]);mxX=Math.max(mxX,b[2]);}
 else{e2++;const top=bbox(buf,0,Math.floor(PN.y/2)-2);if(top)e2top=false;const bot=bbox(buf,Math.ceil((PN.y+PN.h)/2)+2,H);if(bot)e2b=Math.max(e2b,bot[3]);}});
lines.push(`placa: ${pl} cuadros; contenido y ${mnT}-${mxB}, x ${mnX}-${mxX} (límites y 292-1490, x 80-1000)`);
lines.push(`escena 2: ${e2} cuadros; encima del panel (y < ${PN.y}) todo es fondo: ${e2top?'sí':'NO'}; debajo del panel el contenido llega a y ${e2b} (límite 1490)`);
check(mnT>=292&&mxB<=1490&&mnX>=78&&mxX<=1002,`Placa fuera de la zona segura: y ${mnT}-${mxB}, x ${mnX}-${mxX}`);check(e2top,'Hay contenido sobre el panel de la escena 2');check(e2b<=1490,`Escena 2: contenido bajo y 1490 (${e2b})`);
save('zona-segura-pixeles.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
