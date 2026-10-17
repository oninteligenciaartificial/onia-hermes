// QA adaptado de G5: Chromium local, cuadro por cuadro, sin render ni red.
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';
import vm from 'node:vm';
export const P=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const plan=JSON.parse(fs.readFileSync(path.join(P,'plan.json'),'utf8'));
export const words=s=>s.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
export const need=s=>s===plan.textos.cta?Math.max(2.4,words(s)*.35+.3):words(s)*.35+.3;
export function save(n,s){fs.writeFileSync(path.join(P,'qa',n),typeof s==='string'?s:JSON.stringify(s,null,2));}
export function check(ok,msg){if(!ok)throw Error(msg);}
export function staticSamples(){
 // Ejecuta EL timeline entregado con GSAP real sobre objetos numéricos.
 // No mide tipografía ni sustituye medir-dom: solo geometría horizontal, opacidad y eventos.
 const exports={};vm.runInNewContext(fs.readFileSync(path.join(P,'assets-fijos/vendor/gsap.min.js'),'utf8'),{exports,module:{exports},setTimeout,clearTimeout,Date,console});const gsap=exports.gsap;
 const states={},target=id=>states[id]??={x:0,y:0,opacity:1,borderLeftColor:'#83d5be',backgroundColor:'#11191b'};
 const original=gsap.timeline({paused:true}),resolve=s=>typeof s==='string'?s.split(',').map(id=>target(id.trim().replace(/^#/,''))):s;
 const facade={};for(const method of ['set','to','fromTo'])facade[method]=(...args)=>{args[0]=resolve(args[0]);original[method](...args);return facade};
 const window={__timelines:{}};vm.runInNewContext(fs.readFileSync(path.join(P,'scripts/timeline.js'),'utf8'),{gsap:{timeline:()=>facade},PLAN:plan,window});
 const html=fs.readFileSync(path.join(P,'index.html'),'utf8');
 const plain=s=>s.replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replace(/\s+/g,' ').trim();
 const defs=[];for(const m of html.matchAll(/<div id="([^"]+)" class="texto ([^"]*)" style="top:(\d+)px;font-size:(\d+)px">([\s\S]*?)<\/div>/g)){
  const id=m[1],clip=['rotulo','titulo','dato-m1'].includes(id)?'overlay-m1':['dato-m4','reencuadre','aviso-refs'].includes(id)?'overlay-m4':'placa';
  defs.push({id,text:plain(m[5]),y:+m[3],size:+m[4],card:m[2].includes('card'),clip});
 }
 for(const c of plan.clips){const m=html.match(new RegExp(`<div class="fila texto card" id="fila-${c.id}">([\\s\\S]*?)</div></div>`));check(m,'Fila ausente '+c.id);defs.push({id:'fila-'+c.id,text:plain(m[1]),y:300,size:40,card:true,clip:'placa'});}
 const windows={};for(const m of html.matchAll(/<(?:div|video) id="([^"]+)"[^>]*data-start="([\d.]+)"[^>]*data-duration="([\d.]+)"/g))windows[m[1]]={a:+m[2],b:+m[2]+ +m[3]};
 const active=(id,t)=>{const w=windows[id];check(w,'Ventana HTML ausente '+id);return t>=w.a-1e-6&&t<w.b-1e-6};
 const rows=[];for(let f=0;f<480;f++){original.time(f/24,false);const boxes=defs.filter(d=>active(d.clip,f/24)).map(d=>{const st=target(d.id),parent=target(d.clip);return {...d,x:80+parent.x+(st.x||0),w:920,h:0,opacity:st.opacity,border:st.borderLeftColor};}).filter(b=>b.opacity>=.05&&b.x<1080&&b.x+b.w>0);rows.push({f,t:f/24,boxes});}
 const frame=t=>{original.time(t,false);return Object.fromEntries(Object.entries(states).map(([id,s])=>[id,{x:s.x,opacity:s.opacity,borderLeftColor:s.borderLeftColor}]))};
 original.pause();gsap.ticker.sleep();return {rows,frame};
}
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
export async function samples(page){return page.evaluate(()=>{
 const output=[];const timeline=window.__timelines.main;
 const text=e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let v=[],n;while(n=walker.nextNode())v.push(n.textContent);return v.join(' ').replace(/\s+/g,' ').trim()};
 for(let f=0;f<480;f++){timeline.time(f/24,false);let boxes=[];
 for(const e of document.querySelectorAll('.texto')){const q=e.getBoundingClientRect();let opacity=1,n=e;while(n&&n!==document.body){const s=getComputedStyle(n);opacity*=+s.opacity;if(s.display==='none'||s.visibility==='hidden')opacity=0;n=n.parentElement;}
 const clip=e.closest('.clip'),t=f/24;if(clip&&(t<+clip.dataset.start-1e-5||t>=+clip.dataset.start + +clip.dataset.duration-1e-5))continue;
 if(opacity<.05||q.right<=0||q.left>=1080)continue;
 const cs=getComputedStyle(e);boxes.push({id:e.id,text:text(e),x:q.x,y:q.y,w:q.width,h:q.height,opacity,size:parseFloat(cs.fontSize),border:cs.borderLeftColor,clip:clip?.id,card:e.classList.contains('card')});}
 output.push({f,t:f/24,boxes});}
 return output;
 });}
export function readings(rows){const map={};for(const r of rows)for(const b of r.boxes){if(b.opacity<.9||b.x< -b.w*.05||b.x+b.w>1080+b.w*.05)continue;const a=map[b.id]??={id:b.id,text:b.text,frames:[],min:need(b.text)};a.frames.push(r.f);}
 return Object.values(map).map(a=>{let max=0,start=0,run=0,prev=-2;for(const f of a.frames){run=f===prev+1?run+1:1;if(run>max){max=run;start=f-run+1}prev=f}return {...a,a:start/24,b:(start+max)/24,duration:max/24};});}
