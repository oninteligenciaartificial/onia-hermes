import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright';
const ROOT='C:/dev/proyectos/onia-hermes/.claude/worktrees/hero-mecanica/hermes-content/references/ui-patterns/hero-onia/mecanica';
const srv=http.createServer((q,s)=>{const p=path.join(ROOT,'index.html');fs.readFile(p,(e,d)=>{s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d);});});
await new Promise(r=>srv.listen(4322,r));
const b=await chromium.launch();
for(const w of [320,360,375,412,768,1000,1280,1440,1920]){
  const c=await b.newContext({viewport:{width:w,height:800}}); const p=await c.newPage();
  await p.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
  const o=await p.evaluate(()=>{const bad=[];document.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>window.innerWidth+0.6||r.left<-0.6))bad.push(e.className||e.tagName,Math.round(r.left)+'..'+Math.round(r.right));});return bad;});
  console.log(w, JSON.stringify(o));
  await c.close();
}
await b.close(); srv.close();
