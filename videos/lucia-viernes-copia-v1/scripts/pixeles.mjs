// Checks exclusivos del master. No genera videos. Adaptación Node/ffmpeg de P9 a fotos fijas:
// Los paneles se miden sin los 10 px pegados al divisor de 6 px (lo tapa); el color: el master es bt709 y la media RGB difiere ≈ 1,5 niveles de la fuente PNG (no se baja el umbral).
//   psnr-fotos : cuadros del master contra la foto original llevada al mismo encuadre (escena 1: K4 cover a 1080x1920; escena 2: cada panel antes de que entren los aros)
//   vacios     : cuadros planos (std de luma < 6) y mayores saltos de luma
//   aire       : quietud en píxeles fuera de las ventanas de lectura
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {P,plan,check} from './qa-dom.mjs';
const [mode,file='out/viernes-copia-final-1080x1920.mp4']=process.argv.slice(2);check(fs.existsSync(path.resolve(P,file)),'Master ausente; PENDIENTE.');
const master=path.resolve(P,file),ff=args=>execFileSync('ffmpeg',['-v','error',...args],{maxBuffer:200*1024*1024});
const N=plan.lienzo.cuadros;
if(mode==='psnr-fotos'){
 const status=JSON.parse(fs.readFileSync(path.join(P,'qa/build-status.json'),'utf8'));check(status.apto_master&&!status.borrador,'PSNR exige fuentes completas');
 const k4=path.join(P,plan.fotos.k4.archivo),r3=path.join(P,plan.fotos.r3.archivo),PN=plan.paneles;
 const sK=PN.w/plan.fotos.k4.ancho,sR=PN.h/plan.fotos.r3.alto;
 const jobs=[
  // [nombre, cuadros del master, fuente, filtro de la fuente (lleva la foto al encuadre del lienzo), caja ROI en el lienzo]
  ['s1 K4 pantalla completa (y 300-1100)',[12,36,60],k4,`scale=-2:1920:flags=bilinear,crop=1080:1920`,[0,300,1080,800]],
  ['s2 panel K4 (cara y mano, antes de los aros)',[84,90,96],k4,`scale=${PN.w}:${Math.round(plan.fotos.k4.alto*sK)}:flags=bilinear,crop=${PN.w}:${PN.h}:0:0,pad=1080:1920:0:${PN.y}:color=black`,[0,PN.y,PN.w-10,PN.h]],
  ['s2 panel R3 (cara y mano, antes de los aros)',[84,90,96],r3,`scale=${Math.round(plan.fotos.r3.ancho*sR)}:${PN.h}:flags=bilinear,crop=${PN.w}:${PN.h}:${PN.r3.ox}:0,pad=1080:1920:${PN.w}:${PN.y}:color=black`,[PN.w+10,PN.y,PN.w-10,PN.h]]];
 let minimum=Infinity;
 for(const [nombre,frames,src,vf,[X,Y,W,H]] of jobs)for(const f of frames){
  const a=ff(['-i',master,'-vf',`select=eq(n\\,${f}),crop=${W}:${H}:${X}:${Y},format=rgb24`,'-frames:v','1','-f','rawvideo','pipe:1']);
  const b=ff(['-i',src,'-vf',`${vf},crop=${W}:${H}:${X}:${Y},format=rgb24`,'-frames:v','1','-f','rawvideo','pipe:1']);
  check(a.length===W*H*3&&a.length===b.length,`Cuadro ausente/tamaño PSNR (${nombre} f${f}: ${a.length} vs ${b.length})`);let mse=0;for(let i=0;i<a.length;i++)mse+=(a[i]-b[i])**2;mse/=a.length;const psnr=mse?10*Math.log10(255**2/mse):Infinity;minimum=Math.min(minimum,psnr);
  console.log(`${nombre} · master f${f}: PSNR ${psnr.toFixed(2)} dB`);check(psnr>=35,'PSNR <35: revisar alineación/escalado/color, no bajar umbral');}
 console.log(`PSNR mínimo ${minimum.toFixed(2)} dB (umbral 35)`);
}else if(mode==='vacios'||mode==='aire'){
 const raw=ff(['-i',master,'-vf','scale=108:192,format=gray','-f','rawvideo','pipe:1']),size=108*192,n=raw.length/size;
 check(n===N,`Master: ${n} cuadros, esperado ${N}`);const reads=JSON.parse(fs.readFileSync(path.join(P,'qa/lectura-tarjetas.json'),'utf8'));let empty=0,max=0,run=0,maxAt=0;
 for(let f=0;f<n;f++){let sum=0,sq=0,diff=0;for(let i=0;i<size;i++){const x=raw[f*size+i];sum+=x;sq+=x*x;if(f)diff+=Math.abs(x-raw[(f-1)*size+i]);}const std=Math.sqrt(sq/size-(sum/size)**2);if(std<6)empty++;const reading=reads.some(r=>f/24>=r.a&&f/24<r.a+r.min);run=f&&diff/size<.35&&!reading?run+1:0;if(run>max){max=run;maxAt=f/24}}
 console.log(`${n} cuadros; planos ${empty}; quietud fuera de lectura ${(max/24).toFixed(3)} s (diferencia media <0,35; termina en ${maxAt.toFixed(3)} s).`);check(mode==='vacios'?empty===0:max/24<=.3,'Falla gate píxeles');
}else throw Error('Uso: pixeles.mjs psnr-fotos|vacios|aire [out/viernes-copia-final-1080x1920.mp4]');
