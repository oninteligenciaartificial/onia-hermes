# Subtítulos ONIA — `embedded-captions` (HyperFrames) vs `karaoke-captions.mjs` (propio)

**Fecha:** 2026-07-26 · **Carril:** editor-videos · **Rama:** `claude/onia-colaboradores-sin-inversion-d69b19`
**Método:** los DOS caminos corridos de verdad sobre EL MISMO video, con LOS MISMOS timestamps de palabra.
No es lectura de README: hay renders y cuadros.

---

## 0. Veredicto

> **Se queda el script propio (`karaoke-captions.mjs`).** `embedded-captions` no reemplaza al karaoke:
> el highlight por palabra activa —la razón de existir del script— **no existe en ningún compilador vivo
> de la skill** (quedó solo como prosa en el modo Standard RETIRADO). Además cuesta ~210× más tiempo
> por pieza y sus temas están tuneados para 16:9, no para el vertical de ONIA.

`embedded-captions` **sí** se adopta para lo que el propio NO hace: el **hero incrustado detrás del
sujeto** (matting) en piezas donde la toma deja aire. En este clip no lo dejaba (ver §3.4).

**Esto NO es un caso de "reinventamos el motor".** El motor que reinventaríamos (karaoke word-level)
no está implementado del otro lado. Ver §5.

---

## 1. El banco de pruebas (reproducible)

| Ítem | Valor |
|---|---|
| Clip | `hermes-content/references/ai-ecommerce-model/video-ads/bedroom-storytime-kling/20260606-mara-bedroom-storytime-kling3-pro-audio-raw.mp4` |
| Formato | 1216×1700 vertical, 24 fps, 15.04 s, audio AAC, español, un solo sujeto, sin subs quemados |
| Timestamps | UNO SOLO para los dos caminos: WhisperX `small` + wav2vec2 (38 palabras), generado por la propia skill |
| Costo | $0 · todo local · cero VPS, cero plataformas pagas |
| Carpeta de trabajo | `…/scratchpad/captions-bench/` (`hf-proj/` = HyperFrames · `onia/` = propio) |

El clip *final* de esa misma pieza fue **descartado** como sujeto de prueba: ya trae subtítulos quemados,
y el decision gate de `embedded-captions` obliga a rechazar eso (regla correcta, y la respetamos).

### Identidad elegida y por qué

Del CATALOG (35 identidades) la única comparable al karaoke propio es **`anchor`**
(*"verbatim lower-third rail… donde cada palabra debe leerse; el default conservador"*).
Las 10 column-flow son mood-over-verbatim y el propio catálogo desaconseja usarlas para explainer/voz.

---

## 2. Cuadros renderizados — ambos caminos, mismo clip

Todos en `hermes-content/docs/assets/captions-bench-20260726/`:

| Archivo | Qué muestra |
|---|---|
| `01-side-by-side.jpg` | **La comparación principal.** 4 momentos (2.5 / 6.5 / 11.6 / 13.5 s), izquierda HyperFrames `anchor`, derecha karaoke ONIA |
| `02-sync-onia.jpg` | Tira de sincronía del propio: 5.62 / 5.85 / 6.10 / 6.30 / 6.55 s |
| `03-sync-hyperframes.jpg` | La MISMA tira en HyperFrames |
| `04-hyperframes-rail-clipped.jpg` | Render final HF a resolución completa: el rail sale del cuadro ("**e**stoy" cortada) |
| `05-hyperframes-hero-oculto.jpg` | El clímax "NADA." tapado ~95% por la cabeza |
| `06-onia-karaoke.jpg` | El mismo instante con el karaoke propio |

Videos completos (scratchpad, no versionados por peso):
- HyperFrames: `…/captions-bench/hf-proj/final_fx.mp4` (96 MB) y `final.mp4` (42 MB, pre-plate)
- Propio: `…/captions-bench/onia/final.mp4` (9.6 MB) + `final.ass`

---

## 3. Las tres verificaciones

### 3.1 ¿Anda en Windows punta a punta? — **SÍ, pero no de fábrica**

Llegó a `final_fx.mp4` con las gates en verde. Lo que hubo que resolver primero:

| Problema real | Evidencia | Arreglo aplicado |
|---|---|---|
| Los scripts buscan un **checkout compilado** (`<root>/packages/cli/dist/cli.js`); el paquete npm `hyperframes@0.7.72` no tiene ese layout | `matte.cjs` → `exit 3` | junction `hfroot/packages/cli` → el paquete npm, y `HYPERFRAMES_ROOT` a esa carpeta |
| `sharp` y `puppeteer` se resuelven desde `HYPERFRAMES_ROOT/node_modules` (asumen `bun install` en el checkout) | `[safe-zones] sharp unavailable` | `npm i sharp puppeteer` dentro de `hfroot` (57 MB) |
| **`HYPERFRAMES_ROOT` con path POSIX de Git Bash rompe** (node lo lee como `C:\tmp\…`) | `MODULE_NOT_FOUND` | pasar el path estilo Windows |
| `hyperframes transcribe` (whisper.cpp) **no corre acá** — confirmado, no deducido | `{"ok":false,"skipped":true,"reason":"whisper_unavailable"}` | no hace falta: `transcribe.cjs` prefiere **WhisperX vía `uvx`**, que **sí funcionó** (38 palabras). uv se bajó ~2.1 GB de deps |

**Falso verde detectado (bug, reportable aguas arriba):** sin `sharp`, `safe-zones.cjs` hace
`process.exit(0)` y `prepare.sh` igual imprime `✅ ready: … safe-zones.json` **sin haber escrito
`safe-zones.json`**. El pipeline sigue creyendo que tiene conciencia de escena y no la tiene.
(`scripts/safe-zones.cjs:560-562`, `scripts/prepare.sh:37-39`.)

**Corrección a una creencia nuestra:** la memoria [[onia-video-hyperframes]] dice que la transcripción
local de HyperFrames no corre en Windows. Es cierto para `hyperframes transcribe` (whisper.cpp) — pero
**`embedded-captions` no depende de eso**: trae su propio camino WhisperX/uvx que sí corre. El bloqueo
que asumíamos no aplica a esta skill.

#### Costo por pieza (15 s de video, medido)

| | HyperFrames `embedded-captions` | ONIA `karaoke-captions.mjs` |
|---|---|---|
| Matting (`remove-background`, CPU) | **338.5 s** | — |
| Transcripción | ~300 s (WhisperX, en paralelo con el matte) | reusa `segments.json` de Speaches |
| safe-zones + compile + preview + render + postfx | ~250 s | — |
| **Total de pared** | **~12 min** | **3.4 s** |
| Disco intermedio | **1.27 GB** de PNG (`frames_fg` 706 MB + `frames_bg` 566 MB) | 0 |
| Entregable | 96 MB (CRF 11 + push-in + grain) | 9.6 MB |
| Instalación previa | junction + `sharp`/`puppeteer` + 2.1 GB de uv | ninguna |

**~210× más lento y 10× más pesado** para la misma pieza. Para producción continua (carril H, canales
YT, reels) eso no es un detalle: es el presupuesto de la sesión.

### 3.2 ¿El resaltado por palabra queda bien sincronizado? — **La sincronía sí; el resaltado NO EXISTE**

Mismos timestamps, mismos 5 instantes (`02-sync-onia.jpg` vs `03-sync-hyperframes.jpg`):

| t | Palabra hablada | ONIA propio | HyperFrames `anchor` |
|---|---|---|---|
| 5.62 | ESTOY (5.572–5.752) | frase completa, **ESTOY en amarillo** | solo aparece "stoy" |
| 5.85 | INTENTANDO (5.772–6.173) | **INTENTANDO en amarillo** | "stoy intentando" |
| 6.10 | INTENTANDO | **INTENTANDO en amarillo** | "stoy intentando" |
| 6.30 | GUSTARLE (6.253–6.653) | **GUSTARLE en amarillo** | "…gustarle" en color acento |
| 6.55 | GUSTARLE | **GUSTARLE en amarillo** | igual |

Lectura honesta: **el timing de HyperFrames es correcto** (las palabras entran cuando se dicen; el
compilador exige ≤80 ms contra el transcript). Lo que no hay es el **mecanismo**: `anchor` revela las
palabras de a una (tipeo progresivo) y colorea solo las que declarás a mano en `minors` — el color se
queda fijo toda la línea. No hay cursor que avance palabra por palabra.

Verificado en el código, no supuesto:
- `grep -c karaoke` sobre los **tres** compiladores vivos (`make-theme.cjs`, `make-cinematic.cjs`,
  `make-composition.cjs`) → **0, 0, 0**.
- El mecanismo karaoke solo sobrevive como prosa en `modes/standard/_motion.md:66`
  (*"karaoke (creator) … the signature verbatim mechanic"*), del modo **Standard RETIRADO el 2026-06-12**
  (`themes/README.md:20`); su librería de 54 templates fue sacada de la skill.
- `references/rail.md:50` lo menciona como *opcional* para palabras `emphasis`. Ningún tema lo implementa.

**O sea: migrar el karaoke a `embedded-captions` significaría implementarlo nosotros dentro de
`make-theme.cjs` (459 KB) — o sea, escribir el motor que hoy ya tenemos, en un archivo que no es nuestro
y que se autoactualiza.** Eso es lo contrario de "orquestar, no reinventar".

### 3.3 ¿Consume el `segments.json` de Speaches sin re-transcribir? — **SÍ, por dos caminos; uno sirve**

Contrato Speaches (`ver-videos/scripts/transcribe.sh`):
`{ok, source, duration, n_words, segments:[{start,end,text}], words:[{start,end,word}]}`
Contrato HyperFrames: `{text, language_code, engine, words:[{text,start,end,type}]}`

**Camino A — rename de campos (EL BUENO). Probado:**
```
words = speaches.words.map(w => ({ text: w.word, start: w.start, end: w.end, type: "word" }))
→ <project>/transcript.json {text, language_code:"es", engine:"speaches(...)", words}
→ node scripts/transcribe.cjs <project>
   [transcribe] already normalized, skipping        ← real 0m0.399s, cero ASR
```

**Camino B — import nativo del CLI. Probado, y es una trampa:**
```
npx hyperframes transcribe onia/segments.json -d <dir> --json
→ {"ok":true,"format":"openai","wordCount":38}      ← reconoce Speaches (es OpenAI-compatible)
```
Pero escribe un **array plano**, y el propio `transcribe.cjs` de `embedded-captions` lo rechaza
(`existing transcript.json is NOT word-level … regenerating`) y **vuelve a transcribir de cero**.
Verificado: re-corrió WhisperX. **No usar el camino B para esta skill.**

Conclusión: **la transcripción NO es el problema**. Speaches sigue siendo la fuente y ambos caminos la
consumen con un rename de 3 campos. La decisión se juega en el render, no en el ASR.

### 3.4 Hallazgo extra que decide el caso de uso: el vertical de ONIA no deja aire para el hero

`safe-zones.cjs` sobre nuestro clip:

```
1216×1700 · GLOBAL coverage 84.7% · verdict FG
⚠ FG — subject fills the frame; use caption_layer:"fg" (no clean region to embed behind)
```

El sujeto ocupa el 84.7% del cuadro. El compilador igual colocó el clímax "NADA." en la única banda
"limpia" (la esquina superior) y quedó **~95% tapado por la cabeza** (`05-hyperframes-hero-oculto.jpg`).
El gate de oclusión por píxeles **es solo de modo Cinematic** (lo dice `render-theme.sh`), así que en
modo Theme nada lo detecta: `overflow(rail) PASS`, `rail-climax PASS`, y el hero es invisible.

Además, tuneo para vertical:
- `themes/README.md:180` — *"theme DNAs are tuned for 16:9; **vertical needs a DNA variant**"*.
- `theme.json` **no** expone `fontPx` ni `bottomPx`. El DNA se lee **solo** de `<skill>/themes/<dna>.json`
  (`make-theme.cjs:46`). Para vertical hay que **agregar un archivo dentro de la skill vendorizada** —
  que `hyperframes init` y `npx hyperframes skills update` **pisan** (de hecho la skill se actualizó sola
  a mitad de esta prueba, commit `96e84f2a`).
- Con `anchor` de fábrica (fontPx 46 sobre H=1700 = 2.7% del alto) el rail es legible pero **diminuto**
  y crema-sobre-crema, sin scrim ni borde.
- Con la variante vertical que armé (fontPx 72 ≈ el 4.5% que pide `rail.md`), el rail **se sale del
  cuadro**: `04-hyperframes-rail-clipped.jpg` muestra "**stoy** intentando gustarle" con la "e" cortada
  al borde izquierdo — y `check-overflow(rail)` dio **PASS**. El rail no tiene ajuste de ancho.

Y un matiz de la regla "el video se entrega intacto": en modo Theme **no es del todo cierto**. `anchor`
trae `plate: {dim 0.16, pushIn 0.012, grain 5}` y `_postfx.sh` aplica ese push-in + grano sobre el
metraje. Se nota comparando los cuadros.

---

## 4. Lo que NO pude probar (y por qué)

1. **Los otros 34 estilos del catálogo.** Probé `anchor`, la única identidad rail-verbatim comparable al
   karaoke. Los temas de espectáculo (`ordnance`, `stomp`, `terminal`, `laser`…) no compiten con el
   karaoke: no son verbatim con palabra activa. No los descarto para otro uso — los descarto para ESTE.
2. **Modo Cinematic** (`cinematic.json` → `make-cinematic.cjs`). Es puro embed detrás del sujeto y
   `safe-zones` ya dictaminó `verdict FG` sobre este metraje: no hay dónde incrustar. Probarlo pide
   metraje con aire (plano medio/abierto), que no tenemos a mano.
3. **`anchor` en 16:9 con sujeto chico**, que es su terreno. Toda mi evidencia es del vertical de ONIA.
   Es posible —y creíble— que en 16:9 se vea muy bien. No lo probé.
4. **Speaches real (VPS).** El VPS está al 88% de swap y ocupado por otra sesión (regla de la tarea), así
   que generé los timestamps localmente con WhisperX y los convertí AL shape exacto de Speaches
   (`{segments,words:[{start,end,word}]}`) para probar la interoperabilidad. El contrato probado es el
   correcto; lo que no se ejercitó es la llamada SSH.
5. **Calidad del ASR en español.** WhisperX `small` produjo "borro **a** este video" y "**resplíe**"
   (por "respiré"). Mismo orden de error que Speaches `faster-whisper-small`. No es un diferencial entre
   los dos caminos — es el modelo, y lo cubre el flag `--fix` del script propio.

---

## 5. Decisión y qué hacer

### Se queda el propio. Motivos, en orden

1. **La función central no existe del otro lado.** 0 referencias a karaoke en los 3 compiladores vivos.
2. **210× el costo por pieza** (3.4 s vs ~12 min) + 1.27 GB de intermedios + entregable 10× más pesado.
3. **El vertical necesita editar la skill vendorizada**, que se autoactualiza y pisa el cambio.
4. **Su ventaja real (hero detrás del sujeto) no aplica** al primer plano vertical: `verdict FG`.
5. El propio ya está probado en piezas reales y respeta la REGLA DE ORO (tabla de cortes + preview antes
   de quemar).

### Dónde SÍ adoptamos `embedded-captions` (no es un descarte total)

- Piezas con **aire alrededor del sujeto** (plano medio/abierto, 16:9 o vertical con margen) donde el
  clímax detrás del sujeto suma. Ahí el matting es un motor que **no tenemos** y no hay que escribir.
- **Regla de entrada:** correr `prepare.sh` y **leer `safe-zones.json` primero**. Si dice
  `verdict FG` / `coverage > 80%`, **no** usar embed: es un rail caro. Si hay banda factible, vale.
- Antes de correrla en esta máquina hay que dejar el `HYPERFRAMES_ROOT` armado (junction +
  `sharp`/`puppeteer`) — si no, `safe-zones` falla en silencio y el pipeline miente que está listo.

### Mejoras concretas al script propio (salieron de este banco)

1. **Bug — `--video` relativo rompe el quemado.** `karaoke-captions.mjs` lanza ffmpeg con
   `cwd = dirname(ASS_OUT)` pero pasa `VIDEO` tal cual; un path relativo se resuelve contra la carpeta
   del `.ass` → `No such file or directory`. Arreglo: `resolve(VIDEO)` al leer el flag.
2. **Frase huérfana de una palabra.** El token "A" de 20 ms (11.515–11.535) quedó solo ~1 s en pantalla
   (`01-side-by-side.jpg`, tercer par). `MIN_PHRASE_DUR` no lo fusiona porque el hueco siguiente
   (1.04 s) supera `MERGE_MAX_GAP`. Falta fusionar **hacia atrás** cuando no se puede hacia adelante.
   (HyperFrames cometió exactamente el mismo error con el mismo token — no es un defecto exclusivo.)
3. **Robar la idea buena, no el motor:** `safe-zones.cjs` mide cobertura del sujeto y luminancia por
   ventana. Vale invocarlo (o portar la idea) para **elegir `--margin-v` automáticamente** en vez de
   pasarlo a mano.

Ninguna se aplicó en esta pasada: la consigna era traer evidencia primero. `karaoke-captions.mjs` queda
**intacto**.

---

## 6. Reproducir esto

```bash
# 0) shim de HYPERFRAMES_ROOT (una vez, por máquina)
mkdir -p <ROOT>/packages
cmd /c mklink /J <ROOT>\packages\cli <npx-cache>\node_modules\hyperframes
cd <ROOT> && npm i sharp puppeteer
export HYPERFRAMES_ROOT='C:\...\<ROOT>'      # path estilo Windows, NO el POSIX de Git Bash

# 1) HyperFrames
npx hyperframes init hf-proj --non-interactive --video clip.mp4
bash <skill>/scripts/prepare.sh hf-proj                    # matte ∥ whisperx ∥ envelope → safe-zones
#    ⚠ verificar que safe-zones.json EXISTA: prepare.sh dice ✅ aunque no lo haya escrito
# … escribir theme.json {dna, lines, minors, hero} …
node <skill>/scripts/make-theme.cjs hf-proj
node <skill>/scripts/preview-frames.cjs hf-proj <t…>       # QA antes de renderizar
bash <skill>/scripts/render-theme.sh hf-proj               # → final_fx.mp4

# 2) ONIA (con el MISMO segments.json)
node .claude/skills/editor-videos/scripts/karaoke-captions.mjs \
  --segments <abs>/segments.json --video <abs>/clip.mp4 --out <abs>/final.mp4 --margin-v 300

# 3) Speaches → HyperFrames sin re-transcribir (camino A)
#    words.map(w => ({text: w.word, start: w.start, end: w.end, type: "word"}))
#    + {text, language_code:"es"} → <project>/transcript.json
#    node <skill>/scripts/transcribe.cjs <project>   →  "already normalized, skipping"
```

Fuentes de verdad tocadas por este informe: `.claude/skills/editor-videos/SKILL.md` (sin modificar),
`.agents/skills/embedded-captions/**` (sin modificar; la variante vertical se probó sobre una copia en
scratchpad), `CLAUDE.md` § Video.
