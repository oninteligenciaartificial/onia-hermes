"""Añade instrumental propio/SFX a masters existentes, conserva el video por stream-copy."""
import pathlib,json,subprocess,hashlib
P=pathlib.Path('/workspace/work/lucia-audio')
plan=json.loads((P/'plan-lote.json').read_text())
names={'viernes-v2':'viernes','g2-v2':'G2','g3-v2':'G3','g4-v2':'G4','g5-v2':'G5','p9':'P9'}
result=[]
for item in plan['assets']:
 ident=item['id'];short=names[ident];src=P/'masters-fuente'/f'{short}.mp4'
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(src)]))
 v=next(x for x in probe['streams'] if x['codec_type']=='video');duration=float(v['duration'])
 cuts=[x for x in plan['sfx_sync_points'] if x['asset_id']==ident and x['kind']=='transition_cut' and isinstance(x['time'],(float,int))]
 # Tres apoyos como máximo, en cambios reales, sin whoosh en cada palabra.
 selected=cuts if len(cuts)<=3 else [cuts[0],cuts[-2],cuts[-1]]
 cues=[{'asset':'whoosh.wav','t':round(x['time'],6),'gain':.14,'reason':x['description']} for x in selected]
 if ident=='viernes-v2':cues.append({'asset':'ping.wav','t':1/3,'gain':.10,'reason':'entrada del primer dato según plan'})
 cmd=['ffmpeg','-v','error','-i',str(src),'-i',str(P/'recursos/base-original-normalizada.wav')]
 filters=[f'[1:a]atrim=duration={duration},afade=t=in:d=0.18,afade=t=out:st={duration-.65}:d=0.65,volume=0.82[bed]']
 labels=['[bed]']
 for n,c in enumerate(cues,2):
  cmd+=['-i',str(P/'recursos'/c['asset'])]
  ms=round(c['t']*1000);lab=f'fx{n}'
  filters.append(f'[{n}:a]volume={c["gain"]},adelay={ms}|{ms}[{lab}]');labels.append(f'[{lab}]')
 filters.append(''.join(labels)+f'amix=inputs={len(labels)}:duration=first:normalize=0,loudnorm=I=-18:TP=-1.5:LRA=7,aresample=48000[mix]')
 dst=P/'masters-musica'/f'{short}-musica-sfx-SIN-VOZ.mp4'
 cmd+=['-filter_complex',';'.join(filters),'-map','0:v:0','-map','[mix]','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(duration),'-movflags','+faststart','-y',str(dst)]
 subprocess.run(cmd,check=True)
 preview=P/'previews'/f'{short}-preview-audiovisual-360p-SIN-VOZ.mp4'
 subprocess.run(['ffmpeg','-v','error','-i',str(dst),'-vf','scale=360:640','-c:v','libx264','-preset','fast','-crf','25','-c:a','aac','-b:a','128k','-movflags','+faststart','-y',str(preview)],check=True)
 measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(dst),'-vn','-af','loudnorm=I=-18:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 (P/f'{short}-audio-medicion.txt').write_text(measure.stderr)
 result.append({'id':ident,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'master_file':dst.name,'master_sha256':hashlib.sha256(dst.read_bytes()).hexdigest(),'master_bytes':dst.stat().st_size,'preview_file':preview.name,'preview_sha256':hashlib.sha256(preview.read_bytes()).hexdigest(),'duration_video_s':duration,'music':'baseoriginalprocedural36s','SFX':cues,'video_codec_mode':'copy;no re-render de composición/cortes','voice':'SIN NARRACIÓN;no sustituir por música','cost':0,'audio_measurement_file':f'{short}-audio-medicion.txt','user_authorization':'montajeaudio/rendersderivados12oct;sin publicar'})
 (P/'lote-resultados.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(short,dst.stat().st_size,preview.stat().st_size,flush=True)
