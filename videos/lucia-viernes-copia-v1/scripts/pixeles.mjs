// Checks exclusivos del master. No genera videos. Adaptación Node/ffmpeg de G5.
import {execFileSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {P,plan,check} from './qa-dom.mjs';
const [mode,file='out/p9-final-1080x1920.mp4']=process.argv.slice(2);check(fs.existsSync(path.resolve(P,file)),'Master ausente; PENDIENTE.');
const master=path.resolve(P,file),ff=args=>execFileSync('ffmpeg',['-v','error',...args],{maxBuffer:40*1024*1024});
if(mode==='psnr'||mode==='psnr-clips'){
 const status=JSON.parse(fs.readFileSync(path.join(P,'qa/build-status.json'),'utf8'));check(status.apto_master&&!status.borrador,'PSNR exige fuente m4 completa');
 const W=1080,H=300,Y=400;let minimum=Infinity;
 for(const c of plan.clips)for(const n of [12,60,108]){
  const f=Math.round(c.a*24)+n,source=path.resolve(P,'../../hermes-content/references/modelos/lucia/v4',c.fuente);
  // Región sin tarjetas; mismo escalado, mismo cuadro (select, sin seek aproximado).
  const extract=(file,frame,scale)=>ff(['-i',file,'-vf',`select=eq(n\\,${frame}),${scale?'scale=1080:1920:flags=bilinear,':''}crop=${W}:${H}:0:${Y},format=rgb24`,'-frames:v','1','-f','rawvideo','pipe:1']);
  const a=extract(master,f,false),b=extract(source,n,true);check(a.length===W*H*3&&a.length===b.length,'Cuadro ausente/tamaño PSNR');let mse=0;for(let i=0;i<a.length;i++)mse+=(a[i]-b[i])**2;mse/=a.length;const psnr=mse?10*Math.log10(255**2/mse):Infinity;minimum=Math.min(minimum,psnr);console.log(`${c.id} fuente f${n} → master f${f}: PSNR ${psnr.toFixed(2)} dB (ROI y400–700 sin tarjetas)`);check(psnr>=35,'PSNR <35: revisar alineación/escalado/color, no bajar umbral');
 }console.log(`PSNR mínimo ${minimum.toFixed(2)} dB`);
}else if(mode==='vacios'||mode==='aire'){
 const raw=ff(['-i',master,'-vf','scale=108:192,format=gray','-f','rawvideo','pipe:1']),size=108*192,N=raw.length/size;
 check(N===480,`Master: ${N} cuadros, esperado480`);const reads=JSON.parse(fs.readFileSync(path.join(P,'qa/lectura-tarjetas.json'),'utf8'));let empty=0,max=0,run=0;
 for(let f=0;f<N;f++){let sum=0,sq=0,diff=0;for(let i=0;i<size;i++){const x=raw[f*size+i];sum+=x;sq+=x*x;if(f)diff+=Math.abs(x-raw[(f-1)*size+i]);}const std=Math.sqrt(sq/size-(sum/size)**2);if(std<6)empty++;const reading=reads.some(r=>f/24>=r.a&&f/24<r.a+r.min);run=f&&diff/size<.35&&!reading?run+1:0;max=Math.max(max,run);}
 console.log(`${N} cuadros; planos ${empty}; quietud fuera de lectura ${(max/24).toFixed(3)} s (diferencia media <0,35).`);check(mode==='vacios'?empty===0:max/24<=.3,'Falla gate píxeles');
}else throw Error('Uso: pixeles.mjs psnr-clips|vacios|aire [out/p9-final-1080x1920.mp4]');
