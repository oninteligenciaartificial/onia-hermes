'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const base='E:/ONIA-YouTube/grabaciones/samuel';
const out=path.join(base,'ENTREGA-20260921');
const zip=path.join(base,'grabaciones-samuel-20260921.zip');
const sources=[
 ['higgsfield-00-herramientas.mp4','Higgsfield: recorrido general'],
 ['higgsfield-01-crear-soul.mp4','Avatar: requisitos de fotos para Soul'],
 ['higgsfield-02-avatar-prompt-limpio.mp4','Avatar: personaje y prompt'],
 ['n8n-01-mensaje-programado.mp4','n8n: mensaje programado'],
 ['n8n-02-monitor-y-alerta.mp4','n8n: monitor y alerta'],
 ['n8n-03-construccion-paso-a-paso.mp4','n8n: construcción paso a paso'],
 ['n8n-04-construccion-monitor.mp4','n8n: construcción del monitor'],
];
// Complete preflight before touching an existing delivery. Never silently shrink it.
for(const [name] of sources)if(!fs.statSync(path.join(base,name)).isFile())throw new Error('Falta el MP4 requerido: '+name);
const allowedNames=new Set([...sources.map(([name])=>name),'manifest.json','LEEME.txt','index.html']);
if(fs.existsSync(out))for(const name of fs.readdirSync(out))if(!allowedNames.has(name))throw new Error('Archivo inesperado en entrega; revisar antes de empaquetar: '+name);
const files=sources.map(([name,title])=>{
 const file=path.join(base,name);
 const meta=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate','-of','json',file],{encoding:'utf8',windowsHide:true}));
 const stream=meta.streams.find(x=>x.codec_type==='video');
 if(!stream||stream.codec_name!=='h264'||stream.width!==1440||stream.height!==900||stream.avg_frame_rate!=='30/1')throw new Error('Formato inesperado: '+name);
 execFileSync('ffmpeg',['-v','error','-i',file,'-f','null','-'],{windowsHide:true,timeout:60000});
 const buffer=fs.readFileSync(file);const sha256=crypto.createHash('sha256').update(buffer).digest('hex');
 return {name,title,duration:Number(meta.format.duration),bytes:buffer.length,sha256,width:stream.width,height:stream.height,fps:30};
});
fs.mkdirSync(out,{recursive:true});
for(const {name} of files)fs.copyFileSync(path.join(base,name),path.join(out,name));
const manifest={createdAt:new Date().toISOString(),kind:'screen-recordings',audio:false,files,limitations:['No se entrenó un Soul nuevo.','La primera generación se intentó dos veces y falló en el gateway de Higgsfield; no hay resultados nuevos confirmados. La segunda no se envió.','Workflows sin publicar y sin mensajes enviados. No se ha grabado recepción en teléfono.']};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'demos-samuel','entrega-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(out,'LEEME.txt'),`GRABACIONES PARA SAMUEL\n\n${files.map(f=>`${f.title}: ${f.name} (${f.duration.toFixed(1)} s)`).join('\n')}\n\nMP4 H.264, 1440 x 900, 30 fps, sin voz.\nTomas reales de las aplicaciones para montar con la narración.\n${manifest.limitations.join('\n')}\n`);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Grabaciones para Samuel</title><style>body{max-width:1000px;margin:40px auto;padding:0 24px;background:#171717;color:#eee;font:17px system-ui}h1{font-size:30px}h2{font-size:20px}section{margin:40px 0}video{width:100%;background:#000}p{color:#bbb;line-height:1.5}a{color:#d9f481}</style><h1>Grabaciones para Samuel</h1><p>${files.length} clips · 1440 × 900 · 30 fps · sin voz</p>${files.map(f=>`<section><h2>${esc(f.title)}</h2><video controls preload="metadata" src="${esc(f.name)}"></video><p>${f.duration.toFixed(1)} segundos · <a href="${esc(f.name)}" download>Descargar MP4</a></p></section>`).join('')}<p>Estas tomas muestran el proceso y la configuración. No presentan un avatar recién entrenado ni mensajes recibidos. Las imágenes nuevas siguen bloqueadas por el servicio de generación.</p></html>`);
// Compress only the manifest whitelist. Build a temporary ZIP, verify every byte,
// then replace the previous ZIP so a failed compression preserves that copy.
const temporaryZip=path.join(base,`_samuel-package-${crypto.randomUUID()}.zip`);
const zipCommand=String.raw`
$samuelDelivery = $env:SAMUEL_PACKAGE_DIR
$samuelZip = $env:SAMUEL_PACKAGE_ZIP
$samuelManifest = Get-Content -LiteralPath (Join-Path $samuelDelivery 'manifest.json') -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
$samuelNames = @($samuelManifest.files.name) + @('manifest.json','LEEME.txt','index.html')
$samuelPaths = @($samuelNames | ForEach-Object { Join-Path $samuelDelivery $_ })
Compress-Archive -LiteralPath $samuelPaths -DestinationPath $samuelZip -ErrorAction Stop
Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop
$samuelArchive = [System.IO.Compression.ZipFile]::OpenRead($samuelZip)
try {
 if ($samuelArchive.Entries.Count -ne $samuelNames.Count) { throw 'Cantidad inesperada de archivos en ZIP' }
 foreach ($samuelName in $samuelNames) {
  $samuelEntry = $samuelArchive.GetEntry($samuelName)
  if ($null -eq $samuelEntry) { throw ('Falta archivo en ZIP: ' + $samuelName) }
  $samuelStream = $samuelEntry.Open()
  $samuelHasher = [System.Security.Cryptography.SHA256]::Create()
  try { $samuelHash = [BitConverter]::ToString($samuelHasher.ComputeHash($samuelStream)).Replace('-','') }
  finally { $samuelStream.Dispose(); $samuelHasher.Dispose() }
  $samuelFileStream = [System.IO.File]::OpenRead((Join-Path $samuelDelivery $samuelName))
  $samuelFileHasher = [System.Security.Cryptography.SHA256]::Create()
  try { $samuelExpected = [BitConverter]::ToString($samuelFileHasher.ComputeHash($samuelFileStream)).Replace('-','') }
  finally { $samuelFileStream.Dispose(); $samuelFileHasher.Dispose() }
  if ($samuelHash -ne $samuelExpected) { throw ('Hash de ZIP incorrecto: ' + $samuelName) }
 }
} finally { $samuelArchive.Dispose() }
`;
try {
 execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',zipCommand],{windowsHide:true,timeout:120000,env:{...process.env,SAMUEL_PACKAGE_DIR:out,SAMUEL_PACKAGE_ZIP:temporaryZip}});
 fs.renameSync(temporaryZip,zip);
} catch(error) {
 // Only remove this run's explicitly named temporary file; never the old delivery.
 if(fs.existsSync(temporaryZip))fs.unlinkSync(temporaryZip);
 throw error;
}
console.log(JSON.stringify({folder:out,zip,count:files.length,totalSeconds:files.reduce((s,f)=>s+f.duration,0),files:files.map(f=>({name:f.name,seconds:f.duration}))}));
