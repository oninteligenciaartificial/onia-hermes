'use strict';
const cap=require('./screencast-session.cjs');
const {createRequire}=require('node:module');
const runtime=createRequire(process.env.SAMUEL_RUNTIME_PACKAGE || 'C:/dev/proyectos/onia-hermes/package.json');
cap.configure({chromium:runtime('playwright').chromium});
const outputDir='E:/ONIA-YouTube/grabaciones/samuel';
const demos={
 mensaje:{id:'rDdlijedMLN22fhC',name:'n8n-01-mensaje-programado',nodes:['Cada dia a las 09:00','Enviar recordatorio']},
 monitor:{id:'dlWHWx34RWImpo1N',name:'n8n-02-monitor-y-alerta',nodes:['Revisar cada 5 minutos','Revisar mi web','La web tiene un problema','Avisarme por Telegram']}
};
(async()=>{
 const demo=demos[process.argv[2]||'mensaje']; if(!demo)throw new Error('Usa mensaje o monitor');
 const s=await cap.launch('n8n',{record:true,outputDir});const started=Date.now();const p=s.page;
 try{
  await s.run(()=>p.goto(`https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/${demo.id}`,{waitUntil:'domcontentloaded'}));
  await s.run(()=>p.locator(`[data-test-id="canvas-node"][data-node-name="${demo.nodes[0]}"]`).waitFor({state:'visible',timeout:30000}));
  await s.moveClick(p.getByRole('button',{name:'Zoom to Fit',exact:true})); await s.pause(1300);
  const offset=(Date.now()-started)/1000;
  await s.pause(3200);
  for(const name of demo.nodes){
   const target=p.locator(`[data-test-id="canvas-node"][data-node-name="${name}"]`);
   await s.run(async()=>{const b=await target.boundingBox();if(!b)throw new Error('Nodo no visible');await s.move(b.x+40,b.y+40,{duration:900});await target.dblclick({position:{x:40,y:40}});});
   await s.run(()=>p.locator('[data-test-id="ndv-close-button"]').waitFor({state:'visible'}));
   await s.pause(5200);
   await s.run(()=>p.screenshot({path:`${outputDir}/${demo.name}-${demo.nodes.indexOf(name)+1}-control.png`}));
   await s.moveClick(p.locator('[data-test-id="ndv-close-button"]'),{settle:1100});
  }
  await s.moveClick(p.getByRole('button',{name:'Zoom to Fit',exact:true}));await s.pause(3600);
  await s.run(()=>p.screenshot({path:`${outputDir}/${demo.name}-control.png`}));
  console.log(JSON.stringify(await s.finish(demo.name,{trimStart:Math.max(0,offset-1)})));
 }catch(e){await s.abort(e.message);console.error(e.message);process.exitCode=1;}
})();
