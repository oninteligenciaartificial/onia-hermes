# scripts/remotion — apoyos visuales ANIMADOS (ONIA)

Reemplazo animado de `.claude/skills/editor-videos/scripts/make-mockup.mjs`. En vez de
HTML/CSS → Chromium headless → **PNG estático**, este proyecto Remotion hace
HTML/CSS+React → Chromium (el que trae Remotion) → **clip animado con alpha**
(WebM vp8/vp9 transparente, o secuencia de PNG). El resultado se sigue pegando
al video real con `overlay-visuals.mjs` — ese script quedó tocado apenas lo
necesario para poder leer una carpeta (secuencia) además de un PNG suelto.

No reemplaza make-mockup.mjs: para un apoyo que no necesita moverse (una cita
fija en pantalla, por ejemplo) el PNG estático sigue siendo más liviano. Usá
esto cuando el apoyo tiene que animarse (contar un número, revelar texto,
deslizar contenido).

## Instalación

```bash
cd scripts/remotion
npm install
```

Todo corre LOCAL (nunca en el VPS) y es gratis (Remotion es open-source; no usa
Higgsfield/ElevenLabs/fal ni ninguna plataforma paga). La primera vez que
renderizás, Remotion descarga un Chrome Headless Shell propio (~110 MB, una
sola vez, se cachea en `%LOCALAPPDATA%`).

## Render — `render.mjs`

Misma ergonomía que `make-mockup.mjs`: flags de línea de comando o `--props`
con JSON.

```bash
node render.mjs --comp Stat --out assets/stat.webm \
  --props '{"value":"6","label":"DOCTORES","sublabel":"probando el sistema"}'

node render.mjs --comp Browser --out assets/web.webm \
  --props '{"urlLabel":"dentalgest.com","image":"capturas/panel.png"}'

node render.mjs --comp Phone --out assets/app.webm \
  --props '{"title":"Reservá tu cita","subtitle":"en 2 toques","image":"capturas/chat.jpg"}'

node render.mjs --comp Quote --out assets/cita.webm \
  --props '{"text":"3 doctores más en el sistema","attribution":"día 5 del reto"}'

node render.mjs --comp LowerThird --out assets/placa.webm \
  --props '{"eyebrow":"ONIA","title":"Dental Gest","subtitle":"gestión de clínicas dentales"}'

node render.mjs --list        # composiciones disponibles
node render.mjs --comp Stat --out x.webm --props '{...}' --dry-run   # solo valida, no renderiza
```

Flags:

| Flag | Qué hace |
|---|---|
| `--comp <Stat\|Browser\|Phone\|Quote\|LowerThird>` | composición a renderizar (requerido) |
| `--out <archivo o carpeta>` | salida. `.webm` con `--format webm` (default); carpeta con `--format png-sequence` |
| `--props '<json>'` | props inline, mismas keys que `defaultProps` de cada composición |
| `--props-file <archivo.json>` | props desde archivo (`--props` gana si se pasan los dos) |
| `--width --height --duration --fps` | overrides sueltos, ganan sobre `--props` (`--duration` en segundos) |
| `--accent <#hex>` `--theme dark\|light` | igual criterio que make-mockup.mjs |
| `--format webm\|png-sequence` | default `webm` |
| `--codec vp8\|vp9` | default `vp8` (solo aplica a `--format webm`) |
| `--serve-url <carpeta>` | reusa un bundle ya generado (salta el paso de webpack, ahorra ~2-10s por render) |
| `--print-serve-url` | imprime la ruta del bundle para poder reusarla con `--serve-url` en la próxima llamada |
| `--dry-run` | resuelve composición/props y sale, no renderiza |

El flag `image` (Browser y Phone) acepta una ruta de archivo local — `render.mjs`
la convierte a `data:` URI antes de renderizar (self-contained, igual criterio
que make-mockup.mjs: cero red durante el render). También podés pasar una data
URI ya armada si llamás el script programáticamente.

## Las 5 composiciones

Todas viven en `src/compositions/`, comparten tokens de diseño (`src/lib/tokens.ts`
— **mismos colores que `make-mockup.mjs`**: acento `#FF7A00`, ink `#0A0C11`/`#15181F`,
fuente del sistema, sin CDN) y las mismas curvas de easing (`src/lib/easing.ts`
— exponencial de salida, **nunca bounce/elastic**).

- **Stat** — tarjeta de dato. El número cuenta hacia arriba (si `value` es un
  número puro tipo `"6"` o `"1200"`; si no, como `"24/7"`, se revela directo).
  Riel de acento crece, label/sublabel entran en cascada un poco después.
- **Browser** — ventana de navegador. Entra con un pop de escala. Dots y pill
  de URL aparecen en cascada. La captura (o el estado vacío) se revela con un
  wipe de abajo hacia arriba (`clip-path`).
- **Phone** — mockup de celular. El marco entra desde abajo. La captura hace
  un drift vertical lento y continuo durante todo el clip (contenido que se
  desliza, la diferencia real contra el PNG estático).
- **Quote** — cita con revelado tipográfico. `revealBy: "word"` (default) anima
  palabra por palabra; `revealBy: "line"` anima por línea (respeta `\n` del
  autor). La atribución entra al final, deslizándose desde la izquierda.
- **LowerThird** — placa inferior. El riel de acento hace un wipe
  izquierda→derecha; el texto entra deslizándose desde la izquierda. Sale
  bajando y desvaneciéndose MÁS RÁPIDO que la entrada.

Props completas de cada una: ver el `interface` al principio de cada archivo en
`src/compositions/`.

## Reglas de animación (por qué se ve así)

- Solo se anima `transform`, `opacity`, `clip-path` — nunca layout (`width`,
  `top`, `margin`, etc.), ver `rules/web/coding-style.md`.
- Curvas de salida SIEMPRE exponenciales/polinómicas (`src/lib/easing.ts`).
  `EASE_OUT_EXPO` es la MISMA curva que `--ease-out-expo` en los tokens CSS de
  web-factory (`cubic-bezier(0.16, 1, 0.3, 1)`) — la marca se mueve igual en
  web y en video. Nada de bounce/elastic/spring físico.
- Entrada 200-350ms, salida 150-250ms (siempre más rápida que la entrada).
- Determinista: nada de `Date.now()` / `Math.random()` en `src/compositions/**`
  ni en `src/lib/**` — mismos props → mismo video, frame por frame.

## Alpha real: qué funciona y qué no (en esta máquina)

**El encode es correcto.** Remotion + Chromium graban el canal alpha real: el
WebM resultante tiene el tag `alpha_mode=1` y cada paquete de video trae un
side-data `Matroska BlockAdditional` (la segunda pista VP8 con el alpha).
Verificado con `ffprobe -show_packets`.

**El decode LOCAL de ese alpha está roto en este ffmpeg** (`ffmpeg version
8.1.1-essentials_build` de gyan.dev, Windows). Probado de tres formas
independientes (una totalmente ajena a Remotion: encodear a mano un frame
mitad opaco/mitad transparente con `libvpx` y volver a leerlo) — en las tres,
el canal alpha vuelve como `255` (opaco) en TODA la imagen, sin importar lo que
se haya encodeado. Es una limitación del build de ffmpeg de esta máquina, no
de Remotion ni de este proyecto — y como `overlay-visuals.mjs` también shellea
al ffmpeg del sistema, hereda la misma limitación al leer un `.webm` con alpha.

**Por eso la vía recomendada para este pipeline es `--format png-sequence`.**
Cada frame es un PNG con alpha real (no depende de decodificar VP8): probado
con `ffprobe`/lectura de píxel crudo, alpha `0` en el borde transparente y
`255` en el cuerpo opaco de la tarjeta, exactamente como se espera.
`overlay-visuals.mjs` ya sabe leer una carpeta de secuencia (ver abajo) — el
`.webm` sigue siendo útil para: (a) verlo directo en un navegador (Chrome/
Firefox sí decodifican alpha de WebM nativamente, per la doc de Remotion), o
(b) una máquina con otro build de ffmpeg que sí decodifique el alpha VP8.

Si en otra máquina el `.webm` decodifica bien (probalo con el mismo método:
componer sobre rojo y sobre azul, ver si el borde cambia de color), usar
`--format webm` es más liviano y más simple.

## Integración con `overlay-visuals.mjs`

`overlay-visuals.mjs` (`.claude/skills/editor-videos/scripts/overlay-visuals.mjs`)
recibe el mismo `asset` de siempre en el plan — si es un **archivo** (PNG),
sigue exactamente el camino de antes (loop + fade), intacto. Si es una
**carpeta** (secuencia PNG de `render.mjs --format png-sequence`), la lee como
secuencia numerada de imágenes (detecta el patrón `element-%02d.png` que usa
Remotion, sin asumir el ancho de ceros a mano) y NO la loopea (ya son frames
reales). El resto del filtro (`scale`, `position`, `fade`, `enable`) funciona
igual para ambos casos.

```json
{
  "overlays": [
    {
      "asset": "scripts/remotion/assets/stat_frames",
      "start": 1.0,
      "end": 4.0,
      "position": "top",
      "scale": 0.6
    }
  ]
}
```

Si la secuencia dura distinto que la ventana `end - start`, el script avisa
(no falla) — igual criterio que los avisos de `fade` que ya existían.

## Verificado de verdad (no solo "debería andar")

- `node render.mjs --comp Stat --out assets/stat.webm --props '...'` — renderizó
  un `.webm` real de 90 frames, encode vp8/yuva420p confirmado con `ffprobe`
  (`TAG:alpha_mode=1`, side-data `Matroska BlockAdditional` por frame).
- `node render.mjs --comp Stat --out assets/stat_frames --format png-sequence
  --props '...'` — 90 PNG con alpha real confirmado leyendo píxeles crudos
  (esquina `00000000`, cuerpo de tarjeta `..ff`).
- Las 5 composiciones (`Stat`, `Browser`, `Phone`, `Quote`, `LowerThird`)
  renderizaron sin error con props reales y se inspeccionaron frame por frame
  (se encontró y corrigió un bug real: 4 de las 5 desbordaban el lienzo por no
  descontar el padding del stage del ancho del "chrome" — ver commits).
- Pipeline completo: un video base sintético (`testsrc2`, 1080×1920, 6s) +
  `overlay-visuals.mjs` con la secuencia PNG de `Stat` como asset → el MP4
  final muestra la tarjeta genuinamente compuesta con transparencia sobre el
  patrón de fondo (visible en `assets/overlay-proof-frame.png`, frame extraído
  del resultado), y NO aparece antes de `start` (chequeado en t=0.5s).
