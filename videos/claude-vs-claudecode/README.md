# Video "Claude vs Claude Code" — corte y edición

Dos crudos de OBS (`E:\ONIA-YouTube\grabaciones\`), editados con el pipeline de la skill
`editor-videos`. Los `.mp4` y las secuencias PNG **no se versionan** (`videos/.gitignore`):
se rehacen con los `cutplan-*.json` y los HTML de `assets/`, que sí están acá.

| crudo | qué es | salida | dura |
|---|---|---|---|
| `clip 1 video 2.mp4` | intro a cámara | `final/clip-1-video-2-intro.mp4` | 33.8s → **13.0s** |
| `clip 2 video 1.mp4` | screencast del deck | `final/clip-2-video-1-explicacion.mp4` | 511.5s → **416.6s** |

**El entregable es `final/claude-vs-claude-code-completo.mp4`** (7:10, 80 MB): intro +
explicativo + endcard, con la cama de música.

**Cada pieza se rinde en UNA sola pasada.** La primera versión encadenaba re-encodes — el
intro pasaba por cut → composición → zoom → master (tres generaciones) y el explicativo por
cut → tapa → master (dos) — y terminaba en **0,78 Mbps** cuando el crudo del intro va a
**10,3** y el del explicativo a **2,1**. Ahora el corte, los overlays y el zoom van en un solo
`filter_complex` a CRF 13-15 preset slow: el intro subió a **8,3 Mbps** y el conjunto a **1,5**.
Medido comparando el mismo cuadro de las dos versiones: en el tramo de **cámara** hay
diferencia real (PSNR 40,8 dB entre ellas — se ven los pelos sueltos y la textura de la piel
que antes eran manchas de compresión); en el **deck** no la hay (61,5 dB ≈ idénticos), porque
un gráfico plano ya se comprimía perfecto. **El bitrate se gasta donde hay cámara, no donde
hay láminas.** Los dos parciales quedan por si hay que rehacer una parte.
También sale de acá `final/miniatura.png` (1280×720).

**Música** (`scripts/pad-musica.sh` → `assets/pad.wav`): un pad lento sintetizado con ffmpeg,
progresión de ocho acordes en La menor (Am F C G Am Dm F E), 14s cada uno con crossfade de 6s.
El octavo resuelve al primero, así que el punto de loop es musical y no se oye. Se sintetiza y
no se baja de librería porque las dos rutas de BGM de `media-use` piden lo que no hay (HeyGen
necesita credencial; Lyria, `GEMINI_API_KEY`; MusicGen, ~2 GB de torch) y Pixabay no expone la
URL del mp3 sin interactuar con la página.

Dos correcciones que salieron de **mirar el espectrograma**, no de escuchar:
- Los acordes **latían**: con un `afade` de 3,2s dentro de cada uno *más* el crossfade, en la
  unión los dos estaban en su fade y la música casi se apagaba cada 8s. El fade interno pasó a
  ser solo anti-clic (0,6s) y la transición la hace el crossfade.
- Toda la energía caía en **100-1100 Hz**, justo donde vive la voz. Las notas bajaron **una
  octava**: el pad ocupa 70-500 Hz, por debajo de la narración.

Nivel verificado restando el audio con y sin música: la cama queda **17 dB por debajo de la
voz**, y sube 8 dB en el endcard, que es el único tramo sin narración.

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
```**Miniatura** (`scripts/buscar-todos.py` → `hoja-caras.py` → `mini-capa.py` +
`assets/miniatura.html` → `final/miniatura.png`). Gramática de las de Adrián Sáenz, miradas de
verdad el 2026-09-08 (bajadas de su canal): fondo oscuro con luz cálida, cara **muy** grande
pegada al borde derecho, texto blanco enorme con sombra y subrayado de acento, y los objetos
del tema flotando en el hueco libre.

**El frame se busca puntuando, no se elige a ojo.** `buscar-todos.py` barrió los 19 archivos de
la carpeta y puntuó **3.723 caras** con YuNet (nitidez, frontalidad, sonrisa, boca cerrada); el
elegido — `ONIA-YT-2026-09-08-00-22-06.mp4 @ 14.6s` — no está en el video editado sino en otra
toma del mismo día, misma ropa y mismo set. Elegir a ojo del tramo "donde parece que sonríe"
falló tres veces seguidas. El método completo y las siete trampas medidas están en la skill
`editor-videos` § "Miniatura de YouTube"; las tres que más cuestan:

- **El ancho de boca NO mide sonrisa: mide que está HABLANDO.** El primer scoring lo usaba y el
  top 12 salió entero con la boca abierta a media palabra.
- **El fondo es el mismo frame desenfocado, y eso es el arreglo del recorte, no decoración.**
  `rembg` no separa camiseta negra de silla negra (probado con `u2net_human_seg` e
  `isnet-general-use`); sobre su propia imagen el error desaparece. El sujeto se separa con luz.
- **Cambiar de frame sale más barato que pelear con la máscara.** Dos veces se fue por filtros y
  las dos veces el resultado fue peor.

Se revisa a **210 px de ancho**, que es como se ve en el feed.
