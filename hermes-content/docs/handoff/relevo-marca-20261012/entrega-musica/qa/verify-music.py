import pathlib,json,hashlib,subprocess,re,numpy as np,math
b=pathlib.Path('/workspace/work/onia-marca-musica-20261012');q=b/'qa';m=json.loads((b/'manifest.json').read_text());rows=[]
def run(a):return subprocess.run(a,capture_output=True)
def probe(p,packets=False):
 a=['ffprobe','-v','error','-of','json']
 if packets:a+=['-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,dts_time,duration_time,size,flags']
 else:a+=['-show_streams','-show_format']
 return json.loads(subprocess.check_output(a+[str(p)]))
def vhash(p):return subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','-'],text=True).strip()
def metric(p,name):
 r=run(['ffmpeg','-hide_banner','-nostats','-i',str(p),'-vn','-af','ebur128=peak=true','-f','null','-']);t=r.stderr.decode();(q/(name+'-ebur128.log')).write_text(t);s=t.split('Summary:')[-1];d={'exit':r.returncode}
 for k,pat in [('lufs',r'I:\s+([\d.-]+)\s+LUFS'),('lra',r'LRA:\s+([\d.-]+)\s+LU'),('true_peak',r'Peak:\s+([\d.-]+)\s+dBFS')]:
  x=re.search(pat,s);d[k]=float(x.group(1)) if x else None
 return d
def pcm(p):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:a:0','-ac','1','-ar','16000','-f','f32le','-']),dtype='<f4').astype(np.float64)
for f in m['videos']:
 code=f['piece'];src=pathlib.Path(f['source']);mixed=pathlib.Path(f['mixed_preview']);clean=pathlib.Path(f['clean_preview']);bed=pathlib.Path(f['music_only_ducked']);s0=probe(src);s1=probe(mixed);p0=probe(src,True);p1=probe(mixed,True);h0=vhash(src);h1=vhash(mixed)
 r=run(['ffmpeg','-hide_banner','-v','error','-xerror','-i',str(mixed),'-map','0','-f','null','-']);(q/(code+'-decode.log')).write_bytes(r.stderr);metrics={k:metric(p,code+'-'+k) for k,p in [('voice',src),('mixed',mixed),('bed',bed)]}
 x=pcm(src);y=pcm(mixed);z=pcm(bed);n=min(len(x),len(y),len(z));x=x[:n];y=y[:n];z=z[:n];A=np.array([[np.dot(x,x),np.dot(x,z)],[np.dot(x,z),np.dot(z,z)]]);rhs=np.array([np.dot(x,y),np.dot(z,y)]);g=np.linalg.solve(A,rhs);voice_est=y-g[1]*z;resid=y-g[0]*x-g[1]*z;corr=float(np.corrcoef(x,voice_est)[0,1]);lag_checks=[]
 for t in [5,min(20,n/16000-2),max(0,n/16000-5)]:
  start=int(t*16000);xa=x[start:start+16000]; vals=[]
  for lag in range(-32,33):
   ys=start+lag
   if ys<0 or ys+len(xa)>n:continue
   ya=voice_est[ys:ys+len(xa)];vals.append((float(np.corrcoef(xa,ya)[0,1]),lag))
  best=max(vals);lag_checks.append({'time':t,'window_s':1,'best_lag_samples_at16000':best[1],'max_correlation':best[0],'zero_lag_correlation':next(v[0] for v in vals if v[1]==0)})
 credit=pathlib.Path(f['attribution_file']).read_text().strip();tags=s1['format'].get('tags',{});v0=next(s for s in s0['streams'] if s['codec_type']=='video');v1=next(s for s in s1['streams'] if s['codec_type']=='video')
 row={'piece':code,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'source_hash_matches_manifest':hashlib.sha256(src.read_bytes()).hexdigest()==f['source_sha256'],'clean_equals_source':clean.read_bytes()==src.read_bytes(),'mixed_sha256':hashlib.sha256(mixed.read_bytes()).hexdigest(),'mixed_hash_matches_manifest':hashlib.sha256(mixed.read_bytes()).hexdigest()==f['mixed_sha256'],'decode_exit':r.returncode,'decode_stderr_bytes':len(r.stderr),'video_packet_sha_source':h0,'video_packet_sha_mixed':h1,'video_payload_exact':h0==h1,'video_packet_timing_exact':p0==p1,'video_packet_count':len(p1['packets']),'source_video_frames':v0.get('nb_frames'),'mixed_video_frames':v1.get('nb_frames'),'frame_count_equal':v0.get('nb_frames')==v1.get('nb_frames'),'source_duration':s0['format']['duration'],'mixed_duration':s1['format']['duration'],'duration_equal':s0['format']['duration']==s1['format']['duration'],'metrics':metrics,'bed_below_voice_lu':metrics['voice']['lufs']-metrics['bed']['lufs'],'voice_preservation_numeric':{'decoded_samples_common_mono16000':n,'voice_gain_fit':float(g[0]),'bed_gain_fit':float(g[1]),'estimated_voice_correlation':corr,'fit_residual_rms_relative_voice_db':float(20*np.log10(np.sqrt(np.mean(resid**2))/np.sqrt(np.mean(x**2)))),'lag_checks':lag_checks,'method':'Least squares mix=voice*g0+decoded ducked bed*g1; AAC/limiter residual expected, not phonetic QA'},'credit_file_matches_license':credit==m['music_license']['attribution'],'metadata_credit_matches':tags.get('comment')==credit,'audio_listened':False}
 row['technical_pass']=all(row[k] for k in ['source_hash_matches_manifest','clean_equals_source','mixed_hash_matches_manifest','video_payload_exact','video_packet_timing_exact','frame_count_equal','duration_equal','credit_file_matches_license','metadata_credit_matches']) and r.returncode==0 and not r.stderr and metrics['mixed']['true_peak']<=-1 and row['bed_below_voice_lu']>=15 and all(l['best_lag_samples_at16000']==0 for l in lag_checks);rows.append(row);(q/'music-independent.json').write_text(json.dumps({'reviewer':'/root/qa_sol','rows':rows,'listened':False},indent=2));print(code,row['technical_pass'],metrics['mixed'],row['bed_below_voice_lu'],corr,[x['best_lag_samples_at16000'] for x in lag_checks],flush=True)
