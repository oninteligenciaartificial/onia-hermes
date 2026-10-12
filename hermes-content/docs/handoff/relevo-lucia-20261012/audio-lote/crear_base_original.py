"""Instrumental original del lote: síntesis matemática, sin muestras de terceros ni servicios pagos."""
from array import array
from pathlib import Path
import math, wave, json, hashlib
rate=48000; duration=36; bpm=104; beat=60/bpm; bar=beat*4
chords=[(45,57,60,64),(41,53,57,60),(48,55,60,64),(43,55,59,62)]
def hz(m):return 440*2**((m-69)/12)
notes=[[hz(m) for m in chord] for chord in chords]
buf=array('h')
for i in range(int(rate*duration)):
 t=i/rate;c=notes[int(t/bar)%4]; phase=t%bar
 attack=min(1,phase/.18); release=min(1,(bar-phase)/.18); env=attack*release
 pad=env*sum(math.sin(2*math.pi*f*t)+.15*math.sin(2*math.pi*2*f*t) for f in c[1:])*.042
 b=t%beat;bass=math.sin(2*math.pi*c[0]*t)*math.exp(-b*5.2)*.085
 k=t%(beat*2);kick=math.sin(2*math.pi*(48+35*math.exp(-k*18))*k)*math.exp(-k*24)*.085
 pl=t%(beat/2);note=c[1+(int(t/(beat/2))%3)];pluck=math.sin(2*math.pi*note*2*pl)*math.exp(-pl*23)*.015
 fade=min(1,t/.5,(duration-t)/.9);v=max(-.85,min(.85,(pad+bass+kick+pluck)*fade))
 n=int(v*32767);buf.extend([n,n])
p=Path('/workspace/work/lucia-audio/recursos/base-instrumental-original.wav')
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes(buf.tobytes())
r={'date':'2026-10-12','asset':p.name,'duration_s':duration,'sample_rate':rate,'channels':2,'bpm':bpm,'source':'síntesis matemática original de este script para audio de montajes existentes, autorizada por el contrato de Sergio;sin muestras musicales ajenas','third_party_samples':False,'paid_platform_calls':0,'cost':0,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'rights':'Material original por encargo para ONIA;sin licencia externa ni derechos ajenos muestreados. Uso solicitado en los videos existentes. No se atribuye una licencia Pixabay/Freesound a esta base.'}
Path('/workspace/work/lucia-audio/procedencia-base-original.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(p)
