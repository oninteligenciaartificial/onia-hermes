// QA adaptado de G5/P9: Chromium local, cuadro por cuadro, sin render ni red. Esta pieza no trae modo --estatico: todos los gates DOM corren en Chromium real.
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';
export const P=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const plan=JSON.parse(fs.readFileSync(path.join(P,'plan.json'),'utf8'));
export const words=s=>s.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
export const need=s=>s===plan.textos.cta?Math.max(2.4,words(s)*.35+.3):words(s)*.35+.3;
export function save(n,s){fs.writeFileSync(path.join(P,'qa',n),typeof s==='string'?s:JSON.stringify(s,null,2));}
export function check(ok,msg){if(!ok)throw Error(msg);}
export async function open(){
 const req=createRequire(import.meta.url);
 const candidates=[process.env.PLAYWRIGHT_MODULE,'playwright','/opt/node-tools/node_modules/playwright',path.join(process.env.APPDATA||'','Python/Python312/site-packages/playwright/driver/package')].filter(Boolean);
 let pw;for(const c of candidates){try{pw=req(c);break}catch{}}
 if(!pw)throw Error('Playwright local no disponible; definir PLAYWRIGHT_MODULE. No instalar automáticamente.');
 const args={headless:true,args:['--no-sandbox']};if(process.env.PRODUCER_HEADLESS_SHELL_PATH)args.executablePath=process.env.PRODUCER_HEADLESS_SHELL_PATH;
 const browser=await pw.chromium.launch(args);const page=await browser.newPage({viewport:{width:1080,height:1920}});
 await page.route('**/*',route=>/^https?:/.test(route.request().url())?route.abort():route.continue());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(P,'index.html')).href);await page.evaluate(()=>document.fonts.ready);
 check(!errors.length,errors.join('\n'));return {browser,page};
}
export async function samples(page){return page.evaluate((N)=>{
 const output=[];const timeline=window.__timelines.main;
 const text=e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let v=[],n;while(n=walker.nextNode())v.push(n.textContent);return v.join(' ').replace(/\s+/g,' ').trim()};
 for(let f=0;f<N;f++){timeline.time(f/24,false);let boxes=[];
 for(const e of document.querySelectorAll('.texto')){const q=e.getBoundingClientRect();let opacity=1,n=e;while(n&&n!==document.body){const s=getComputedStyle(n);opacity*=+s.opacity;if(s.display==='none'||s.visibility==='hidden')opacity=0;n=n.parentElement;}
 const clip=e.closest('.clip'),t=f/24;if(clip&&(t<+clip.dataset.start-1e-5||t>=+clip.dataset.start + +clip.dataset.duration-1e-5))continue;
 if(opacity<.05||q.right<=0||q.left>=1080)continue;
 const cs=getComputedStyle(e);boxes.push({id:e.id,text:text(e),x:q.x,y:q.y,w:q.width,h:q.height,opacity,size:parseFloat(cs.fontSize),border:cs.borderLeftColor,clip:clip?.id,card:e.classList.contains('card')});}
 output.push({f,t:f/24,boxes});}
 return output;
 },plan.lienzo.cuadros);}
export function readings(rows){const map={};for(const r of rows)for(const b of r.boxes){if(b.opacity<.9||b.x< -b.w*.05||b.x+b.w>1080+b.w*.05)continue;const a=map[b.id]??={id:b.id,text:b.text,frames:[],min:need(b.text)};a.frames.push(r.f);}
 return Object.values(map).map(a=>{let max=0,start=0,run=0,prev=-2;for(const f of a.frames){run=f===prev+1?run+1:1;if(run>max){max=run;start=f-run+1}prev=f}return {...a,a:start/24,b:(start+max)/24,duration:max/24};});}
