// Zona segura medida en PÍXELES del master (no en el DOM). v2: tres escenas.
//   escena 2 (cuadros 84-186, cada 6; K4|R3 sobre fondo liso #11191b): encima del panel (y < PN.y) todo es fondo, y debajo del panel el contenido (rótulos, «misma pose…», beat A) termina antes de y 1490;
//   escenas 1 y 3 (K4 a pantalla completa): la caja del contenido es todo píxel que DIFIERE de la foto de K4 llevada al mismo encuadre (cover 1080×1920) en más de 40 niveles, es decir, las tarjetas de texto:
//     escena 1 (cuadros 0-60, cada 6) y escena 3 (cuadros 204-359, cada 8) dentro de y 292-1490 y x 80-1000.
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {P,plan,check,save} from './qa-dom.mjs';
const file=path.resolve(P,process.argv[2]||'out/viernes-copia-final-1080x1920.mp4');check(fs.existsSync(file),'Master ausente');
const W=540,H=960,SZ=W*H*3,BG=[17,25,27],UMBRAL=10,UM_FOTO=40,PN=plan.paneles;
const T1=plan.costuras[0].t*24,T2=plan.costuras[1].t*24,PUSH=plan.empuje.cuadros;
const sel=[];for(let n=0;n<=T1-PUSH-6;n+=6)sel.push(n);for(let n=T1+12;n<=T2-PUSH-3;n+=6)sel.push(n);for(let n=T2+9;n<=359;n+=8)sel.push(n);if(!sel.includes(359))sel.push(359);
const expr=sel.map(n=>`eq(n\\,${n})`).join('+');
const raw=execFileSync('ffmpeg',['-v','error','-i',file,'-vf',`select=${expr},scale=${W}:${H}:flags=area,format=rgb24`,'-vsync','0','-f','rawvideo','pipe:1'],{maxBuffer:900*1024*1024});
check(raw.length===sel.length*SZ,`Cuadros extraídos ${raw.length/SZ}, esperados ${sel.length}`);
const ref=execFileSync('ffmpeg',['-v','error','-i',path.join(P,plan.fotos.k4.archivo),'-vf',`scale=-2:1920:flags=bilinear,crop=1080:1920,scale=${W}:${H}:flags=area,format=rgb24`,'-frames:v','1','-f','rawvideo','pipe:1'],{maxBuffer:100*1024*1024});
check(ref.length===SZ,'Referencia de K4 con tamaño inesperado');
const bboxBg=(buf,y0,y1)=>{let x1=1e9,y1b=1e9,x2=-1,y2=-1;for(let y=y0;y<y1;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3;if(Math.abs(buf[i]-BG[0])>UMBRAL||Math.abs(buf[i+1]-BG[1])>UMBRAL||Math.abs(buf[i+2]-BG[2])>UMBRAL){if(x<x1)x1=x;if(x>x2)x2=x;if(y<y1b)y1b=y;if(y>y2)y2=y}}return x2<0?null:[x1*2,y1b*2,x2*2+1,y2*2+1]};
// caja de lo que difiere de la foto: una fila/columna cuenta si tiene ≥ 8 píxeles distintos (a media resolución), para no contar ruido de compresión suelto
const bboxFoto=(buf)=>{const filas=new Int32Array(H),cols=new Int32Array(W);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3;if(Math.abs(buf[i]-ref[i])>UM_FOTO||Math.abs(buf[i+1]-ref[i+1])>UM_FOTO||Math.abs(buf[i+2]-ref[i+2])>UM_FOTO){filas[y]++;cols[x]++}}
 let y1=-1,y2=-1,x1=-1,x2=-1;for(let y=0;y<H;y++)if(filas[y]>=8){if(y1<0)y1=y;y2=y}for(let x=0;x<W;x++)if(cols[x]>=8){if(x1<0)x1=x;x2=x}return y1<0?null:[x1*2,y1*2,x2*2+1,y2*2+1]};
const lines=['Zona segura en píxeles del master (medido a media resolución, ±2 px):'];
const est={s1:{n:0,mxB:0,mnT:1e9,mnX:1e9,mxX:0},s3:{n:0,mxB:0,mnT:1e9,mnX:1e9,mxX:0}};let e2=0,e2b=0,e2top=true;
sel.forEach((n,k)=>{const buf=raw.subarray(k*SZ,(k+1)*SZ);
 if(n<T1){const b=bboxFoto(buf);check(b,`Escena 1 sin texto sobre la foto en f${n}`);const e=est.s1;e.n++;e.mxB=Math.max(e.mxB,b[3]);e.mnT=Math.min(e.mnT,b[1]);e.mnX=Math.min(e.mnX,b[0]);e.mxX=Math.max(e.mxX,b[2])}
 else if(n<T2){e2++;const top=bboxBg(buf,0,Math.floor(PN.y/2)-2);if(top)e2top=false;const bot=bboxBg(buf,Math.ceil((PN.y+PN.h)/2)+2,H);if(bot)e2b=Math.max(e2b,bot[3])}
 else{const b=bboxFoto(buf);check(b,`Escena 3 sin texto sobre la foto en f${n}`);const e=est.s3;e.n++;e.mxB=Math.max(e.mxB,b[3]);e.mnT=Math.min(e.mnT,b[1]);e.mnX=Math.min(e.mnX,b[0]);e.mxX=Math.max(e.mxX,b[2])}});
for(const [id,e] of Object.entries(est)){lines.push(`escena ${id.slice(1)} (${id==='s1'?'rótulo, título y dato':'beats B y C y CTA'}): ${e.n} cuadros; contenido y ${e.mnT}-${e.mxB}, x ${e.mnX}-${e.mxX} (límites y 292-1490, x 80-1000)`);
 check(e.mnT>=292&&e.mxB<=1490&&e.mnX>=78&&e.mxX<=1002,`Escena ${id.slice(1)} fuera de la zona segura: y ${e.mnT}-${e.mxB}, x ${e.mnX}-${e.mxX}`)}
lines.push(`escena 2: ${e2} cuadros; encima del panel (y < ${PN.y}) todo es fondo: ${e2top?'sí':'NO'}; debajo del panel el contenido (rótulos, «misma pose…» y beat A) llega a y ${e2b} (límite 1490)`);
check(e2top,'Hay contenido sobre el panel de la escena 2');check(e2b<=1490,`Escena 2: contenido bajo y 1490 (${e2b})`);
save('zona-segura-pixeles.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
