// Selector local read-only. Nunca renderiza, genera, publica ni ejecuta comandos del manifest.
import {statSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const flags=new Map();
for(let i=2;i<process.argv.length;i+=2){const k=process.argv[i],v=process.argv[i+1];if(!['--repo','--state','--out'].includes(k)||!v||flags.has(k))throw new Error('Uso: node preflight.mjs [--repo ruta] [--state json] [--out json]');flags.set(k,v);}
const root=resolve(flags.get('--repo')??process.cwd());
const state=JSON.parse(readFileSync(flags.get('--state')??resolve(root,'hermes-content/references/modelos/lucia/v4/kit/estado-montaje.json'),'utf8').replace(/^\uFEFF/,''));
const file=(p)=>{const abs=resolve(root,p);try{const s=statSync(abs);return {path:abs,exists:s.isFile()&&s.size>0,bytes:s.size};}catch{return {path:abs,exists:false};}};
function probe(p){const r=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_type,width,height,r_frame_rate,nb_frames,duration','-of','json',p],{encoding:'utf8',timeout:10000});if(r.error||r.status!==0)return {ok:false,error:r.error?.code??'ffprobe_failed'};try{return {ok:true,...JSON.parse(r.stdout)};}catch{return {ok:false,error:'invalid_probe_json'};}}
const rows=state.pieces.map(p=>{
 const assets=p.assets.map(file), missing=assets.filter(a=>!a.exists).map(a=>({kind:'asset',path:a.path,owner:'carril_lucia',action:'Localizar el archivo ya pagado; no regenerar.'}));
 const captures=p.captures.map(id=>{const c=state.captures[id];const f=c.path?file(c.path):null;const ready=!!f?.exists&&c.approved===true&&typeof c.evidence==='string'&&c.evidence.trim().length>0;return {id,ready,path:f?.path??null,sourceApproved:c.approved===true,required:c.required};});
 const missingProduct=captures.filter(c=>!c.ready).map(c=>({kind:'capture',id:c.id,owner:'madre_y_producto',action:c.required}));
 const auth=state.operationalScope;const authorized=auth?.localReversible===true&&!!auth.evidence;
 const contract=p.contract;
 const candidate=p.preview?file(p.preview):null;let preview={exists:!!candidate?.exists,path:candidate?.path??null,valid:false};
 if(candidate?.exists){const metadata=probe(candidate.path);preview.metadata=metadata;const v=metadata.streams?.find(s=>s.codec_type==='video');const audio=metadata.streams?.some(s=>s.codec_type==='audio');preview.valid=metadata.ok&&!!v&&v.width===contract.previewWidth&&v.height===contract.previewHeight&&v.r_frame_rate===`${contract.fps}/1`&&Number(v.nb_frames)===p.duration*contract.fps&&Math.abs(Number(v.duration)-p.duration)<1/contract.fps&&!audio;}
 let cutlistValid=false;
 if(p.cutlist&&file(p.cutlist).exists){try{const c=JSON.parse(readFileSync(resolve(root,p.cutlist),'utf8'));let cursor=0;cutlistValid=c.fps===contract.fps&&c.frames===p.duration*contract.fps&&c.cards.length>0&&(!contract.cardCount||c.cards.length===contract.cardCount)&&c.cards.every(([s,e,lines])=>{const words=lines.join(' ').trim().split(/\s+/).length;const ok=s===cursor&&e>s&&words<=contract.maxWords&&e-s>=words*contract.secondsPerWord+contract.entrySeconds;cursor=e;return ok;})&&cursor===p.duration&&(!contract.privacyHold||c.privacyDraftReplaced===true);}catch{cutlistValid=false;}}
 const previewMissing=[...missing];
 if(!authorized)previewMissing.push({kind:'operational_scope',owner:'madre',action:'El alcance local actual no está documentado; este input no es un permiso por preview.'});
 if(!cutlistValid)previewMissing.push({kind:'cutlist',owner:'carril_lucia',action:'Preparar cutlist USTED legible y explícito sobre placeholders, sin claims comprobados.'});
 if(candidate?.exists&&!preview.valid)previewMissing.push({kind:'preview_metadata',owner:'carril_lucia',action:'Inspeccionar el preview existente: dimensiones, duración, fps o audio no cumplen.'});
 const ready=previewMissing.length===0;
 const previewSha256=preview.valid?createHash('sha256').update(readFileSync(preview.path)).digest('hex'):null;
 const reviewed=p.review?.status==='reviewed'&&!!p.review.evidence&&preview.valid&&p.review.sha256===previewSha256;
 return {piece:p.id,status:ready?'listo_para_preview':'bloqueado',scope:'borrador_local_no_publicar',assets,preview,cutlistValid,review:{status:reviewed?'reviewed':'pending',evidence:p.review?.evidence??null},authorization:{approved:authorized,evidence:auth?.evidence??null},missing_inputs:previewMissing,product_missing_inputs:missingProduct,master_status:'bloqueado',publish_authorized:false,identity_approved_by_this_check:false,next_action:reviewed?(missingProduct[0]??{owner:'madre',action:'Borrador revisado; conservar sin repetir revisión ni habilitar master.'}):ready&&preview.valid?{owner:'madre',action:'Revisar el preview existente y su contactsheet; no re-renderizar ni aprobar identidad por metadatos.',path:preview.path}:previewMissing[0]??{owner:'carril_lucia',action:'Preparar preview bajo alcance local vigente con comandos canónicos; este selector no lo ejecuta.'}};
});
const ready=rows.find(p=>p.status==='listo_para_preview'&&p.review.status!=='reviewed')??rows.find(p=>p.next_action.owner==='carril_lucia')??rows[0];
const report={schema_version:1,checked_at:new Date().toISOString(),source_state:resolve(flags.get('--state')??resolve(root,'hermes-content/references/modelos/lucia/v4/kit/estado-montaje.json')),read_only:true,new_credits_spent:0,commands_executed:['ffprobe sobre preview local existente'],generation_enabled:false,render_enabled:false,publish_enabled:false,network_used:false,approval_note:'Aprobaciones son entradas declaradas con evidencia; no se consultaron cuentas ni se infieren permisos desde archivos o gastos históricos.',pieces:rows,selected:ready?{piece:ready.piece,...ready.next_action}:{piece:rows[0]?.piece,...rows[0]?.next_action},warnings:['listo_para_preview solo aplica al borrador; no equivale a master, identidad o publicación aprobados.','Metadatos/cutlist no prueban presencia visual de watermark ni veracidad de claims; la madre revisa el preview y evidencia visual.','P1/P2 pendientes no se sustituyen con UI falsa.','Archivo existente no implica aprobación de captura.']};
const out=resolve(flags.get('--out')??resolve(tmpdir(),'lucia-preflight-result.json'));writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:out,states:rows.map(r=>({piece:r.piece,status:r.status,missing:r.missing_inputs.length,product_missing:r.product_missing_inputs.length})),selected:report.selected},null,2));
