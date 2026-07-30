# Efectos de sonido — editor-videos

Los usa `scripts/sfx.mjs`. Todo local, costo cero. Ningún efecto se genera con plataforma paga.

## Qué hay acá (3 placeholders sintetizados)

`whoosh.wav` · `pop.wav` · `ping.wav`

**No son sonidos de librería: los sintetizó ffmpeg** (ruido rosa con flanger + envolvente para el
whoosh; senoidales con decaimiento exponencial para pop y ping). Están para que el pipeline
funcione de punta a punta sin depender de una descarga, y para poder probar el ducking. Sirven,
pero un whoosh real de librería suena mejor. **Reemplazables**: `sfx.mjs` acepta cualquier archivo
de audio que le pases.

Se regeneran exactamente igual (son deterministas) con:

```bash
ffmpeg -y -f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.6:r=48000" \
  -af "flanger=delay=10:depth=8:speed=0.9,highpass=f=250,lowpass=f=7000,afade=t=in:d=0.18:curve=qsin,afade=t=out:st=0.28:d=0.32:curve=qsin" \
  -ac 2 -c:a pcm_s16le whoosh.wav

ffmpeg -y -f lavfi -i "aevalsrc=0.7*exp(-26*t)*sin(2*PI*(950-620*t)*t):d=0.2:s=48000" \
  -ac 2 -c:a pcm_s16le pop.wav

ffmpeg -y -f lavfi -i "aevalsrc=0.55*exp(-5.5*t)*(sin(2*PI*1180*t)+0.35*sin(2*PI*2360*t)):d=1.0:s=48000" \
  -ac 2 -c:a pcm_s16le ping.wav
```

## La librería buena: HyperFrames (21 cues)

Vive en `.agents/skills/media-use/audio/assets/sfx/` y es la librería **por defecto** de `sfx.mjs`
(`--lib`). En este repo está el **`manifest.json` con los 21 cues** (nombre, duración exacta y para
qué sirve cada uno) pero **los `.mp3` NO están versionados** — se vendoreó la skill sin los binarios.

Ver qué hay y qué falta:

```bash
node ../../scripts/sfx.mjs --list-lib
```

Cues del manifest: `chime` · `click` · `click-soft` · `error` · `glitch-1/2/3` ·
`impact-bass-1/2` · `key-press` · `notification` · `ping` · `pop` · `riser` · `sparkle` ·
`typing` · `whoosh` · `whoosh-short` · `whoosh-cinematic`.

Los que más se usan en un talking-head vertical: **whoosh-short** (en cada corte),
**pop** (entra un apoyo visual), **ping** (dato duro), **impact-bass-1** (remate del hook),
**riser** (los ~10s antes del CTA).

### De dónde bajarlos (fuentes libres, gratis)

- **Pixabay Sound Effects** — https://pixabay.com/sound-effects/ — es la fuente original de la
  librería de HyperFrames (ver su `CREDITS.md`). Licencia Pixabay: uso comercial permitido, sin
  atribución obligatoria. **Es la fuente recomendada**: buscar por el nombre del cue y guardar
  como `<cue>.mp3` en el directorio de la librería, respetando el nombre del `manifest.json`.
- **Freesound** — https://freesound.org/ — filtrar por **CC0** si se quiere evitar atribución.
  Ojo: mucho material es CC-BY y obliga a acreditar.

**No bajar de sitios random.** Si una fuente no dice claramente su licencia, no se usa.

## Cómo se usan

`sfx.mjs` resuelve el `asset` del plan en este orden: (1) ruta tal cual, (2) nombre de cue del
`manifest.json` de `--lib`, (3) archivo suelto dentro de `--lib`.

```json
{
  "sfx": [
    { "asset": "whoosh", "at": 3.2, "gain": -8, "duck": true },
    { "asset": ".claude/skills/editor-videos/assets/sfx/pop.wav", "at": 7.05, "gain": -12 }
  ]
}
```

Si un cue está en el manifest pero el `.mp3` no está en disco, el script **falla con el nombre del
archivo que falta** en vez de mezclar en silencio.

## Niveles

Los defaults están pensados para que el efecto quede **debajo** de la voz: `--gain -10 dB` y
ducking de `-5 dB` con rampas de 120/250 ms. Nunca subir un SFX por encima de +6 dB (el script lo
rechaza) — si hace falta eso, el problema es que la voz está baja.
