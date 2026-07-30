# Editor ONIA — pieza completa con Remotion **y** con HyperFrames (A/B real)

**Fecha:** 2026-07-30 · **Carril:** editor-videos · **Rama:** `claude/video-editor-improvements-428ade`
**Método:** la MISMA pieza, el MISMO crudo, el MISMO plan de tiempos. Lo único que cambia es
quién renderiza los apoyos animados. Hay renders y cuadros, no lectura de README.

---

## 0. Veredicto

> **HyperFrames queda de default; Remotion se usa cuando hay que iterar.** Las dos salidas son
> visualmente equivalentes (mismas 5 composiciones portadas, SSIM T1–T4 ya verificado en
> `scripts/hyperframes/TRANSLATION_NOTES.md`). La diferencia real es de **flujo de trabajo**:
> HyperFrames arranca sin paso de bundle y escupe secuencias PNG **la mitad de pesadas**;
> Remotion cobra ~30 s la primera vez y después renderiza cada apoyo en **4–5 s**.

| Elegí | Cuándo |
|---|---|
| **HyperFrames** (`scripts/hyperframes/render.mjs`) | Default. Un apoyo suelto, pieza puntual, disco justo. Es el motor de la casa. |
| **Remotion** (`scripts/remotion/render.mjs`) | Muchas iteraciones del MISMO apoyo en una sesión (el bundle se reusa) o si querés los sliders de Remotion Studio — el "arrastrá un slider y el código se ajusta" del reel. |

---

## 1. El banco de pruebas (reproducible)

| Ítem | Valor |
|---|---|
| Crudo | `hermes-content/references/ai-ecommerce-model/video-ads/bedroom-storytime-kling/…-audio-raw.mp4` |
| Formato | 1216×1700 vertical · 15.05 s · español · un solo sujeto |
| Transcript | Speaches `Systran/faster-whisper-small` · 3 segmentos · **37 palabras** con timestamps |
| Apoyos | `Quote` · `Stat` · `LowerThird` · 2.6 s c/u · 78 frames · PNG RGBA |
| Cadena | `zoom → apoyos → subtítulos karaoke → SFX con ducking` |
| Costo | **$0** · todo local (Speaches es self-hosted, sin plataformas pagas) |

Los cues del storyboard se escribieron **en palabras**, no en segundos:

```json
{ "beats": [
  { "cue": "otra vez",          "asset": "…/quote", "position": "center" },
  { "cue": "primera vez",       "asset": "…/stat",  "position": "top" },
  { "cue": "dejas de editarte", "asset": "…/lt",    "position": "bottom", "lead": -0.2 }
] }
```

`sync-plan.mjs` los resolvió contra el transcript real:

```
#  | dispara en | entra    | sale     | posición | apoyo
 1 | "otra vez" | 00:05.12 | 00:07.72 | center   | quote
 2 | "primera…" | 00:10.00 | 00:12.60 | top      | stat
 3 | "dejas de… | 00:13.26 | 00:15.04 | bottom   | lt
```

Detalle que importa: **"vez" aparece dos veces** (5.24 s y 10.26 s). El macheo monotónico hizo
que "primera vez" cayera en la segunda, no en la primera. Ese es exactamente el bug que aparece
cuando se ponen los tiempos a ojo.

---

## 2. Números medidos

### Render de los 3 apoyos (78 frames c/u, 1216 px de ancho)

| Apoyo | HyperFrames | Remotion |
|---|---|---|
| Quote | 24 s · 12.1 MB | **32 s** (incluye el bundle inicial) · 24.8 MB |
| Stat | 19 s · 12.4 MB | **4 s** · 22.7 MB |
| LowerThird | 16 s · 6.4 MB | **5 s** · 12.0 MB |
| **Total** | **59 s · 30.8 MB** | **41 s · 59.5 MB** |

- Remotion paga el bundle de webpack UNA vez y después vuela (4–5 s por apoyo).
- HyperFrames no tiene ese escalón, pero cada render cuesta parejo ~16–24 s.
- Las secuencias PNG de Remotion pesan **~2×**. No cambia el archivo final (el peso se va en el
  encode), sí cambia el disco mientras trabajás.

### Cadena completa (idéntica para los dos)

| Paso | Tiempo |
|---|---|
| zoom (`zoom-punch.mjs`, 4 ventanas, supersample ×2) | 7 s |
| plan de apoyos (`sync-plan.mjs`) | <1 s |
| apoyos (`overlay-visuals.mjs`) | 5–6 s |
| subtítulos karaoke (`karaoke-captions.mjs`) | 4–6 s |
| SFX con ducking (`sfx.mjs`) | 1 s |
| **Final** | `final-hyperframes.mp4` 8.34 MB · `final-remotion.mp4` 8.35 MB |

---

## 3. Los cuadros

`hermes-content/docs/assets/editor-ab-20260730/`

| Archivo | Qué muestra |
|---|---|
| `01-remotion-vs-hyperframes.png` | **La comparación principal.** 3 momentos (5.6 / 10.8 / 13.9 s), izquierda HyperFrames, derecha Remotion |
| `02-censura-pixelate.png` | `blur-faces.mjs --mode pixelate` sobre el mismo clip (YuNet, OpenCV 5) |
| `03-zoom-antes-despues.png` | El mismo instante sin zoom / con zoom (ken 1.10 → 1.20, anchor `top`) |

Videos completos en scratchpad (no versionados por peso): `…/scratchpad/ab/out/final-*.mp4`.

### Lo que se ve (y no es cosmético)

1. **t=5.6 — el Quote va a distinto ritmo.** HyperFrames ya terminó de revelar
   ("estoy intentando gustarle a todos"); Remotion todavía está revelando ("…gustarle a"). Misma
   composición, mismo `--duration`: el reveal porteado a GSAP resuelve **antes** que el de
   Remotion. No es que uno esté roto — es que **no son intercambiables frame a frame**. Si una
   pieza mezcla apoyos de los dos motores, se nota.
2. **t=10.8 — el Stat es prácticamente idéntico.** Ahí el porte es fiel (coincide con el SSIM ya
   medido). En los dos se recorta el `sublabel` al 62 % de escala: no es el motor, es la escala.
3. **t=13.9 — el LowerThird CHOCA con los subtítulos.** Los dos ponen la placa abajo y el karaoke
   escribe encima ("DEJAS DE EDITARTE" tapa el título). **Regla nueva: `bottom` es del rail de
   subtítulos.** Los apoyos van `top` / `center`, o se sube el `MarginV` del karaoke.

---

## 4. Lo que este A/B dejó en el editor

Piezas nuevas (con tests: 33 casos, `node --test .claude/skills/editor-videos/scripts/*.test.mjs`):

- **`sync-plan.mjs`** — storyboard escrito en palabras → tiempos reales del transcript. Es el
  corazón del método del reel de @human___academy (`DbTxeqsBWST`): *"cada palabra dispara un
  elemento; por eso el motion parece pegado a la voz — porque lo está"*. Macheo monotónico,
  normaliza acentos/puntuación del ASR, `until:"next"`, clamp al final del video, anti-pisada por
  posición, y **reporta el cue que no aparece en vez de inventarle un tiempo**.
- **`zoom-punch.mjs`** — faltaba por completo. `punch` (escalón por bloque, cero jitter; es lo que
  hace que el jump cut no se note) y `ken` (animado con smoothstep). Máximo 2.0× bloqueado por el
  script. En 9:16, `--anchor top`.
- **`transcribe.sh` arreglado** — transcribía haciendo `docker exec` en el contenedor del panel.
  El 2026-07-30 `onia-center` se cayó (`network easypanel not found`, exit 128) y **la
  transcripción se cayó con él aunque Speaches estaba sano**. Ahora pega directo al puerto
  publicado de Speaches en el host (`127.0.0.1:3108`) y deja el contenedor como respaldo.

### Orden del render (importa)

`cut → zoom → apoyos → subtítulos → SFX`. El zoom recorta y reescala el CUADRO: todo lo que se
pegue después queda nítido y en su lugar. Al revés, se agranda el texto ya quemado.

---

## 5. Pendiente / avisos

- **El panel `onia-center` sigue caído** (exit 128, red `easypanel` ausente en Docker). No lo toqué:
  es carril de infra (G) y tiene un solo dueño. La transcripción ya no depende de él.
- **La censura no es garantía de anonimato.** En este primer plano el recuadro + padding tapa
  ~90 % del cuadro (correcto para proteger, feo si lo que querías era tapar solo la cara de un
  tercero). Revisar siempre el render antes de publicar.
- **Higgsfield no se usó**: nada de esta pieza lo necesitaba (los apoyos se dibujan en código —
  *"IA erra letra, código não"*). Queda para b-roll generativo, con OK explícito y costo a la vista.
