# Video "Claude vs Claude Code" — corte y edición

Dos crudos de OBS (`E:\ONIA-YouTube\grabaciones\`), editados con el pipeline de la skill
`editor-videos`. Los `.mp4` y las secuencias PNG **no se versionan** (`videos/.gitignore`):
se rehacen con los `cutplan-*.json` y los HTML de `assets/`, que sí están acá.

| crudo | qué es | salida | dura |
|---|---|---|---|
| `clip 1 video 2.mp4` | intro a cámara | `final/clip-1-video-2-intro.mp4` | 33.8s → **13.0s** |
| `clip 2 video 1.mp4` | screencast del deck | `final/clip-2-video-1-explicacion.mp4` | 511.5s → **416.6s** |

También sale de acá `final/miniatura.png` (1280×720).

## Decisiones que no son obvias

**El intro tenía TRES tomas del mismo gancho.** Whisper las devuelve casi idénticas y
`cut-plan.mjs` no las marca como repetición (compara segmentos consecutivos y el texto
difiere). Se conserva **la tercera desde su reinicio limpio** (18.35–31.37 del crudo): es
la única que encadena el gancho con el cierre sin costura, así que el clip queda en **un
solo bloque** — cero empalmes. El inicio se bajó de 18.49 a 18.35 porque el bloque que
detecta `silencedetect` empieza 0.25s DESPUÉS de la palabra según el transcript, y a 18.49
se comía la "C" de Claude.

**Los retakes se cortan a mano: se deja SIEMPRE el último intento** (`scripts/retakes-main.json`,
regla de Sergio Urcullo: repite porque el último es el que le sale bien). `cut-plan.mjs` no los
detecta — compara segmentos consecutivos y el transcriptor devuelve textos parecidos pero no
iguales. Diez cortes, 27.3s. El peor era el CTA final: **tres arranques** de "y ahora si te
gustaría que en otro video", 10.7s de silencio en el medio y un "te enseñé cómo vídeo," trabado.
Ningún intento estaba completo, así que se pegó el tercero con el remate. Se dejaron los énfasis
("uno por uno, uno por uno, uno por uno") — son retórica, no errores.

**El pase de deck a cámara al final estaba partido en tres saltos.** Entre el fin de la última
lámina y el CTA quedaban dos bloques sin una sola palabra (0.42s y 0.45s: ruido de sala y el
cambio de escena de OBS). Medido cuadro a cuadro, el peor salto daba delta 13.4 contra un promedio
de 0.92. Tirándolos queda **un** corte de lámina a cámara — un cambio de escena, que se lee como
tal — y el mayor salto restante bajó a 6.0. Por eso el explicativo NO lleva zoom ni transiciones:
no hay jump cut que disimular.

**El main se cortó con `--min-sil 0.6`, no con 0.45.** Medido sobre los mismos silencios:
0.45 daba **102 costuras** en 8 minutos (una cada 4s) y −85s; 0.6 da **59** y −71.6s. En un
screencast con cursor a la vista, picar cada respiración de 0.3s se nota más de lo que
suma. `scripts/mk-plan.mjs` reconstruye `keep[]` con otro umbral **sin volver a correr
`silencedetect`** (511s de audio por corrida), reusando `speechFromSilence` de la skill para
que el filtro salga idéntico.

**El screencast se grabó con el teleprompter del deck VISIBLE.** Franja inferior, texto
blanco: *"LA COMPARATIVA. lámina que la gente pausa y guarda — dale aire, 50 segundos."*
Son notas internas y estaban en TODO el tramo del deck. Se tapan con `assets/tapa-notas.html`
(crema `#F4EFE8` del deck + el handle repuesto con su fuente real, porque quedaba justo
encima y se perdía con la tapa). Dos límites medidos, no estimados:
- **x < 1440**: ahí empieza el PiP de la cámara, en las tres alturas que se probaron.
- **t < 418.7s**: a los 418.77s el screencast pasa a **cámara a pantalla completa** y ahí la
  tapa estaría pintando encima de la imagen. Se detectó midiendo la desviación de la banda
  superior (deck = plano, cámara = textura).

**Las tarjetas van donde apunta el dedo.** En la toma conservada Sergio Urcullo señala
arriba-derecha al decir "Claude" (x≈1145) y arriba-izquierda al decir "Claude Code"
(x≈628). Las dos tarjetas están puestas sobre esos puntos y entran en el timestamp de
esas palabras.

**El título pasa por DETRÁS.** Se recorta a la persona con `rembg` (`scripts/matte.py`,
`u2net_human_seg`, 241 frames del tramo 4.70–12.70) y se compone en tres capas:
`título → persona → tarjetas`. Está en **dos líneas alineadas a la izquierda**: centrado a
una línea, la cabeza le comía justo el "vs" y se leía "Claude v…laude Code".

**El sistema visual es el del deck que ya grabó**
(`hermes-content/carousels/out/yt-claude-vs-claude-code/deck.html`): mismas tres fuentes,
mismo tracking `-0.032em`, mismo terracota `#D97757`. El verde de Onia `#00D26A` entra solo
como acento. Nada se inventó ni se generó con IA.

## Rehacer

```bash
# 1. transcribir (faster-whisper local, gratis)
python scripts/transcribe_local.py scripts/main.wav scripts/segments-main.json
# 2. cut-list + preview 360p  -> se MIRAN antes de cortar (regla de oro)
node ../../.claude/skills/editor-videos/scripts/cut-plan.mjs scripts/segments-main.json --video "<crudo>"
node ../../.claude/skills/editor-videos/scripts/preview.mjs  --video "<crudo>" --cutplan scripts/cutplan-main.json --out-dir renders
# 3. capas de gráficos (HTML animado -> PNG con alpha, un frame por ?t=)
node scripts/render-overlay.mjs --html assets/intro-overlay.html --query "only=cards"  --out-dir renders/ovl-cards  --dur 4.6
node scripts/render-overlay.mjs --html assets/intro-overlay.html --query "only=titulo" --out-dir renders/ovl-titulo --dur 13.02
# 4. master de audio (-14 LUFS) SIEMPRE al final
node ../../.claude/skills/editor-videos/scripts/master.mjs --video renders/intro-comp.mp4 --out final/clip-1-video-2-intro.mp4
```
